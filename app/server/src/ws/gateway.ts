import type { WebSocket, WebSocketServer } from 'ws';
import { logger } from '../log.js';
import { RateLimiter } from './ratelimit.js';
import {
  RESERVED_COMMANDS,
  type ClientToServerMsgs,
  type ServerToClientMsgs,
} from './protocol.js';
import type { LevelsService } from '../levels/service.js';
import { currentLevelId } from '../levels/service.js';
import { sessionManager, type SessionRecord } from '../docker/manager.js';
import { GameEngine, engineHelp } from '../engine/engine.js';
import { rankForXp } from '../engine/gamification.js';
import { ensurePlayer, getPlayer, getProgress } from '../progress/db.js';

/**
 * Gateway WebSocket: sesión ⇄ terminal + interceptación de comandos del dojo.
 *
 * Interceptación por prefijo: mientras la línea tecleada es prefijo de un
 * comando reservado (submit, hint, goal, status, next, reset, solution, help),
 * se retiene el input (eco local) y no llega al shell. Al pulsar Enter:
 *  - commando reservado → se ejecuta en el motor, sin tocar el shell
 *  - no reservado → se envía el buffer retenido + Enter al shell (comportamiento normal)
 * Así no hay artefactos ni ^C extra en la terminal.
 */

interface ConnState {
  ip: string;
  playerId: string | null;
  session: SessionRecord | null;
  engine: GameEngine | null;
  // ── mini-readline del gateway ──────────────────────────────────────────
  // En modo retención (en el prompt del dojo) el buffer propio del gateway
  // sustituye al de bash: si reenviáramos teclas de edición al shell tal
  // cual, bash tendría su línea vacía (retención = nada llega Enter)
  // y las flechas/historial se desincronizarían. El gateway implementa el
  // editor completo y al Enter entrega SOLO el bloque final al shell.
  buf: string;              // línea en edición (eco local)
  pos: number;              // posición del cursor en buf (0..buf.length)
  esc: string;              // secuencia escape a medio parsear (puede partirse entre chunks)
  histIdx: number;          // índice en history; -1 = línea actual
  draft: string;            // lo que se estaba tecleando al entrar en historial
  history: string[];        // historial de líneas Enter-committeadas (sesión WS)
  promptRaw: string;        // bytes del prompt de la ÚLTIMA línea (para Ctrl+L)
  promptCols: number;       // ancho visible del prompt anterior
  cols: number;             // columnas reportadas por el cliente (resize)
  atPrompt: boolean;
  hold: string;             // teclas retenidas mientras el prompt del dojo no llegó aún
  holdTimer: NodeJS.Timeout | null; // pase-through retardado (p. ej. subshell sin OSC)
  holdDrained: boolean;     // true = ya se soltó el hold como passthrough (no reenviar)
  connectedAt: number;
  lastNoSessionAt: number;   // throttle del aviso «sin sesión»
}

const connStates = new Map<WebSocket, ConnState>();
const connLimiter = new RateLimiter(6, 30);
const msgLimiter = new RateLimiter(240, 480);
const submitLimiter = new RateLimiter(12, 60);

function send(ws: WebSocket, msg: ServerToClientMsgs): void {
  try {
    ws.send(JSON.stringify(msg));
  } catch {
    /* conn closed */
  }
}

function sendText(ws: WebSocket, text: string): void {
  // La terminal muestra \n como «baja de línea manteniendo la columna»: sin
  // \r previo los banners del dojo quedan escalonados hacia la derecha. Todo
  // el texto generado por el dojo se normaliza aquí a \r\n.
  send(ws, { type: 'data', payload: { data: text.replace(/\r?\n/g, '\r\n') } });
}

