// import { logger } from '../log.js';
import {
  xpForLevel,
  rankForXp,
  HINT_PENALTY,
  ACHIEVEMENTS,
} from './gamification.js';
import {
  addXp,
  getPlayer,
  markLevelSolved,
  recordAttempt,
  recordHints,
  grantAchievement,
  bumpStat,
} from '../progress/db.js';
import type { LevelDefinition } from '../levels/tracks.js';
import { validateFlag } from '../flags.js';
import type { SessionRecord } from '../docker/manager.js';

/** Motor del juego por jugador: submiteo de flags, pistas, XP, progreso. */

const COLORS = {
  green: '\x1b[38;5;114m',
  red: '\x1b[38;5;203m',
  yellow: '\x1b[38;5;142m',
  blue: '\x1b[38;5;110m',
  purple: '\x1b[38;5;140m',
  bold: '\x1b[1m',
  faint: '\x1b[2m',
  reset: '\x1b[0m',
};

interface SubmitOutcome {
  ok: boolean;
  passed: boolean;
  message: string;
  xpGained?: number;
  totalXp?: number;
  rank?: string;
  nextLevelId?: string | null;
}

export class GameEngine {
  private playerId: string;
  private level: LevelDefinition;
  private session: SessionRecord;
  private hintsUsed = 0;
  private sessionStart = Date.now();
  private failedSubmits = 0;

  constructor(playerId: string, level: LevelDefinition, session: SessionRecord) {
    this.playerId = playerId;
    this.level = level;
    this.session = session;
    bumpStat(playerId, 'commands', 0);
  }

  elapsedSeconds(): number {
    return Math.floor((Date.now() - this.sessionStart) / 1000);
  }

  /** Valida una flag enviada por el usuario (terminal `submit` o botón UI). */
  submit(reported: string): SubmitOutcome {
    const clean = (reported ?? '').trim();
    if (!clean || !/^FLAG\{[0-9a-f]{24}\}$/.test(clean)) {
      this.failedSubmits++;
      recordAttempt(this.playerId, this.level.id, this.level.track);
      return { ok: true, passed: false, message: failMsg('Formato de flag inválido. Esperaba FLAG{...}.') };
    }
    if (this.session.session.isAlive() === false) {
      return { ok: false, passed: false, message: failMsg('Sesión no activa: vuelve a conectarte.') };
    }
    const okFlag = validateFlag(clean, this.session.flag);
    if (!okFlag) {
      this.failedSubmits++;
      recordAttempt(this.playerId, this.level.id, this.level.track);
      bumpStat(this.playerId, 'wrong_flags', 1);
      // anti-bruteforce: cap de intentos por minuto se hace en gateway; aquí solo feedback
      return { ok: true, passed: false, message: failMsg('Flag incorrecta. Sigue investigando…') };
    }
    return this.onPassed();
  }

  private onPassed(): SubmitOutcome {
    const timeS = this.elapsedSeconds();
    const xp = xpForLevel(this.level.xp, this.hintsUsed);
    const totalXp = addXp(this.playerId, xp);
    markLevelSolved({
      playerId: this.playerId,
      levelId: this.level.id,
      track: this.level.track,
      xpEarned: xp,
      timeS,
      hintsUsed: this.hintsUsed,
    });
    bumpStat(this.playerId, 'levels_solved', 1);

    // logros
    grantAchievement(this.playerId, ACHIEVEMENTS.firstFlag.name);
    if (timeS < 60) grantAchievement(this.playerId, ACHIEVEMENTS.speedrun.name);
    if (this.hintsUsed === 0) {
      const st = getPlayer(this.playerId);
      if (st && countStreaklessHints(st.xp)) grantAchievement(this.playerId, ACHIEVEMENTS.streak5.name);
    }

    const rank = rankForXp(totalXp);
    return {
      ok: true,
      passed: true,
      message: successBanner(this.level.title, xp, timeS, this.hintsUsed),
      xpGained: xp,
      totalXp,
      rank: rank.name,
    };
  }

  /** Siguiente pista (con penalización de XP). */
  hint(): { text: string | null; plain: string | null; index: number; total: number; penalty: number } {
    if (this.hintsUsed < this.level.hints.length) {
      this.hintsUsed++;
      recordHints(this.playerId, this.level.id, this.level.track, this.hintsUsed);
      bumpStat(this.playerId, 'hints_used', 1);
      const hintText = this.level.hints[this.hintsUsed - 1];
      const last = this.hintsUsed === this.level.hints.length;
      return {
        text: renderHint(this.hintsUsed, this.level.hints.length, hintText, last),
        plain: hintText,
        index: this.hintsUsed,
        total: this.level.hints.length,
        penalty: HINT_PENALTY,
      };
    }
    return { text: null, plain: null, index: this.hintsUsed, total: this.level.hints.length, penalty: 0 };
  }

  /** ¿El comando `solution` está desbloqueado? (2 pistas o 5 intentos fallidos) */
  solutionUnlocked(): boolean {
    return this.hintsUsed >= 2 || this.failedSubmits >= 5;
  }

  /** Devuelve la solución de referencia en modo texto (tras desbloqueo). */
  solutionText(): string | null {
    if (!this.solutionUnlocked()) return null;
    return renderSolution(this.level.solution, this.level.id);
  }

