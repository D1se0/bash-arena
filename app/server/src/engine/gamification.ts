/** Gamificación: XP, rangos, logros y rachas. */

export const RANKS: { name: string; min: number }[] = [
  { name: 'Novato', min: 0 },
  { name: 'Aprendiz', min: 150 },
  { name: 'Explorador', min: 400 },
  { name: 'Operador', min: 800 },
  { name: 'Guerrero de Shell', min: 1400 },
  { name: 'Maestro del Shell', min: 2200 },
];

export function rankForXp(xp: number): { name: string; index: number; nextAt: number | null } {
  let current = RANKS[0];
  let index = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].min) {
      current = RANKS[i];
      index = i;
    }
  }
  const next = RANKS[index + 1];
  return { name: current.name, index, nextAt: next?.min ?? null };
}

/** Penalización de XP al usar una pista. */
export const HINT_PENALTY = 10;

/** XP del nivel ajustado por pistas usadas (mínimo 30% del valor original). */
export function xpForLevel(baseXp: number, hintsUsed: number): number {
  const raw = Math.max(0, baseXp - hintsUsed * HINT_PENALTY);
  return Math.max(Math.round(baseXp * 0.3), raw);
}

export const ACHIEVEMENTS = {
  firstFlag: { name: 'Primera flag', desc: 'Resuelve tu primer nivel' },
  streak5: { name: 'Racha de 5', desc: '5 niveles resueltos sin pistas' },
  speedrun: { name: 'Speedrunner', desc: 'Nivel resuelto en menos de 60s' },
  trackClear: { name: 'Track completo', desc: 'Complete un track entero' },
} as const;
