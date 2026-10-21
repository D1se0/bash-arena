import crypto from 'node:crypto';

/**
 * Flags por sesión: nunca compartibles entre usuarios. Cada sesión genera una
 * nonce aleatorio y deriva la flag final HMAC-SHA256(secret, session+level+nonce).
 * La validación es SIEMPRE en el servidor (comparación en tiempo constante).
 */

export interface SessionFlag {
  /** Valor completo que el usuario debe descubrir, p. ej. FLAG{a1b2...} */
  value: string;
  /** Hash interno corto para logs (nunca el valor). */
  fingerprint: string;
  nonce: string;
}

function hmac(secret: string, data: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

export function generateSessionFlag(sessionId: string, levelId: string, secret: string): SessionFlag {
  const nonce = crypto.randomBytes(8).toString('hex'); // 16 hex chars
  const inner = hmac(secret, `${sessionId}:${levelId}:${nonce}`);
  const value = `FLAG{${inner.slice(0, 24)}}`; // 24 hex chars
  const fingerprint = hmac(secret, `${value}`).slice(0, 8);
  return { value, fingerprint, nonce };
}

/** Comparación en tiempo constante sobre la flag completa. */
export function validateFlag(reported: string, expected: SessionFlag): boolean {
  if (typeof reported !== 'string') return false;
  const a = Buffer.from(reported.trim());
  const b = Buffer.from(expected.value);
  if (a.length !== b.length) {
    // digest vacío: operación equivalente en coste para no filtrar por tamaño
    crypto.timingSafeEqual(Buffer.alloc(32), Buffer.alloc(32));
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

/** Extrae primer FLAG{...} bien formado de un blob libre (para búsqueda manual). */
export function extractFlag(text: string): string | null {
  const m = /FLAG\{[0-9a-f]{24}\}/.exec(text);
  return m ? m[0] : null;
}
