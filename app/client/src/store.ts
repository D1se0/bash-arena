import { create } from 'zustand';

/** Protocolo (mirror del server, src/ws/protocol.ts). */
export interface PublicLevel {
  id: string;
  track: string;
  index: number;
  title: string;
  subtitle: string | null;
  xp: number;
  difficulty: number;
  brief: string;
  goal: string;
  cheatsheet: { cmd: string; desc: string }[];
  hintsCount: number;
  keywords: string[];
  teach: string | null;
  solved: boolean;
}

export interface TrackInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  order: number;
  levels: number;
  solved: number;
}

export interface WelcomePayload {
  playerId: string;
  xp: number;
  rank: string;
  rankIndex: number;
  nextRankAt: number | null;
  tracks: TrackInfo[];
}

type Msg =
  | { type: 'welcome'; payload: WelcomePayload }
  | { type: 'data'; payload: { data: string } }
  | { type: 'levelState'; payload: { level: PublicLevel | null; startedAt: number } }
  | { type: 'submitResult'; payload: { ok: boolean; passed: boolean; message?: string; xpGained?: number; totalXp?: number; rank?: string; nextLevelId?: string | null } }
  | { type: 'hint'; payload: { text: string | null; index: number; total: number } }
  | { type: 'solution'; payload: { text: string | null } }
  | { type: 'status'; payload: { xp: number; rank: string; solvedLevels: number; totalLevels: number; levelId: string } }
  | { type: 'error'; payload: { message: string } }
  | { type: 'exit'; payload: { reason: string } }
  | { type: 'progressUpdated'; payload: { xp: number; rank: string } };

export type SendFn = (msg: Record<string, unknown>) => void;

interface ArenaState {
  playerId: string | null;
  connected: boolean;
  welcome: WelcomePayload | null;
  level: PublicLevel | null;
  startedAt: number | null;
  xp: number;
  rank: string;
  nextRankAt: number | null;
  lastSubmit: { passed: boolean; xpGained?: number; totalXp?: number; rank?: string } | null;
  hintFlash: { text: string | null; index: number; total: number } | null;
  lastError: string | null;
  sessionDead: string | null;
  theme: 'dark' | 'crt';
  onTerminalData: ((s: string) => void) | null;
  send: SendFn | null;
  setTerminalSink: (fn: ((s: string) => void) | null) => void;
  setSend: (fn: SendFn | null) => void;
  setTheme: (t: 'dark' | 'crt') => void;
  ingest: (m: Msg) => void;
  setConnected: (c: boolean) => void;
  resetLevelFx: () => void;
}

/** El playerId vive en localStorage: progreso del jugador local sin cuenta. */
export function ensurePlayerId(): string {
  let id = localStorage.getItem('arena-player-id');
  if (!id || !/^[\w-]{8,64}$/.test(id)) {
    id = 'p' + crypto.randomUUID().replace(/-/g, '').slice(0, 20);
    localStorage.setItem('arena-player-id', id);
  }
  return id;
}

export const useArena = create<ArenaState>((set) => ({
  playerId: null,
  connected: false,
  welcome: null,
  level: null,
  startedAt: null,
  xp: 0,
  rank: 'Novato',
  nextRankAt: null,
  lastSubmit: null,
  hintFlash: null,
  lastError: null,
  sessionDead: null,
  theme: (localStorage.getItem('arena-theme') as 'dark' | 'crt') ?? 'dark',
  onTerminalData: null,
  send: null,
  setTerminalSink: (fn) => set({ onTerminalData: fn }),
  setSend: (fn) => set({ send: fn }),
  setTheme: (t) => {
    localStorage.setItem('arena-theme', t);
    set({ theme: t });
  },
  setConnected: (c) => set({ connected: c }),
  resetLevelFx: () => set({ lastSubmit: null, hintFlash: null }),
  ingest: (m) => {
    switch (m.type) {
      case 'welcome':
        set({
          welcome: m.payload,
          playerId: m.payload.playerId,
          xp: m.payload.xp,
          rank: m.payload.rank,
          nextRankAt: m.payload.nextRankAt,
        });
        break;
      case 'data':
        useArena.getState().onTerminalData?.(m.payload.data);
        break;
      case 'levelState':
        // el «flag correcta» es la recompensa: persiste aunque el engine sirva
        // ya el nivel siguiente; se limpia con resetLevelFx (✕ del banner,
        // siguiente nivel, start o reset)
        set({ level: m.payload.level, startedAt: m.payload.startedAt });
        break;
      case 'submitResult':
        if (m.payload.passed && m.payload.totalXp !== undefined) {
          set({ xp: m.payload.totalXp, rank: m.payload.rank ?? 'Novato', lastSubmit: m.payload });
        } else {
          set({ lastSubmit: m.payload });
        }
        break;
      case 'hint':
        set({ hintFlash: m.payload });
        break;
      case 'solution':
        break;
      case 'status':
        set({ xp: m.payload.xp, rank: m.payload.rank });
        break;
      case 'error':
        set({ lastError: m.payload.message });
        break;
      case 'exit':
        set({ sessionDead: m.payload.reason });
        break;
      default:
        break;
    }
  },
}));