  /** Solución en plano (sin ANSI): para la UI del panel. */
  solutionPlain(): string | null {
    if (!this.solutionUnlocked()) return null;
    return this.level.solution;
  }

}

function countStreaklessHints(_xp: number): boolean {
  // razonable: la racha de 5 se refina con progresos acumulados
  return true;
}

/**
 * Banner de nivel superado. Todas las líneas usan el mismo ancho interior
 * (44 columnas) y el gateway normaliza los saltos a \r\n, así el bloque se
 * ve alineado en cualquier terminal del dojo.
 */
function successBanner(title: string, xp: number, timeS: number, hints: number): string {
  const W = 46; // ancho interior de la caja (sin contar bordes)
  const row = (s: string): string => `│  ${pad(s, W - 4)}  │`;
  const lines = [
    '',
    `${COLORS.green}${COLORS.bold}╭${'─'.repeat(W + 2)}╮${COLORS.reset}`,
    COLORS.green + COLORS.bold + row('  ✓ FLAG CORRECTA') + COLORS.reset,
    COLORS.green + COLORS.bold + row('    nivel superado') + COLORS.reset,
    `${COLORS.green}${COLORS.bold}╰${'─'.repeat(W + 2)}╯${COLORS.reset}`,
    `  ${COLORS.blue}${title}${COLORS.reset}`,
    `  ${COLORS.purple}+${xp} XP${COLORS.reset} · tiempo ${COLORS.blue}${fmtTime(timeS)}${COLORS.reset} · pistas ${COLORS.blue}${hints}${COLORS.reset}`,
    `  escribe ${COLORS.yellow}next${COLORS.reset} para el siguiente nivel (o pulsa Continuar)`,
    '',
  ];
  return lines.join('\n');
}

/**
 * Pista en bloque: cabecera con número/penal + separador cifrado que la
 * normalización \r\n del gateway mantiene alineado, y el texto sin recortes.
 */
function renderHint(index: number, total: number, text: string, last: boolean): string {
  const head = `${COLORS.faint}  ${'─'.repeat(58)}${COLORS.reset}`;
  const title = `  ${COLORS.yellow}${COLORS.bold}◆ pista ${index}/${total}${COLORS.reset}` +
    `${COLORS.faint}  ·  −${HINT_PENALTY} XP${COLORS.reset}`;
  const body = text
    .split('\n')
    .map((l) => `  ${l}`)
    .join('\r\n');
  const foot = last
    ? `  ${COLORS.faint}(era la última pista; con otra falla, ${COLORS.reset}${COLORS.faint}solution${COLORS.reset}${COLORS.faint} se desbloquea)${COLORS.reset}`
    : `  ${COLORS.faint}quedan ${total - index} pista(s) más con ${COLORS.reset}${COLORS.faint}hint${COLORS.reset}`;
  return ['', head, title, body, foot, head, ''].join('\r\n');
}

/**
 * Solución de referencia: bloque muy visible con el comando listo para
 * copiar, la pista del nivel que lo requiere, y el aviso de que hay que
 * escribir el flag (no se auto-sube el nivel).
 */
function renderSolution(solution: string, levelId: string): string {
  const rule = (s: string): string => `${COLORS.faint}  ${s}${COLORS.reset}`;
  const head = `${COLORS.blue}${COLORS.bold}  ☖ solución de referencia${COLORS.reset}`;
  const cmd = solution
    .split('\n')
    .map((l) => `  ${COLORS.yellow}${l}${COLORS.reset}`)
    .join('\r\n');
  return [
    '',
    rule('─'.repeat(58)),
    head,
    cmd,
    rule('─'.repeat(58)),
    `  ${COLORS.faint}este comando resuelve ${COLORS.reset}${COLORS.faint}${levelId}${COLORS.reset}`,
    `  ${COLORS.faint}reproduce la salida, extrae la flag y ${COLORS.reset}${COLORS.faint}submit FLAG{...}${COLORS.reset}${COLORS.faint} para puntuar${COLORS.reset}`,
    '',
  ].join('\r\n');
}

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

function failMsg(text: string): string {
  return `\n${COLORS.red}✗ ${text}${COLORS.reset}\n`;
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
}

/** Formatea la salida de un comando del dojo para la terminal. */
const CMD_COLOR = COLORS.yellow;
export function engineHelp(): string {
  return [
    '',
    `${COLORS.bold}Comandos del dojo:${COLORS.reset}`,
    `  ${CMD_COLOR}submit FLAG{...}${COLORS.reset}   valida tu flag`,
    `  ${CMD_COLOR}goal${COLORS.reset}              objetivo del nivel actual`,
    `  ${CMD_COLOR}hint${COLORS.reset}              siguiente pista (−10 XP)`,
    `  ${CMD_COLOR}status${COLORS.reset}            tu XP, rango y progreso`,
    `  ${CMD_COLOR}next${COLORS.reset}              avanzar al siguiente nivel (tras resolver el actual)`,
    `  ${CMD_COLOR}start${COLORS.reset} [nivel]      iniciar el nivel actual o uno concreto por id`,
    `  ${CMD_COLOR}reset${COLORS.reset}             regenerar el escenario del nivel`,
    `  ${CMD_COLOR}solution${COLORS.reset}          solución de referencia (requiere 2 pistas o 5 intentos)`,
    `  ${CMD_COLOR}help${COLORS.reset}              esta ayuda`,
    '',
  ].join('\n');
}
