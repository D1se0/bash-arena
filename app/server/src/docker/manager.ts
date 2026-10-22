import crypto from 'node:crypto';
import { config } from '../config.js';
import { logger } from '../log.js';
import { generateSessionFlag, type SessionFlag } from '../flags.js';
import type { LevelDefinition } from '../levels/tracks.js';
import { ArenaSession, type SessionCallbacks } from './session.js';

/** Gestor global de sesiones: límites por IP/global, ciclo de vida, cleanup. */

export interface SessionRecord {
  session: ArenaSession;
  flag: SessionFlag;
  level: LevelDefinition;
  ip: string;
  startedAt: number;
}

class SessionManager {
  private sessions = new Map<string, SessionRecord>(); // key: playerId
  private perIp = new Map<string, Set<string>>();
  private sweeper: NodeJS.Timeout | null = null;

  constructor() {
    this.sweeper = setInterval(() => this.sweep(), 20_000);
    if (this.sweeper.unref) this.sweeper.unref();
  }

  countForIp(ip: string): number {
    return this.perIp.get(ip)?.size ?? 0;
  }

  totalSessions(): number {
    return this.sessions.size;
  }

  get(playerId: string): SessionRecord | undefined {
    return this.sessions.get(playerId);
  }

  async create(
    playerId: string,
    ip: string,
    level: LevelDefinition,
    callbacks: SessionCallbacks,
  ): Promise<SessionRecord> {
    logger.info({ playerId: playerId.slice(0, 8) }, 'manager create()');
    // limites ANTES de matar la sesión previa (evita doble-bypass al nivel nuevo)
    if (this.sessions.size >= config.maxSessions) {
      throw new Error('global session limit reached');
    }
    const priorSet = this.perIp.get(ip);
    const alreadyMine = priorSet?.has(playerId) ?? false;
    if (!alreadyMine && (priorSet?.size ?? 0) >= config.maxSessionsPerIp) {
      // UX: en desarrollo/localhost es fácil acumular slots (reabrir la página,
      // probes, etc.). Antes de rechazar, evicta la sesión MÁS inactiva del
      // propio IP — nunca una sesión que esté activa de verdad (idle < 10 s).
      const minIdleMs = 10_000;
      const withIdle = [...(priorSet ?? [])]
        .map((id) => ({ id, rec: this.sessions.get(id) }))
        .filter((x): x is { id: string; rec: SessionRecord } => !!x.rec && x.rec.session.idleMs >= minIdleMs)
        // la más inactiva primero
        .sort((a, b) => b.rec.session.idleMs - a.rec.session.idleMs);
      while ((priorSet?.size ?? 0) >= config.maxSessionsPerIp && withIdle.length) {
        const victim = withIdle.shift()!;
        logger.info(
          { playerId: victim.id.slice(0, 8), idleSec: Math.round(victim.rec.session.idleMs / 1000) },
          'evicting idle session (per-IP limit)',
        );
        await this.drop(victim.id, 'per-IP evict');
      }
      if ((priorSet?.size ?? 0) >= config.maxSessionsPerIp) {
        throw new Error('per-IP session limit reached');
      }
    }

    await this.drop(playerId, 're-create');

    let set = this.perIp.get(ip);
    if (!set) {
      set = new Set();
      this.perIp.set(ip, set);
    }
    set.add(playerId);

    const sessionId = crypto.randomUUID();
    const flag = generateSessionFlag(sessionId, level.id, config.flagSecret);
    const session = new ArenaSession(playerId, level, flag.value, callbacks);
    const record: SessionRecord = { session, flag, level, ip, startedAt: Date.now() };
    this.sessions.set(playerId, record);
    logger.info({ playerId: playerId.slice(0, 8), level: level.id }, 'session created');
    return record;
  }

  async drop(playerId: string, why = 'explicit'): Promise<void> {
    const rec = this.sessions.get(playerId);
    if (!rec) return;
    logger.info({ playerId: playerId.slice(0, 8), level: rec.level.id, why }, 'manager drop()');
    this.sessions.delete(playerId);
    const set = this.perIp.get(rec.ip);
    if (set) {
      set.delete(playerId);
      if (set.size === 0) this.perIp.delete(rec.ip);
    }
    await rec.session.kill();
  }

  async dropAll(): Promise<number> {
    const ids = [...this.sessions.keys()];
    for (const id of ids) await this.drop(id);
    return ids.length;
  }

  /** Mata sesiones inactivas o demasiado longevas. */
  private sweep(): void {
    for (const [playerId, rec] of this.sessions) {
      const idleLimit = config.idleTimeoutMin * 60_000;
      const ageLimit = config.sessionMaxMin * 60_000;
      const destroyWhy =
        rec.session.idleMs > idleLimit ? 'idle' : rec.session.ageMs > ageLimit ? 'too-long' : null;
      if (!destroyWhy) continue;
      logger.info({ playerId: playerId.slice(0, 8), level: rec.level.id, destroyWhy }, 'sweeping session');
      void this.drop(playerId);
    }
  }
}

export const sessionManager = new SessionManager();

// re-export para gateway sin acoplaje circular de tipos
export type { SessionCallbacks };
