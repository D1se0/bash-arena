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

const RESERVE_WORDS_MAX_PREFIX = Math.max(...RESERVED_COMMANDS.map((c) => c.length)) + 1;

interface ConnState {
  ip: string;
  playerId: string | null;
  session: SessionRecord | null;
  engine: GameEngine | null;
  withheld: string | null;   // buffer de línea retenida (prefijo reservado), null en passthrough
  atPrompt: boolean;
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
  send(ws, { type: 'data', payload: { data: text } });
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
    connStates.set(ws, { ip, playerId: null, session: null, engine: null, withheld: '', atPrompt: false, connectedAt: Date.now(), lastNoSessionAt: 0 });
    ws.on('message', (raw) => handleMsg(ws, raw, service));
    ws.on('close', () => void onConnClose(ws));
    ws.on('error', () => undefined);
  });
}

function clientIp(forwarded: string): string {
  if (!forwarded) return 'unknown';
  return forwarded.split(',')[0].trim();
}

async function onConnClose(ws: WebSocket): Promise<void> {
  const st = connStates.get(ws);
  connStates.delete(ws);
  if (!st) return;
  // el contenedor se mantiene un rato (reconexión); el sweeper lo mata por idle
  logger.info({ playerId: st.playerId?.slice(0, 8), ip: st.ip }, 'ws closed');
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
    const row = ensurePlayer(playerId);
    const rank = rankForXp(row.xp);
    const trackCounts = service.tracks.map((t) => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      color: t.color,
      totalCount: service.ordered.filter((l) => l.track === t.id).length,
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
  st.withheld = '';
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

function onShellData(ws: WebSocket, st: ConnState, chunk: string): void {
  if (chunk.includes('\x1b]133;A')) {
    st.atPrompt = true;
  } else if (!st.atPrompt && /(?:^|\n)\s*[$#] ?$/.test(chunk)) {
    st.atPrompt = true;
  }
  send(ws, { type: 'data', payload: { data: chunk } });
}

function isReservedPrefix(line: string): boolean {
  return RESERVED_COMMANDS.some((c) => c.startsWith(line));
}

function reservedOf(line: string): string | null {
  const first = line.split(/\s+/, 1)[0];
  return (RESERVED_COMMANDS as readonly string[]).includes(first) ? first : null;
}

function onInput(ws: WebSocket, st: ConnState, data: string): void {
  if (!st.playerId) return;
  st.session?.session.touch();
  if (!st.atPrompt || !st.session) {
    st.session?.session.write(data);
    // sin sesión activa el input se pierde: aviso con throttle (no una línea por tecla)
    if (!st.session && Date.now() - st.lastNoSessionAt > 2500) {
      st.lastNoSessionAt = Date.now();
      sendText(ws, '\r\n\x1b[38;5;203msin sesión de terminal — escribe start o pulsa Reanudar\x1b[0m\r\n');
    }
    return;
  }
  // procesa el stream por líneas, con retención por prefijo
  for (let i = 0; i < data.length; i++) {
    const ch = data[i];
    if (ch === '\r' || ch === '\n') {
      commitEnter(ws, st, ch);
    } else if (st.withheld !== null) {
      // ECO LOCAL: en retención el shell no ve (ni ecoa) nada, así que dibujamos
      // a mano para que el jugador siempre vea lo que teclea.
      if (ch === '\x7f') {
        st.withheld = st.withheld.slice(0, -1);
        sendText(ws, '\b \b');
        if (st.withheld.length === 0) {
          st.withheld = null;
        }
      } else if (ch === '\t') {
        flushWithheld(ws, st, st.withheld + '\t');
      } else if (ch === '\x03') {
        st.withheld = null; // Ctrl+C cancela retención
        sendText(ws, '^C\r\n');
        st.session.session.write('\x03');
      } else if (st.withheld.length < RESERVE_WORDS_MAX_PREFIX && isReservedPrefix(st.withheld + ch)) {
        st.withheld += ch;
        if (ch >= ' ') sendText(ws, ch); // eco visible (ignora controles raros)
      } else {
        flushWithheld(ws, st, st.withheld + ch);
      }
    } else {
      st.session.session.write(ch);
    }
  }
}

/**
 * suelta lo retenido y vuelve a passthrough. Como la línea ya se pintó con
 * eco local, la borramos (\x1b[2K\r) antes: el shell la re-ecoa con su
 * comportamiento normal y no queda duplicado.
 */
function flushWithheld(ws: WebSocket, st: ConnState, text: string): void {
  st.withheld = null; // passthrough
  sendText(ws, '\x1b[2K\r');
  const session = st.session?.session;
  if (session && text) session.write(text);
}

/** Enter: si la línea era un comando del dojo, se maneja con el motor en vez del shell. */
function commitEnter(ws: WebSocket, st: ConnState, newline: string): void {
  const withheld = st.withheld;
  if (withheld !== null) {
    const trimmed = withheld.trim();
    st.withheld = null;
    if (withheld.length === 0) {
      st.session?.session.write(newline);
      return;
    }
    const cmd = reservedOf(trimmed);
    if (!cmd) {
      // no era un comando completo: limpia el eco local y lo entrega al shell,
      // que lo ecoa con su comportamiento normal
      sendText(ws, '\x1b[2K\r');
      st.session?.session.write(withheld + newline);
      return;
    }
    sendText(ws, '\r\n'); // cierra visualmente la línea ecoada
    handleCommand(ws, st, trimmed);
    return;
  }
  // passthrough: solo el Enter
  st.session?.session.write(newline);
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
  send(ws, { type: 'hint', payload: { text: null, index: h.index, total: h.total } });
  sendText(ws, h.text === null ? '\r\n\x1b[38;5;203mno hay más pistas. ¡A por él!\x1b[0m\r\n' : '\r\n' + h.text + '\r\n');
}

async function doSolution(ws: WebSocket, st: ConnState): Promise<void> {
  const engine = st.engine;
  if (!engine) return void sendText(ws, '\r\nsin nivel activo\r\n');
  const text = engine.solutionText();
  send(ws, { type: 'solution', payload: { text } });
  if (text === null) {
    sendText(ws, '\r\n\x1b[38;5;203msolution bloqueada:\x1b[0m usa 2 pistas (hint) o 5 intentos fallidos (submit).\r\n');
    return;
  }
  sendText(ws, `\r\n\x1b[38;5;140m[solución de referencia]\x1b[0m\n${text}\r\n`);
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
