import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSessionFlag } from '../src/flags.js';
import type { SessionRecord } from '../src/docker/manager.js';
import type { LevelDefinition } from '../src/levels/tracks.js';

// la base lee ARENA_DATA_DIR al importar: el dir tmp va ANTES del import dinámico
process.env.ARENA_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'arena-engine-unit-'));

/** Sesión falsa: al motor solo le interesa que está viva. */
const fakeSession = (): SessionRecord => {
  const flag = generateSessionFlag('sess-unit', 'fundamentos-l1', 'unit-secret');
  return {
    session: { isAlive: () => true, resize: () => undefined } as unknown as SessionRecord['session'],
    flag,
    level: undefined as unknown as LevelDefinition,
    ip: '127.0.0.1',
    startedAt: Date.now(),
  };
};

const fakeLevel = (id: string): LevelDefinition =>
  ({
    id,
    track: 'fundamentos',
    index: 1,
    title: `nivel ${id}`,
    subtitle: null,
    xp: 25,
    difficulty: 1,
    brief: 'brief',
    goal: 'goal',
    profile: 'default',
    setup: 'echo ok',
    solution: 'cat /flag.txt',
    hints: ['pista 1', 'pista 2', 'pista 3'],
    teach: 'lección',
    cheatsheet: [],
    keywords: [],
  }) as unknown as LevelDefinition;

describe('GameEngine — resolver y repasar', () => {
  let db: typeof import('../src/progress/db.js');
  let GameEngine: typeof import('../src/engine/engine.js').GameEngine;

  beforeAll(async () => {
    db = await import('../src/progress/db.js');
    ({ GameEngine } = await import('../src/engine/engine.js'));
  });

  it('antes de resolver: solution bloqueada y las pistas sí registran', () => {
    db.ensurePlayer('p-a', 'tester');
    const lvl = fakeLevel('fundamentos-l1');
    const fake = fakeSession();
    fake.level = lvl;
    const engine = new GameEngine('p-a', lvl, fake);
    expect(engine.solutionUnlocked()).toBe(false);

    const h1 = engine.hint();
    expect(h1.index).toBe(1);
    expect(h1.penalty).toBeGreaterThan(0);
    expect(db.getLevelProgress('p-a', 'fundamentos-l1')?.hints_used).toBe(1);
  });

  it('tras capturar la flag: solución libre SIN pistas y pistas gratis sin registrar', () => {
    db.ensurePlayer('p-b', 'tester');
    const lvl = fakeLevel('fundamentos-l1');
    const fake = fakeSession();
    fake.flag = generateSessionFlag('sess-b', 'fundamentos-l1', 'unit-secret');
    fake.level = lvl;
    const engine = new GameEngine('p-b', lvl, fake);

    const out = engine.submit(fake.flag.value);
    expect(out.passed).toBe(true);

    // la solución queda desbloqueada sin haber visto ninguna pista
    expect(engine.solutionUnlocked()).toBe(true);
    expect(engine.solutionPlain()).toBe(lvl.solution);
    expect(db.getLevelProgress('p-b', 'fundamentos-l1')?.hints_used).toBe(0);

    // repasar pistas después de resolver: sin penalización y SIN registro en la DB
    const h1 = engine.hint();
    expect(h1.penalty).toBe(0);
    expect(h1.plain).toBe('pista 1');
    const h2 = engine.hint();
    expect(h2.plain).toBe('pista 2');
    expect(db.getLevelProgress('p-b', 'fundamentos-l1')?.hints_used).toBe(0);
  });

  it('reabrir un nivel ya resuelto: solución disponible y pistas gratis desde el arranque', () => {
    db.ensurePlayer('p-c', 'tester');
    const lvl = fakeLevel('fundamentos-l1');
    const fake = fakeSession();
    fake.flag = generateSessionFlag('sess-c', 'fundamentos-l1', 'unit-secret');
    fake.level = lvl;
    const first = new GameEngine('p-c', lvl, fake);
    expect(first.submit(fake.flag.value).passed).toBe(true);

    // nueva sesión (reinicio del server, reentrada al nivel)
    const fake2 = fakeSession();
    fake2.flag = fakeSession().flag;
    fake2.level = lvl;
    const replay = new GameEngine('p-c', lvl, fake2);
    expect(replay.solutionUnlocked()).toBe(true);

    const h = replay.hint();
    expect(h.penalty).toBe(0);
    expect(db.getLevelProgress('p-c', 'fundamentos-l1')?.hints_used).toBe(0);
  });

  it('antes de resolver la solución sigue bloqueada a 2 pistas o 5 fallos', () => {
    db.ensurePlayer('p-d', 'tester');
    const lvl = fakeLevel('fundamentos-l1');
    const fake = fakeSession();
    fake.flag = generateSessionFlag('sess-d', 'fundamentos-l1', 'unit-secret');
    fake.level = lvl;
    const engine = new GameEngine('p-d', lvl, fake);

    expect(engine.solutionUnlocked()).toBe(false);
    engine.hint();
    expect(engine.solutionUnlocked()).toBe(false);
    engine.hint();
    expect(engine.solutionUnlocked()).toBe(true);
    expect(engine.solutionPlain()).toBe(lvl.solution);

    const engine2 = new GameEngine('p-d', lvl, fake.flag ? { ...fake, level: lvl } : fake);
    for (let i = 0; i < 5; i++) engine2.submit('FLAG{000000000000000000000000}');
    expect(engine2.solutionUnlocked()).toBe(true);
  });
});
