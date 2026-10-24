/**
 * lib-port — exportar/importar el progreso del dojo entre PCs.
 *
 * Dos canales:
 *  1) FICHERO `.json` (descarga desde /api/progress/:id/export)
 *  2) CÓDIGO DE TRANSFERENCIA: el mismo JSON, en base64 con checksum, para
 *     copiar/pegar (`BA1-<hash8>-<b64>`), tolerante a saltos de línea del chat.
 *
 * Al importar se puede ADOPTAR la identidad del jugador del fichero (para
 * «instalar en otro PC» con continuidad total) o MERGEAR en el jugador local
 * actual (el servidor favorece lo mejor: xp mayor, solved 1).
 */

export interface ProgressPortFile {
  format?: string; // 'bash-arena-progress'
  version?: number;
  exported_at?: string;
  player?: { id?: string; xp?: number; name?: string };
  progress?: {
    level_id: string;
    track: string;
    solved?: number;
    attempts?: number;
    hints_used?: number;
    time_s?: number;
    xp_earned?: number;
  }[];
  achievements?: { name: string }[];
  stats?: { key: string; value: number }[];
}

const PLAYER_ID_RE = /^[\w-]{8,64}$/;
const CODE_PREFIX = 'BA1';

/** djb2 → 8 hex: checksum antimanipulación / anti-copiado a medias. */
export function checksum8(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return (h >>> 0).toString(16).padStart(8, '0');
}

function utf8ToB64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function b64ToUtf8(b64: string): string {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/** JSON → código de transferencia (envuelto en líneas de 160 chars). */
export function encodeTransferCode(state: ProgressPortFile): string {
  const compact = JSON.stringify(state);
  const b64 = utf8ToB64(compact);
  const head = `${CODE_PREFIX}-${checksum8(b64)}-`;
  const wrapped = (head + b64).replace(/(.{160})/g, '$1\n');
  return wrapped;
}

/** Código de transferencia → JSON (quita espacios según se pegue); lanza si está roto. */
export function decodeTransferCode(raw: string): ProgressPortFile {
  const flat = raw.replace(/\s+/g, '');
  const m = new RegExp(`^${CODE_PREFIX}-([0-9a-f]{8})-(.+)$`).exec(flat);
  if (!m) throw new Error('código con formato inválido (esperado BA1-hash8-base64)');
  const [, sum, b64] = m;
  const actual = checksum8(b64);
  if (actual !== sum) throw new Error(`código dañado: checksum ${actual} ≠ ${sum}`);
  const json = b64ToUtf8(b64);
  const parsed = JSON.parse(json) as ProgressPortFile;
  return parsed;
}

/** parse con validación mínima; lanza mensajes en español para la UI. */
export function parseProgressFile(text: string): ProgressPortFile {
  const parsed = JSON.parse(text) as ProgressPortFile;
  if (!parsed || typeof parsed !== 'object') throw new Error('el JSON no contiene un objeto');
  if (!Array.isArray(parsed.progress) || parsed.progress.length === 0) {
    // igual válido (progreso recién empezado) pero avisamos del contenido vacío
    return parsed;
  }
  return parsed;
}

export function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ''));
    r.onerror = () => reject(new Error('no se pudo leer el fichero'));
    r.readAsText(file);
  });
}

export function downloadJson(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** estado exportado → id canónico de jugador (el embebido) si es válido. */
export function embeddedPlayerId(state: ProgressPortFile): string | null {
  const id = state.player?.id;
  return typeof id === 'string' && PLAYER_ID_RE.test(id) ? id : null;
}

export async function postImport(playerId: string, state: ProgressPortFile): Promise<number> {
  const res = await fetch(`/api/progress/${encodeURIComponent(playerId)}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  });
  if (!res.ok) {
    const j = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(j?.error ?? `import falló (HTTP ${res.status})`);
  }
  const j = (await res.json()) as { imported?: number };
  return j.imported ?? 0;
}

/** descarga el estado del jugador local y devuelve su texto. */
export async function fetchProgress(playerId: string): Promise<string> {
  const res = await fetch(`/api/progress/${encodeURIComponent(playerId)}/export`);
  if (!res.ok) throw new Error(`export falló (HTTP ${res.status})`);
  return res.text();
}

/** adopta la identidad: localStorage → id del fichero. */
export function adoptPlayerId(id: string): void {
  localStorage.setItem('arena-player-id', id);
}