export function attachGateway(wss: WebSocketServer, service: LevelsService): void {
  setInterval(() => {
    connLimiter.sweep();
    msgLimiter.sweep();
    submitLimiter.sweep();
    for (const [ws, st] of connStates) {
      if (st.session && !st.session.session.isAlive()) {
        st.session = null;
        st.engine = null;
        if (ws.readyState === 1) {
          sendText(ws, '\r\n\x1b[90m(la sesión expiró por inactividad; usa start para reanudar)\x1b[0m\r\n');
        }
      }
    }
  }, 30_000).unref?.();

  wss.on('connection', (ws: WebSocket, req) => {
    const ip = clientIp(String(req.headers['x-forwarded-for'] ?? '') || req.socket.remoteAddress || '');
    if (!connLimiter.allow(ip)) {
      ws.close(4299, 'rate limited');
      return;
    }
    connStates.set(ws, { ip, playerId: null, session: null, engine: null, buf: '', pos: 0, esc: '', histIdx: -1, draft: '', history: [], promptRaw: '', promptCols: 0, cols: 80, atPrompt: false, hold: '', holdTimer: null, holdDrained: false, connectedAt: Date.now(), lastNoSessionAt: 0 });
    ws.on('message', (raw) => handleMsg(ws, raw, service));
    ws.on('close', (code, reason) => void onConnClose(ws, code, reason.toString('utf8')));
    ws.on('error', () => undefined);
  });
}

/**
 * Gracia tras cerrar el WS: antes de soltar la sesión (y su slot per-IP)
 * esperamos a ver si el jugador reconecta. Sin esto, una pestaña cerrada
 * ocupaba un slot hasta el idle-sweep completo (15 min) y las siguientes
 * entradas se topaban con «no se pudo iniciar la sesión».
 */
const wsCloseGraceMs = 120_000;
const closeGraceTimers = new Map<string, NodeJS.Timeout>(); // playerId → timer

function scheduleCloseGrace(playerId: string): void {
  if (!sessionManager.get(playerId)) return; // sin sesión, nada que soltar
  const prev = closeGraceTimers.get(playerId);
  if (prev) clearTimeout(prev);
  const t = setTimeout(() => {
    closeGraceTimers.delete(playerId);
    // solo si no reconectó (el hello cancela/reprograma este timer)
    void sessionManager.drop(playerId, 'ws closed (grace vencida)');
  }, wsCloseGraceMs);
  if (t.unref) t.unref();
  closeGraceTimers.set(playerId, t);
  logger.debug({ playerId: playerId.slice(0, 8), graceMs: wsCloseGraceMs }, 'ws close grace scheduled');
}

export function cancelCloseGrace(playerId: string): void {
  const t = closeGraceTimers.get(playerId);
  if (t) {
    clearTimeout(t);
    closeGraceTimers.delete(playerId);
  }
}

function clientIp(forwarded: string): string {
  if (!forwarded) return 'unknown';
  return forwarded.split(',')[0].trim();
}

async function onConnClose(ws: WebSocket, code = 1006, why = ''): Promise<void> {
  const st = connStates.get(ws);
  connStates.delete(ws);
  if (!st) return;
  cancelHold(st); // sin timer colgando tras el cierre
  // el contenedor se mantiene un rato (reconexión); con la gracia de cierre el
  // slot per-IP se libera pronto si el jugador no vuelve (antes: 15 min colgado)
  if (st.playerId) {
    sessionManager.removeConn(st.playerId);
    scheduleCloseGrace(st.playerId);
  }
  logger.info({ playerId: st.playerId?.slice(0, 8), ip: st.ip, code, why: why || undefined }, 'ws closed');
}

function handleMsg(ws: WebSocket, raw: unknown, service: LevelsService): void {
  const st = connStates.get(ws);
  if (!st) return;
  let msg: ClientToServerMsgs;
  try {
    const parsed = JSON.parse(String(raw)) as { type: string; payload?: unknown };
    msg = { type: parsed.type, payload: (parsed.payload ?? {}) as never } as ClientToServerMsgs;
  } catch {
    send(ws, { type: 'error', payload: { message: 'mensaje inválido' } });
    return;
  }
  if (!msgLimiter.allow(st.ip)) {
    send(ws, { type: 'error', payload: { message: 'demasiados mensajes; espera un momento' } });
    return;
  }
  if (!st.playerId) {
    if (msg.type !== 'hello') {
      send(ws, { type: 'error', payload: { message: 'falta hello { playerId }' } });
      return;
    }
    const playerId = String((msg.payload as { playerId: string }).playerId ?? '');
    if (!/^[\w-]{8,64}$/.test(playerId)) {
      send(ws, { type: 'error', payload: { message: 'playerId inválido' } });
      return;
    }
    st.playerId = playerId;
    cancelCloseGrace(playerId); // reconexión: la sesión sigue viva
    sessionManager.addConn(playerId);
    const row = ensurePlayer(playerId);
    const rank = rankForXp(row.xp);
    // progreso por track para el sidebar y el navegador de niveles
    const solvedSet = new Set(getProgress(playerId).filter((p) => p.solved === 1).map((p) => p.level_id));
    const trackCounts = service.tracks.map((t) => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      color: t.color,
      description: t.description,
      order: t.order,
      levels: service.ordered.filter((l) => l.track === t.id).length,
      solved: service.ordered.filter((l) => l.track === t.id && solvedSet.has(l.id)).length,
    }));
    send(ws, {
      type: 'welcome',
      payload: {
        playerId,
        xp: row.xp,
        rank: rank.name,
        rankIndex: rank.index,
        nextRankAt: rank.nextAt,
        levelId: null,
        tracks: trackCounts,
      },
    });
    return;
  }
  void routeMsg(ws, st, msg, service);
}

