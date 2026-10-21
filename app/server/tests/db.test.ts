import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

// la base lee ARENA_DATA_DIR al importar: el dir tmp va ANTES del import dinámico
process.env.ARENA_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'arena-db-unit-'));

describe('persistencia de progreso (SQLite)', () => {
  let db: typeof import('../src/progress/db.js');

  beforeAll(async () => {
    db = await import('../src/progress/db.js');
  });

  it('crea jugador a demanda y permite subir XP', () => {
    const p = db.ensurePlayer('player-unit-1', 'tester');
    expect(p.id).toBe('player-unit-1');
    const xp = db.addXp('player-unit-1', 25);
    expect(xp).toBe(25);
    expect(db.getPlayer('player-unit-1')?.xp).toBe(25);
  });

  it('marca nivel resuelto y guarda el mejor tiempo/hints conocidos', () => {
    db.markLevelSolved({ playerId: 'player-unit-1', levelId: 'fundamentos-l1', track: 'fundamentos', xpEarned: 25, timeS: 9, hintsUsed: 0 });
    db.markLevelSolved({ playerId: 'player-unit-1', levelId: 'fundamentos-l1', track: 'fundamentos', xpEarned: 25, timeS: 5, hintsUsed: 1 });
    const rows = db.getProgress('player-unit-1');
    expect(rows).toHaveLength(1);
    // el mejor tiempo (min=5) y las mejoras pipsas conocidas: min(prev=0, nuevo=1) = 0
    expect(rows[0]).toMatchObject({ level_id: 'fundamentos-l1', solved: 1, time_s: 5, hints_used: 0 });
  });

  it('importState rellena progreso y no machaca XP menor', () => {
    db.ensurePlayer('player-unit-2', 'tester');
    const { imported } = db.importState('player-unit-2', {
      player: { xp: 99 },
      progress: [{ player_id: 'x', level_id: 'filtrado-l1', track: 'filtrado', attempts: 1 }],
      achievements: [{ name: 'Racha de 5' }],
    });
    expect(imported).toBe(1);
    expect(db.getPlayer('player-unit-2')?.xp).toBe(99);
    expect(db.getProgress('player-unit-2')[0].level_id).toBe('filtrado-l1');
  });

  it('resetPlayer borra progreso y XP', () => {
    db.resetPlayer('player-unit-1');
    expect(db.getPlayer('player-unit-1')?.xp).toBe(0);
    expect(db.getProgress('player-unit-1')).toHaveLength(0);
  });
});
