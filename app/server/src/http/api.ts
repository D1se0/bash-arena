import express, { type Request, type Response } from 'express';
import { config } from '../config.js';
import { logger } from '../log.js';
import type { LevelsService } from '../levels/service.js';
import { currentLevelId } from '../levels/service.js';
import { sessionManager } from '../docker/manager.js';
import {
  ensurePlayer,
  getPlayer,
  getProgress,
  getFullState,
  importState,
  resetPlayer,
} from '../progress/db.js';
import { rankForXp } from '../engine/gamification.js';
import { RateLimiter } from '../ws/ratelimit.js';

const apiLimiter = new RateLimiter(120, 600);

function rateGate(req: Request, res: Response): boolean {
  const ip = String(req.headers['x-forwarded-for'] ?? '') || req.socket.remoteAddress || 'unknown';
  if (!apiLimiter.allow(ip)) {
    res.status(429).json({ error: 'rate limited' });
    return false;
  }
  return true;
}

export function buildApi(service: LevelsService): express.Express {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      ok: true,
      uptime_s: Math.round(process.uptime()),
      sessions: sessionManager.totalSessions(),
      levels: service.ordered.length,
    });
  });

  app.get('/api/tracks', (req, res) => {
    if (!rateGate(req, res)) return;
    const progress = playerIdOf(req) ? getProgress(playerIdOf(req) as string) : [];
    const solvedByTrack = new Map<string, number>();
    for (const p of progress) {
      if (p.solved === 1) solvedByTrack.set(p.track, (solvedByTrack.get(p.track) ?? 0) + 1);
    }
    const tracks = service.tracks.map((t: (typeof service.tracks)[number]) => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      color: t.color,
      description: t.description,
      order: t.order,
      levels: service.ordered.filter((l) => l.track === t.id).length,
      solved: solvedByTrack.get(t.id) ?? 0,
    }));
    res.status(200).json({ tracks });
  });

  app.get('/api/levels', (req, res) => {
    if (!rateGate(req, res)) return;
    const pid = playerIdOf(req);
    const solvedSet = new Set(
      pid ? getProgress(pid).filter((p) => p.solved === 1).map((p) => p.level_id) : [],
    );
    const levels = service.ordered.map((l) => service.publicLevel(l, solvedSet.has(l.id)));
    res.status(200).json({ levels });
  });

  app.get('/api/player/:id', (req, res) => {
    if (!rateGate(req, res)) return;
    const id = req.params.id;
    const row = ensurePlayer(id);
    res.status(200).json({
      playerId: row.id,
      xp: row.xp,
      rank: rankForXp(row.xp).name,
      currentLevelId: currentLevelId(service, id),
      progress: getProgress(id),
    });
  });

  app.post('/api/progress/:id/reset', (req, res) => {
    if (!rateGate(req, res)) return;
    resetPlayer(req.params.id);
    logger.info({ playerId: req.params.id.slice(0, 8) }, 'progress reset');
    res.status(200).json({ ok: true });
  });

  app.get('/api/progress/:id/export', (req, res) => {
    if (!rateGate(req, res)) return;
    const id = req.params.id;
    const player = getPlayer(id);
    if (!player) {
      res.status(404).json({ error: 'jugador no encontrado' });
      return;
    }
    const state = getFullState(id) as Record<string, unknown>;
    res.setHeader('Content-Disposition', `attachment; filename="bash-arena-progress-${id.slice(0, 8)}.json"`);
    res.status(200).json(state);
  });

  app.post('/api/progress/:id/import', (req, res) => {
    if (!rateGate(req, res)) return;
    const id = req.params.id;
    const state = req.body;
    if (!state || typeof state !== 'object') {
      res.status(400).json({ error: 'state inválido' });
      return;
    }
    const { imported } = importState(id, state);
    res.status(200).json({ ok: true, imported });
  });

  return app;
}

function playerIdOf(req: Request): string | null {
  const v = req.query.playerId;
  if (typeof v !== 'string') return null;
  return /^[\w-]{8,64}$/.test(v) ? v : null;
}

export function apiConfig(): { port: number } {
  return { port: config.port };
}