async function routeMsg(ws: WebSocket, st: ConnState, msg: ClientToServerMsgs, service: LevelsService): Promise<void> {
  const playerId = st.playerId as string;
  switch (msg.type) {
    case 'start': {
      const wanted = (msg.payload as { levelId?: string }).levelId;
      await startLevel(ws, st, playerId, wanted, service);
      return;
    }
    case 'input': {
      const data = (msg.payload as { data: string }).data ?? '';
      onInput(ws, st, data);
      return;
    }
    case 'resize': {
      const p = msg.payload as { cols: number; rows: number };
      st.cols = Math.max(20, Math.min(500, Math.round(p.cols) || 80));
      st.session?.session.resize(p.cols, p.rows);
      return;
    }
    case 'submitFlag': {
      const flag = (msg.payload as { flag: string }).flag ?? '';
      await onSubmitFlag(ws, st, flag);
      return;
    }
    case 'hintRequest': {
      await doHint(ws, st);
      return;
    }
    case 'goalRequest': {
      sendText(ws, `\r\x1b[38;5;142mgoal>\x1b[0m ${st.session?.level.goal ?? '(sin nivel activo)'}\r\n`);
      return;
    }
    case 'statusRequest': {
      await doStatus(ws, st);
      return;
    }
    case 'solutionRequest': {
      await doSolution(ws, st);
      return;
    }
    case 'next': {
      await startLevel(ws, st, playerId, undefined, service, { explicitNext: true });
      return;
    }
    case 'reset': {
      await startLevel(ws, st, playerId, st.session?.level.id, service, { label: 'regenerando escenario…' });
      return;
    }
    default:
      send(ws, { type: 'error', payload: { message: 'tipo no soportado' } });
  }
}

async function startLevel(
  ws: WebSocket,
  st: ConnState,
  playerId: string,
  levelId: string | undefined,
  service: LevelsService,
  opts: { explicitNext?: boolean; label?: string } = {},
): Promise<void> {
  let level;
  if (levelId) {
    level = service.all.get(levelId);
    if (!level) {
      send(ws, { type: 'error', payload: { message: `nivel ${levelId} no existe` } });
      return;
    }
  } else {
    const cur = st.session?.level.id;
    if (opts.explicitNext) {
      const nextId = cur ? service.nextLevelId(cur) : null;
      if (!nextId) {
        sendText(ws, '\r\n\x1b[38;5;110mNo hay más niveles. ¡Eres Maestro del Shell!\x1b[0m\r\n');
        return;
      }
      level = service.all.get(nextId);
    } else {
      level = service.all.get(currentLevelId(service, playerId));
    }
  }
  if (!level) {
    send(ws, { type: 'error', payload: { message: 'no hay nivel disponible' } });
    return;
  }
  cancelHold(st); // el nivel nuevo empieza limpio: sin teclas retenidas
  resetEdit(st);
  st.atPrompt = false;
  if (opts.label) sendText(ws, `\r\n\x1b[38;5;110m${opts.label}\x1b[0m\r\n`);
  try {
    const rec = await sessionManager.create(playerId, st.ip, level, {
      onData: (chunk: string) => onShellData(ws, st, chunk),
      onExit: () => {
        if (st.session?.session.id === rec.session.id) {
          st.session = null;
          st.engine = null;
        }
        send(ws, { type: 'exit', payload: { reason: 'contenedor terminado' } });
      },
    });
    // ¡el contenedor realmente se levanta aquí! (create solo registra)
    await rec.session.start();
    st.session = rec;
    st.engine = new GameEngine(playerId, level, rec);
    const solved = getProgress(playerId).some((p) => p.level_id === level.id && p.solved === 1);
    send(ws, {
      type: 'levelState',
      payload: { level: service.publicLevel(level, solved) as never, startedAt: rec.startedAt },
    });
  } catch (e) {
    const why = (e as Error).message;
    logger.error({ why, level: level.id }, 'session create failed');
    send(ws, { type: 'error', payload: { message: `no se pudo iniciar la sesión: ${why}` } });
  }
}

