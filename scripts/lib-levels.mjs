/**
 * lib-levels — helper compartido para los generadores de niveles.
 * Garantiza la forma requerida (id, track, title, goal, setup, solution,
 * teach, hints, cheatsheet, keywords, profile) con valores por defecto
 * razonables y texto siempre en español limpio.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function mk(track, n, o) {
  return {
    id: `${track}-l${n}`,
    track,
    index: n,
    title: o.title,
    subtitle: o.subtitle ?? '',
    xp: o.xp ?? 30,
    difficulty: o.difficulty ?? 1,
    brief: o.brief,
    goal: o.goal,
    setup: o.setup,
    solution: o.solution,
    hints: o.hints,
    teach: o.teach,
    cheatsheet: o.cheatsheet,
    keywords: o.keywords,
    profile: o.profile ?? 'default',
  };
}
