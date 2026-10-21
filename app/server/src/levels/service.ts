import { loadAllLevels, levelsByTrack } from './loader.js';
import { loadTrackMetadata, type LevelDefinition, type TrackMetadata, type TrackId } from './tracks.js';
import { getProgress, type ProgressRow } from '../progress/db.js';

/** Fachada del catálogo de niveles: carga, orden global y proyección pública. */

export interface LevelsService {
  all: Map<string, LevelDefinition>;
  ordered: LevelDefinition[]; // orden global (por track, luego índice)
  tracks: TrackMetadata[];
  nextLevelId(levelId: string): string | null;
  byTrack(trackId: TrackId): LevelDefinition[];
  publicLevel(level: LevelDefinition, solved: boolean): unknown;
}

export function createLevelsService(levelsDir: string): LevelsService {
  const all = loadAllLevels(levelsDir);
  const tracks = loadTrackMetadata();
  const ordered = [...all.values()].sort((a, b) => {
    const ta = tracks.find((t) => t.id === a.track)!;
    const tb = tracks.find((t) => t.id === b.track)!;
    return ta.order - tb.order || a.index - b.index;
  });

  const service: LevelsService = {
    all,
    ordered,
    tracks,
    byTrack(id: TrackId) {
      return levelsByTrack(all, id);
    },
    nextLevelId(levelId: string): string | null {
      const i = ordered.findIndex((l) => l.id === levelId);
      if (i === -1 || i === ordered.length - 1) return null;
      return ordered[i + 1].id;
    },
    publicLevel(level: LevelDefinition, solved: boolean) {
      return {
        id: level.id,
        track: level.track,
        index: level.index,
        title: level.title,
        subtitle: level.subtitle ?? null,
        xp: level.xp,
        difficulty: level.difficulty,
        brief: level.brief,
        goal: level.goal,
        cheatsheet: level.cheatsheet,
        hintsCount: level.hints.length,
        keywords: level.keywords,
        teach: solved ? level.teach : null, // solo tras resolver
        solved,
      };
    },
  };
  return service;
}

/** Primer nivel sin resolver del jugador (orden global). */
export function currentLevelId(service: LevelsService, playerId: string): string {
  const progress = getProgress(playerId);
  const solvedSet = new Set(progress.map((p: ProgressRow) => p.level_id));
  const firstUnsolved = service.ordered.find((l) => !solvedSet.has(l.id));
  return firstUnsolved?.id ?? service.ordered[0]?.id ?? '';
}