function drainHoldAsPassthrough(ws: WebSocket, st: ConnState): void {
  if (st.holdTimer) { clearTimeout(st.holdTimer); st.holdTimer = null; }
  const pending = st.hold;
  st.hold = '';
  st.holdDrained = true;
  if (pending) st.session?.session.write(pending);
}

function cancelHold(st: ConnState): void {
  if (st.holdTimer) { clearTimeout(st.holdTimer); st.holdTimer = null; }
  st.hold = '';
  st.holdDrained = false;
}

function onShellData(ws: WebSocket, st: ConnState, chunk: string): void {
  // estado del hold ANTES de procesar este chunk (el flush del marcador lo usa)
  const holdPending = st.holdDrained ? '' : st.hold;
  const wasDrained = st.holdDrained;
  cancelHold(st);
  const marker = chunk.indexOf('\x1b]133;A');
  if (marker !== -1) {
    st.atPrompt = true;
    resetEdit(st);
    // prompt visible de la ÚLTIMA línea del prompt (arena-prompt es de 2 líneas):
    // todo lo que va del salto de línea anterior al marcador OSC, ya sin ANSI
    const ps1 = chunk.slice(0, marker);
    const nl = ps1.lastIndexOf('\n');
    const tail = ps1.slice(nl + 1);
    st.promptRaw = tail
      // eslint-disable-next-line no-control-regex -- parsear ANSI exige bytes de control
      .replace(/\x1b\][^\x07]*(?:\x07|\x1b\\)/g, '')
      // eslint-disable-next-line no-control-regex -- idem: secuencia CSI
      .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
    st.promptCols = st.promptRaw.length;
  } else if (!st.atPrompt && /(?:^|\n)\s*[$#] ?$/.test(chunk)) {
    st.atPrompt = true;
    resetEdit(st);
    st.promptRaw = '';
    st.promptCols = 0;
  }
  if (st.atPrompt) {
    // sincroniza el readline del bash: si las teclas anticipadas ya se
    // soltaron como passthrough (holdDrained), bash puede tener una línea a
    // medio construir delante del prompt que llega ahora — Ctrl+U la limpia
    // antes de que el editor del gateway tome el control. Hacerlo SIEMPRE es
    // seguro: en un prompt recién pintado la línea de bash está vacía y el
    // Ctrl+U no es más que un no-op.
    if (wasDrained) st.session?.session.write('\x15');
  }
  // el chunk del browser SIEMPRE: contiene la salida del shell (banner, prompt)
  send(ws, { type: 'data', payload: { data: chunk } });
  // las teclas retenidas se entregan al editor DESPUÉS de que el cliente pinta
  // el prompt (mismo procesado que si acabaran de llegar).
  if (st.atPrompt && holdPending) onInput(ws, st, holdPending);
}


// ── primitivas de render del mini-readline ─────────────────────────────────
// El prompt de bash es desconocido para el gateway (ancho variable), así que
// TODOS los redibujos se limitan a la región que el propio gateway ecoó: se
// avanza al final de la región, se retrocede buf.length columnas (región
// propia) y se borra desde ahí. El prompt nunca se toca.

const CUR = (n: number, dir: 'C' | 'D'): string => (n > 0 ? `\x1b[${n}${dir}` : '');

function resetEdit(st: ConnState): void {
  st.buf = '';
  st.pos = 0;
  st.esc = '';
  st.histIdx = -1;
  st.draft = '';
}

/** Reemplaza toda la línea ecoada (sobrescribe la región propia y apenas el prompt). */
function replaceLine(ws: WebSocket, st: ConnState, line: string, pos = line.length): void {
  if (st.buf.length > 0) {
    const tail = CUR(st.buf.length - st.pos, 'C');
    sendText(ws, tail + CUR(st.buf.length, 'D') + '\x1b[K');
  }
  st.buf = line;
  st.pos = Math.max(0, Math.min(pos, line.length));
  sendText(ws, line + CUR(line.length - st.pos, 'D'));
}

