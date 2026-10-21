import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import {
  loadTrackMetadata,
  type LevelDefinition,
  type TrackMetadata,
  type CheatsheetEntry,
  type TrackId,
  type SecurityProfile,
} from './tracks.js';
import { logger } from '../log.js';
import { fileURLToPath } from 'node:url';

const TRACKS_DIR = trackDir();
function trackDir(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '..', '..', '..', 'levels');
}

function slug(track: string, n: number): string {
  return `${track}-l${n}`;
}

/** Carga y valida todos los niveles del directorio /levels/<track>/<id>.yaml. */
export function loadAllLevels(levelsDir: string = TRACKS_DIR): Map<string, LevelDefinition> {
  const map = new Map<string, LevelDefinition>();
  if (!fs.existsSync(levelsDir)) {
    logger.warn({ levelsDir }, 'levels dir not found');
    return map;
  }
  for (const track of loadTrackMetadata()) {
    const dir = path.join(levelsDir, track.id);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml')).sort();
    files.forEach((file, i) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      let data: unknown;
      try {
        data = YAML.parse(raw);
      } catch (e) {
        logger.error({ file }, `YAML parse error: ${(e as Error).message}`);
        return;
      }
      if (!data || typeof data !== 'object') return;
      const level = validateLevel(data as Record<string, unknown>, file);
      if (!level) return;
      if (level.id !== slug(track.id, i + 1)) {
        logger.warn({ file, id: level.id }, `level id mismatch (expected ${slug(track.id, i + 1)})`);
      }
      map.set(level.id, level);
    });
  }
  logger.info({ count: map.size }, 'levels loaded');
  return map;
}

function validateLevel(data: Record<string, unknown>, file: string): LevelDefinition | null {
  const fail = (why: string) => {
    logger.error({ file, why }, 'level validation failed');
    return null;
  };
  const track = String(data.track ?? '');
  if (!loadTrackMetadata().some((t: TrackMetadata) => t.id === track)) return fail(`unknown track "${track}"`);
  if (typeof data.title !== 'string' || !data.title) return fail('missing title');
  if (!data.setup || typeof data.setup !== 'string') return fail('missing setup');
  if (!data.solution || typeof data.solution !== 'string') return fail('missing solution');
  const hints = Array.isArray(data.hints) ? data.hints.map(String) : [];
  const level: LevelDefinition = {
    id: String(data.id ?? ''),
    track: track as TrackId,
    index: Number(data.index ?? 0),
    title: data.title as string,
    subtitle: data.subtitle ? String(data.subtitle) : undefined,
    xp: Number(data.xp ?? 25),
    difficulty: Number(data.difficulty ?? 1) as 1 | 2 | 3 | 4 | 5,
    brief: String(data.brief ?? ''),
    goal: String(data.goal ?? ''),
    setup: data.setup,
    solution: data.solution,
    hints,
    cheatsheet: Array.isArray(data.cheatsheet)
      ? (data.cheatsheet as CheatsheetEntry[]).filter(
          (c) => c && typeof c.cmd === 'string' && typeof c.desc === 'string',
        )
      : [],
    teach: String(data.teach ?? ''),
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    profile: (data.profile === 'sudo' ? 'sudo' : 'default') as SecurityProfile,
  };
  if (!level.id) return fail('missing id');
  if (!level.goal) return fail('missing goal');
  if (!level.teach) return fail('missing teach');
  return level;
}

/** Devuelve niveles de un track ordenados por índice. */
export function levelsByTrack(all: Map<string, LevelDefinition>, trackId: TrackId): LevelDefinition[] {
  return [...all.values()].filter((l) => l.track === trackId).sort((a, b) => a.index - b.index);
}
