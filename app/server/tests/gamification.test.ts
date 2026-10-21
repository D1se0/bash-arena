import { describe, expect, it } from 'vitest';
import { RANKS, rankForXp, xpForLevel } from '../src/engine/gamification.js';

describe('gamificación', () => {
  it('novato en 0 XP y escalona bien', () => {
    expect(rankForXp(0).name).toBe('Novato');
    expect(rankForXp(149).name).toBe('Novato');
    expect(rankForXp(150).name).toBe('Aprendiz');
    expect(rankForXp(2199).name).toBe('Guerrero de Shell');
    expect(rankForXp(2200).name).toBe('Maestro del Shell');
  });

  it('nextAt sobrevive al último rango', () => {
    expect(rankForXp(9999).nextAt).toBeNull();
    expect(rankForXp(100).nextAt).toBe(150);
  });

  it('los rangos están ordenados de menor a mayor', () => {
    for (let i = 1; i < RANKS.length; i++) {
      expect(RANKS[i].min).toBeGreaterThan(RANKS[i - 1].min);
    }
  });

  it('xpForLevel penaliza por pista con suelo del 30%', () => {
    expect(xpForLevel(100, 0)).toBe(100);
    expect(xpForLevel(100, 1)).toBe(90);
    expect(xpForLevel(100, 5)).toBe(50);
    expect(xpForLevel(50, 10)).toBe(15); // suelo: 30% del nivel
  });
});