function insertText(ws: WebSocket, st: ConnState, text: string): void {
  if (!text) return;
  const tail = st.buf.slice(st.pos);
  st.buf = st.buf.slice(0, st.pos) + text + tail;
  st.pos += text.length;
  sendText(ws, text + tail + CUR(tail.length, 'D'));
}

/** Borra el carácter anterior al cursor (Backspace). */
function backspace(ws: WebSocket, st: ConnState): void {
  if (st.pos === 0) return void sendText(ws, '\x07');
  const tail = st.buf.slice(st.pos);
  st.buf = st.buf.slice(0, st.pos - 1) + tail;
  st.pos--;
  if (tail.length === 0) sendText(ws, '\b \b');
  else sendText(ws, '\x1b[D' + tail + ' ' + CUR(tail.length + 1, 'D'));
}

/** Borra el carácter bajo el cursor (Delete). */
function deleteChar(ws: WebSocket, st: ConnState): void {
  if (st.pos >= st.buf.length) return void sendText(ws, '\x07');
  const tail = st.buf.slice(st.pos + 1);
  st.buf = st.buf.slice(0, st.pos) + tail;
  if (tail.length === 0) sendText(ws, ' \b');
  else sendText(ws, tail + ' ' + CUR(tail.length + 1, 'D'));
}

function moveHome(ws: WebSocket, st: ConnState): void { if (st.pos > 0) { sendText(ws, CUR(st.pos, 'D')); st.pos = 0; } }
function moveEnd(ws: WebSocket, st: ConnState): void { if (st.pos < st.buf.length) { sendText(ws, CUR(st.buf.length - st.pos, 'C')); st.pos = st.buf.length; } }

/** Ctrl+L: borra pantalla y repinta prompt+línea (el prompt se conoce desde OSC 133;A). */
function clearScreen(ws: WebSocket, st: ConnState): void {
  sendText(ws, '\x1b[2J\x1b[H' + st.promptRaw + st.buf.slice(0, st.pos) + st.buf.slice(st.pos));
}

type HistDir = 'up' | 'down';
function historyNav(ws: WebSocket, st: ConnState, dir: HistDir): void {
  if (st.history.length === 0) return void sendText(ws, '\x07');
  if (st.histIdx === -1) {
    if (dir === 'down') return void sendText(ws, '\x07');
    st.draft = st.buf;
    st.histIdx = st.history.length - 1;
  } else if (dir === 'up') {
    if (st.histIdx > 0) st.histIdx--;
    else return void sendText(ws, '\x07');
  } else {
    st.histIdx++;
    if (st.histIdx >= st.history.length) {
      st.histIdx = -1;
      return void replaceLine(ws, st, st.draft);
    }
  }
  replaceLine(ws, st, st.history[st.histIdx]);
}

function pushHistory(st: ConnState, line: string): void {
  const t = line.trim();
  if (!t) return;
  if (st.history[st.history.length - 1] === t) return; // dedupe consecutivos
  st.history.push(t);
  if (st.history.length > 200) st.history.shift();
}

