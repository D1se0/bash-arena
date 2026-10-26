import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { config } from '../config.js';
import { logger } from '../log.js';

/** Progreso de jugadores: SQLite en el volumen /data. */

export interface PlayerRow {
  id: string;
  name: string;
  xp: number;
  created_at: string;
  last_seen: string;
}

export interface ProgressRow {
  player_id: string;
  level_id: string;
  track: string;
  solved: number;        // 0/1
  attempts: number;
  hints_used: number;
  time_s: number;
  xp_earned: number;
  solved_at: string;
}

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;
  fs.mkdirSync(config.dataDir, { recursive: true });
  const file = path.join(config.dataDir, 'progress.db');
  db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  migrate(db);
  logger.info({ file }, 'sqlite ready');
  return db;
}

function migrate(instance: Database.Database): void {
  instance.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT 'agent',
      xp INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_seen  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS progress (
      player_id  TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      level_id   TEXT NOT NULL,
      track      TEXT NOT NULL,
      solved     INTEGER NOT NULL DEFAULT 0,
      attempts   INTEGER NOT NULL DEFAULT 0,
      hints_used INTEGER NOT NULL DEFAULT 0,
      time_s     INTEGER NOT NULL DEFAULT 0,
      xp_earned  INTEGER NOT NULL DEFAULT 0,
      solved_at  TEXT,
      PRIMARY KEY (player_id, level_id)
    );
    CREATE TABLE IF NOT EXISTS achievements (
      player_id  TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      name       TEXT NOT NULL,
      earned_at  TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (player_id, name)
    );
    CREATE TABLE IF NOT EXISTS stats (
      player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      key       TEXT NOT NULL,
      value     INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (player_id, key)
    );
  `);
}

export function ensurePlayer(id: string, name = 'agent'): PlayerRow {
  const instance = getDb();
  instance.prepare('INSERT OR IGNORE INTO players(id, name) VALUES (?, ?)').run(id, name);
  const row = instance.prepare('SELECT * FROM players WHERE id = ?').get(id) as PlayerRow | undefined;
  if (!row) throw new Error('player insert failed');
  return row;
}

export function getPlayer(id: string): PlayerRow | null {
  const instance = getDb();
  const row = instance.prepare('SELECT * FROM players WHERE id = ?').get(id) as PlayerRow | undefined;
  return row ?? null;
}

export function touchPlayer(id: string): void {
  getDb().prepare("UPDATE players SET last_seen = datetime('now') WHERE id = ?").run(id);
}

export function addXp(id: string, amount: number): number {
  const instance = getDb();
  instance.prepare('UPDATE players SET xp = xp + ? WHERE id = ?').run(amount, id);
  const row = instance.prepare('SELECT xp FROM players WHERE id = ?').get(id) as { xp: number } | undefined;
  return row ? row.xp : 0;
}

export function setXp(id: string, amount: number): void {
  getDb().prepare('UPDATE players SET xp = ? WHERE id = ?').run(amount, id);
}

interface markLevelOpts {
  playerId: string;
  levelId: string;
  track: string;
  xpEarned: number;
  timeS: number;
  hintsUsed: number;
}

export function markLevelSolved(opts: markLevelOpts): void {
  const instance = getDb();
  const stmt = instance.prepare(`
    INSERT INTO progress (player_id, level_id, track, solved, attempts, time_s, hints_used, xp_earned, solved_at)
    VALUES (?, ?, ?, 1, 1, ?, ?, ?, datetime('now'))
    ON CONFLICT(player_id, level_id) DO UPDATE SET
      solved = 1,
      attempts = attempts + 1,
      time_s = min(progress.time_s, excluded.time_s),
      hints_used = min(progress.hints_used, excluded.hints_used),
      xp_earned = max(progress.xp_earned, excluded.xp_earned),
      solved_at = COALESCE(progress.solved_at, excluded.solved_at)
  `);
  stmt.run(opts.playerId, opts.levelId, opts.track, opts.timeS, opts.hintsUsed, opts.xpEarned);
}

export function recordAttempt(playerId: string, levelId: string, track: string): void {
  const instance = getDb();
  instance
    .prepare(
      `INSERT INTO progress (player_id, level_id, track) VALUES (?, ?, ?)
       ON CONFLICT(player_id, level_id) DO UPDATE SET attempts = attempts + 1`,
    )
    .run(playerId, levelId, track);
}

export function recordHints(playerId: string, levelId: string, track: string, count: number): void {
  const instance = getDb();
  instance
    .prepare(
      `INSERT INTO progress (player_id, level_id, track, hints_used) VALUES (?, ?, ?, ?)
       ON CONFLICT(player_id, level_id) DO UPDATE SET hints_used = excluded.hints_used`,
    )
    .run(playerId, levelId, track, count);
}

/** Fila de progreso de UN nivel concreto (o null si no hay registro). */
export function getLevelProgress(playerId: string, levelId: string): ProgressRow | null {
  const instance = getDb();
  const row = instance
    .prepare('SELECT * FROM progress WHERE player_id = ? AND level_id = ?')
    .get(playerId, levelId) as ProgressRow | undefined;
  return row ?? null;
}

export function getProgress(playerId: string): ProgressRow[] {
  const instance = getDb();
  const rows = instance
    .prepare('SELECT * FROM progress WHERE player_id = ? ORDER BY solved_at')
    .all(playerId) as ProgressRow[];
  return rows;
}

/** Reset completo del progreso de un jugador (opción UI/scripts). */
export function resetPlayer(playerId: string): void {
  const instance = getDb();
  instance.prepare('DELETE FROM progress WHERE player_id = ?').run(playerId);
  instance.prepare('DELETE FROM achievements WHERE player_id = ?').run(playerId);
  instance.prepare('DELETE FROM stats WHERE player_id = ?').run(playerId);
  instance.prepare('UPDATE players SET xp = 0 WHERE id = ?').run(playerId);
}

export function grantAchievement(playerId: string, name: string): void {
  getDb()
    .prepare('INSERT OR IGNORE INTO achievements (player_id, name) VALUES (?, ?)')
    .run(playerId, name);
}

export function bumpStat(playerId: string, key: string, delta = 1): void {
  const instance = getDb();
  instance
    .prepare(
      `INSERT INTO stats (player_id, key, value) VALUES (?, ?, ?)
       ON CONFLICT(player_id, key) DO UPDATE SET value = value + ?`,
    )
    .run(playerId, key, delta, delta);
}

export function getFullState(playerId: string): unknown {
  const instance = getDb();
  const player = instance
    .prepare('SELECT id, name, xp, created_at, last_seen FROM players WHERE id = ?')
    .get(playerId) as PlayerRow | undefined;
  const progress = getProgress(playerId);
  const achievements = instance
    .prepare('SELECT name, earned_at FROM achievements WHERE player_id = ?')
    .all(playerId);
  const stats = instance.prepare('SELECT key, value FROM stats WHERE player_id = ?').all(playerId);
  return { player, progress, achievements, stats };
}

/** Importa un estado exportado (merge a favor de lo mejor: xp mayor, solved 1). */
export function importState(playerId: string, state: unknown): { imported: number } {
  let imported = 0;
  const instance = getDb();
  const s = state as { player?: { xp?: number }; progress?: ProgressRow[]; achievements?: { name: string }[] };
  if (!playerId) return { imported: 0 };
  ensurePlayer(playerId);
  if (typeof s?.player?.xp === 'number') {
    const current = getPlayer(playerId)?.xp ?? 0;
    if (s.player.xp > current) setXp(playerId, s.player.xp);
  }
  for (const p of s?.progress ?? []) {
    if (!p.level_id || !p.track) continue;
    instance
      .prepare(
        `INSERT INTO progress (player_id, level_id, track, solved, attempts, hints_used, time_s, xp_earned, solved_at)
         VALUES (?, ?, ?, 1, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(player_id, level_id) DO UPDATE SET solved = max(progress.solved, excluded.solved)`,
      )
      .run(playerId, p.level_id, p.track, p.attempts ?? 1, p.hints_used ?? 0, p.time_s ?? 0, p.xp_earned ?? 0);
    imported++;
  }
  for (const a of s?.achievements ?? []) {
    if (typeof a?.name === 'string') grantAchievement(playerId, a.name);
  }
  return { imported };
}

export function closeDb(): void {
  db?.close();
  db = null;
}
