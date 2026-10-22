/** Protocolo WebSocket del dojo (cliente ⇄ servidor). */

export interface ClientToServer {
  hello: { playerId: string; name?: string };
  start: { levelId?: string };
  input: { data: string };
  resize: { cols: number; rows: number };
  submitFlag: { flag: string };
  hintRequest: Record<string, never>;
  goalRequest: Record<string, never>;
  statusRequest: Record<string, never>;
  solutionRequest: Record<string, never>;
  next: Record<string, never>;
  reset: Record<string, never>;
}

export interface PublicLevelInfo {
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

export interface ServerToClient {
  welcome: {
    playerId: string;
    xp: number;
    rank: string;
    rankIndex: number;
    nextRankAt: number | null;
    levelId: string | null;
    tracks: { id: string; name: string; icon: string; color: string; totalCount: number }[];
    tip?: string;
  };
  data: { data: string };
  levelState: { level: PublicLevelInfo | null; startedAt: number };
  submitResult: {
    ok: boolean;
    passed: boolean;
    message: string;
    xpGained?: number;
    totalXp?: number;
    rank?: string;
    nextLevelId?: string | null;
  };
  hint: { text: string | null; index: number; total: number };
  solution: { text: string | null };
  status: { xp: number; rank: string; solvedLevels: number; totalLevels: number; levelId: string };
  error: { message: string };
  exit: { reason: string };
  progressUpdated: { xp: number; rank: string };
}

export type ServerToClientMsgs = {
  [K in keyof ServerToClient]: { type: K; payload: ServerToClient[K] };
}[keyof ServerToClient];

export type ClientToServerMsgs = {
  [K in keyof ClientToServer]: { type: K; payload: ClientToServer[K] };
}[keyof ClientToServer];

/** Palabras reservadas del dojo (interceptadas servidor-side). */
export const RESERVED_COMMANDS = ['submit', 'hint', 'goal', 'status', 'next', 'reset', 'solution', 'start', 'help'] as const;
export type ReservedCommand = (typeof RESERVED_COMMANDS)[number];