/** Tab: completado real vía exec en el contenedor (compgen), LCP + bell. */
async function complete(ws: WebSocket, st: ConnState): Promise<void> {
  const before = st.buf.slice(0, st.pos);
  const m = /(^|[\s|;&(])(\S*)$/.exec(before);
  const word = m?.[2] ?? '';
  const firstWord = m?.[1] === '' || m?.[1] === undefined;
  let cands: string[] = firstWord
    ? [...RESERVED_COMMANDS].filter((c) => c.startsWith(word))
    : [];
  if (word.length > 0) {
    try {
      const got = await st.session?.session.complete(word, firstWord) ?? [];
      cands = [...new Set([...cands, ...got])].sort();
    } catch { /* sin completado del contenedor: nos quedamos con lo local */ }
  }
  if (cands.length === 0) return void sendText(ws, '\x07');
  let lcp = cands[0];
  for (const c of cands) {
    let i = 0;
    while (i < lcp.length && i < c.length && lcp[i] === c[i]) i++;
    lcp = lcp.slice(0, i);
  }
  if (cands.length === 1 && !lcp.endsWith('/') && !lcp.endsWith('=')) lcp += ' ';
  if (lcp.length <= word.length) return void sendText(ws, '\x07');
  const added = lcp.slice(word.length);
  insertText(ws, st, added);
}

function reservedOf(line: string): string | null {
  const first = line.split(/\s+/, 1)[0];
  return (RESERVED_COMMANDS as readonly string[]).includes(first) ? first : null;
}

function onInput(ws: WebSocket, st: ConnState, data: string): void {
  if (!st.playerId) return;
  st.session?.session.touch();
  if (!st.session) {
    // sin sesión activa el input se pierde: aviso con throttle (no una línea por tecla)
    if (Date.now() - st.lastNoSessionAt > 2500) {
      st.lastNoSessionAt = Date.now();
      sendText(ws, '\r\n\x1b[38;5;203msin sesión de terminal — escribe start o pulsa Reanudar\x1b[0m\r\n');
    }
    return;
  }
  if (!st.atPrompt && st.holdDrained) {
    // El hold ya se soltó (no hay prompt OSC a la vista: subshell, paginador,
    // proceso interactivo…): passthrough directo, el shell sigue dueño.
    st.session.session.write(data);
    return;
  }
  // procesa el stream con retención SIEMPRE activa (mini-readline propio con
  // eco local): el shell no recibe nada hasta el Enter. Las flechas, el
  // historial y la edición viven AQUÍ (la retención deja el readline de bash
  // con una línea vacía: reenviarle edición cruda lo desincronizaba — causa
  // del «error de bash» al leer ficheros y de que ↑/↓/←/→ no hicieran nada).
  for (let i = 0; i < data.length; i++) {
    const ch = data[i];
    if (st.esc.length > 0) {
      escFeed(ws, st, ch);
      continue;
    }
    if (ch === '\x03') {
      // Ctrl+C: cancelda línea/hold y avisa al shell (SIGINT). Va directo.
      cancelHold(st);
      resetEdit(st);
      sendText(ws, '^C\r\n');
      st.session.session.write('\x03');
      continue;
    }
    if (!st.atPrompt) {
      // Retención anticipada: el prompt OSC 133;A aún no llegó. Si fuera
      // passthrough crudo, bash absorbería estas teclas mientras dibuja su
      // prompt y la línea del editor quedaría partida (carrera que produce
      // «cat.profile: command not found» y flechas muertas). Se retiene y al
      // arribo del marcador se procesa como entrada normal del editor. Si el
      // marcador nunca llega, el timer lo suelta como passthrough.
      st.hold += ch;
      if (st.hold.length > 2048) {
        drainHoldAsPassthrough(ws, st);
        continue;
      }
      if (!st.holdTimer) {
        st.holdTimer = setTimeout(() => drainHoldAsPassthrough(ws, st), 300);
      }
      continue;
    }
    if (ch === '\r' || ch === '\n') {
      commitEnter(ws, st, ch);
    } else if (ch === '\x7f') {
      backspace(ws, st);
    } else if (ch === '\t') {
      void complete(ws, st);
    } else if (ch === '\x15') {
      replaceLine(ws, st, ''); // Ctrl+U: vacía la línea
    } else if (ch === '\x0b') {
      sendText(ws, '\x1b[K'); // Ctrl+K: mata hasta el final
      st.buf = st.buf.slice(0, st.pos);
    } else if (ch === '\x17') {
      // Ctrl+W: borra la palabra anterior al cursor
      let p = st.pos;
      while (p > 0 && st.buf[p - 1] === ' ') p--;
      while (p > 0 && st.buf[p - 1] !== ' ') p--;
      replaceLine(ws, st, st.buf.slice(0, p) + st.buf.slice(st.pos), p);
    } else if (ch === '\x0c') {
      clearScreen(ws, st); // Ctrl+L
    } else if (ch === '\x01') {
      moveHome(ws, st); // Ctrl+A
    } else if (ch === '\x05') {
      moveEnd(ws, st); // Ctrl+E
    } else if (ch === '\x1b') {
      st.esc = '\x1b';
    } else if (ch >= ' ') {
      if (st.buf.length < 1024) insertText(ws, st, ch);
      else sendText(ws, '\x07');
    }
    // resto de controles (\x00-\x1f no mapeados): se ignoran sin ensuciar el buffer
  }
}

/** Parsea secuencias CSI/ESC-O partidas entre chunks (1 byte y hasta órgano final). */
function escFeed(ws: WebSocket, st: ConnState, ch: string): void {
  st.esc += ch;
  const e = st.esc;
  if (e.length === 2) {
    if (e[1] === '[' || e[1] === 'O') return; // queda el byte final fuera
    st.esc = ''; // ESC suelto (Meta): descartado
    return;
  }
  const fb = e[e.length - 1];
  if (e[1] === '[') {
    if (fb < '@' || fb > '~') {
      if (e.length > 16) st.esc = ''; // secuencia corrupta: descartar
      return;
    }
    st.esc = '';
    const params = e.slice(2, -1);
    if (fb === 'A') historyNav(ws, st, 'up');
    else if (fb === 'B') historyNav(ws, st, 'down');
    else if (fb === 'C' && st.pos < st.buf.length) { st.pos++; sendText(ws, '\x1b[C'); }
    else if (fb === 'D' && st.pos > 0) { st.pos--; sendText(ws, '\x1b[D'); }
    else if (fb === 'H') moveHome(ws, st);
    else if (fb === 'F') moveEnd(ws, st);
    else if (fb === '~') {
      if (params === '3') deleteChar(ws, st);
      else if (params === '1' || params === '7') moveHome(ws, st);
      else if (params === '4' || params === '8') moveEnd(ws, st);
    }
    return;
  }
  st.esc = '';
  if (fb === 'A') historyNav(ws, st, 'up');
  else if (fb === 'B') historyNav(ws, st, 'down');
  else if (fb === 'C' && st.pos < st.buf.length) { st.pos++; sendText(ws, '\x1b[C'); }
  else if (fb === 'D' && st.pos > 0) { st.pos--; sendText(ws, '\x1b[D'); }
  else if (fb === 'H') moveHome(ws, st);
  else if (fb === 'F') moveEnd(ws, st);
}

/** Enter: si la línea era un comando del dojo, se maneja con el motor en vez del shell. */
function commitEnter(ws: WebSocket, st: ConnState, newline: string): void {
  const line = st.buf;
  const trimmed = line.trim();
  const hadText = trimmed.length > 0;
  // borramos la región ecoada (el prompt se conserva) y el editor queda limpio
  if (hadText) {
    const tail = CUR(st.buf.length - st.pos, 'C');
    sendText(ws, tail + CUR(st.buf.length, 'D') + '\x1b[K');
  }
  st.buf = '';
  st.pos = 0;
  st.esc = '';
  st.histIdx = -1;
  st.draft = '';
  if (!hadText) {
    // línea vacía: el propio shell ecoa el Enter y pinta el prompt siguiente
    st.session?.session.write(newline);
    return;
  }
  pushHistory(st, trimmed);
  const cmd = reservedOf(trimmed);
  if (!cmd) {
    // no era un comando del dojo: el bloque va al shell, que lo ecoa completo
    st.session?.session.write(trimmed + (newline === '\n' ? '\n' : '\r'));
    return;
  }
  sendText(ws, '\r\n'); // cierra visualmente la línea ecoada
  handleCommand(ws, st, trimmed);
}

function handleCommand(ws: WebSocket, st: ConnState, line: string): void {
  const spaceIdx = line.indexOf(' ');
  const cmd = spaceIdx === -1 ? line : line.slice(0, spaceIdx);
  const args = spaceIdx === -1 ? '' : line.slice(spaceIdx + 1).trim();
  const playerId = st.playerId as string;
  switch (cmd) {
    case 'help':
      sendText(ws, '\r\n' + engineHelp() + '\r\n');
      return;
    case 'goal':
      sendText(ws, `\r\x1b[38;5;142mgoal>\x1b[0m ${st.session?.level.goal ?? '(sin nivel activo)'}\r\n`);
      return;
    case 'status':
      void doStatus(ws, st);
      return;
    case 'hint':
      void doHint(ws, st);
      return;
    case 'next':
      void startLevel(ws, st, playerId, undefined, levelsSvc!, { explicitNext: true });
      return;
    case 'start':
      void startLevel(ws, st, playerId, args || undefined, levelsSvc!, {});
      return;
    case 'reset':
      void startLevel(ws, st, playerId, st.session?.level.id, levelsSvc!, { label: 'regenerando escenario…' });
      return;
    case 'solution':
      void doSolution(ws, st);
      return;
    case 'submit':
      if (!args) {
        sendText(ws, '\r\nsubmit> uso: submit FLAG{...}\r\n');
        return;
      }
      void onSubmitFlag(ws, st, args);
      return;
    default:
      sendText(ws, `\r\ncomando "${cmd}" no reconocido; escribe help\r\n`);
  }
}

let levelsSvc: LevelsService | null = null;
export function bindLevelsService(service: LevelsService): void {
  levelsSvc = service;
}

async function doHint(ws: WebSocket, st: ConnState): Promise<void> {
  const engine = st.engine;
  if (!engine) return void sendText(ws, '\r\nsin nivel activo\r\n');
  const h = engine.hint();
  // al panel le llega el texto de la pista en plano (sin ANSI ni cabecera:
  // ese texto lo pinta la UI) y a la terminal el bloque renderizado
  send(ws, { type: 'hint', payload: { text: h.plain, index: h.index, total: h.total } });
  sendText(ws, h.text === null ? '\r\n\x1b[38;5;203mno hay más pistas. ¡A por él!\x1b[0m\r\n' : '\r\n' + h.text + '\r\n');
}

async function doSolution(ws: WebSocket, st: ConnState): Promise<void> {
  const engine = st.engine;
  if (!engine) return void sendText(ws, '\r\nsin nivel activo\r\n');
  const plain = engine.solutionPlain();
  send(ws, { type: 'solution', payload: { text: plain } });
  if (plain === null) {
    sendText(ws, '\r\n\x1b[38;5;203msolution bloqueada:\x1b[0m usa 2 pistas (hint) o 5 intentos fallidos (submit).\r\n');
    return;
  }
  // a la terminal el bloque completo ya renderizado (color incluido)
  sendText(ws, '\r\n' + engine.solutionText() + '\r\n');
}

async function doStatus(ws: WebSocket, st: ConnState): Promise<void> {
  const playerId = st.playerId;
  if (!playerId) return;
  const row = getPlayer(playerId);
  if (!row) return;
  const progress = getProgress(playerId);
  const solved = progress.filter((p) => p.solved === 1).length;
  const rank = rankForXp(row.xp);
  send(ws, {
    type: 'status',
    payload: {
      xp: row.xp,
      rank: rank.name,
      solvedLevels: solved,
      totalLevels: levelsSvc?.ordered.length ?? 0,
      levelId: st.session?.level.id ?? 'none',
    },
  });
  const line = `\r\n\x1b[38;5;140mstatus\x1b[0m · ${rank.name} · ${row.xp} XP · ${solved} niveles · actual: ${st.session?.level.id ?? 'none'}\r\n`;
  sendText(ws, line);
}

async function onSubmitFlag(ws: WebSocket, st: ConnState, flag: string): Promise<void> {
  if (!submitLimiter.allow(`${st.playerId}`)) {
    sendText(ws, '\r\n\x1b[38;5;203mdemasiados submiteos seguidos; espera un momento\x1b[0m\r\n');
    return;
  }
  if (!st.engine || !st.session) {
    sendText(ws, '\r\nsin nivel activo: usa start\x1b[0m\r\n');
    return;
  }
  const engine = st.engine;
  const level = st.session.level;
  const result = engine.submit(flag);
  send(ws, {
    type: 'submitResult',
    payload: {
      ok: result.ok,
      passed: result.passed,
      message: result.message,
      xpGained: result.xpGained,
      totalXp: result.totalXp,
      rank: result.rank,
      nextLevelId: result.nextLevelId ?? null,
    },
  });
  if (!result.passed) {
    sendText(ws, result.message + '\r\n');
    return;
  }
  // nivel superado: feedback + explicación + siguiente
  sendText(ws, '\r\n' + result.message + '\r\n');
  const teach = level.teach;
  if (teach) {
    sendText(ws, `\r\n\x1b[38;5;110m¿Qué has aprendido?\x1b[0m\n${teach}\r\n`);
  }
  const nextId = levelsSvc?.nextLevelId(level.id) ?? null;
  if (nextId) {
    const nxt = levelsSvc!.all.get(nextId);
    sendText(ws, `\r\n\x1b[38;5;110m→ siguiente nivel: ${nextId} (${nxt?.title}) — escribe next o pulsa Continuar\x1b[0m\r\n`);
  } else {
    sendText(ws, '\r\n\x1b[38;5;114m¡Último nivel superado! Eres Maestro del Shell 🏆\x1b[0m\r\n');
  }
}
