/** Configuración central del servidor (variables de entorno con valores por defecto). */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function envInt(name: string, def: number): number {
  const v = process.env[name];
  if (!v) return def;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
}

function envStr(name: string, def: string): string {
  return process.env[name] ?? def;
}

/** Ruta al directorio de niveles (monorepo root /levels). */
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, process.env.NODE_ENV === 'production' ? '../../../../' : '../../../..');
const DEFAULT_LEVELS_DIR = path.join(repoRoot, 'levels');

export const config = {
  port: envInt('PORT', 8080),
  levelsDir: envStr('ARENA_LEVELS_DIR', DEFAULT_LEVELS_DIR),
  dockerSocket: envStr('ARENA_DOCKER_SOCKET', '/var/run/docker.sock'),
  dojoImage: process.env.ARENA_DOJO_IMAGE ?? 'bash-arena/dojo-base:latest',
  flagSecret: envStr('ARENA_FLAG_SECRET', 'dev-secret-change-me'),
  maxSessions: envInt('ARENA_MAX_SESSIONS', 8),
  maxSessionsPerIp: envInt('ARENA_MAX_SESSIONS_PER_IP', 2),
  idleTimeoutMin: envInt('ARENA_IDLE_TIMEOUT_MIN', 15),
  sessionMaxMin: envInt('ARENA_SESSION_MAX_MIN', 90),
  containerMemMb: envInt('ARENA_CONTAINER_MEM_MB', 256),
  containerCpu: envInt('ARENA_CONTAINER_CPU', 0.5),
  containerPids: envInt('ARENA_CONTAINER_PIDS', 128),
  dataDir: envStr('ARENA_DATA_DIR', './data'),
  /** Contenedores con cap SYS_ADMIN deshabilitado: siempre. */
  hardening: {
    readOnlyRootfs: false, // se limita por permisos Unix (user agent 1000) — ver docs/threat-model.md
    capDrop: ['ALL'] as const,
    capAdd: ['CHOWN', 'DAC_OVERRIDE', 'FOWNER', 'SETUID', 'SETGID', 'SYS_CHROOT'] as string[],
  },
} as const;
