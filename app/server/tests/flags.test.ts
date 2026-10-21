import { describe, expect, it } from 'vitest';
import {
  extractFlag,
  generateSessionFlag,
  validateFlag,
} from '../src/flags.js';

describe('flags por sesión (HMAC)', () => {
  const secret = 'unit-test-secret';

  it('genera FLAG{24 hex} con nonce por llamada (incluso misma sesión difiere)', () => {
    const a = generateSessionFlag('sess-1', 'fundamentos-l1', secret);
    const b = generateSessionFlag('sess-1', 'fundamentos-l1', secret);
    expect(a.value).toMatch(/^FLAG\{[0-9a-f]{24}\}$/);
    expect(a.value).not.toBe(b.value); // nonce aleatorio → regenerar no reproducir
    expect(validateFlag(a.value, a)).toBe(true);
    expect(validateFlag(b.value, b)).toBe(true);
  });

  it('difiere entre sesiones y niveles', () => {
    const a = generateSessionFlag('sess-1', 'fundamentos-l1', secret);
    const b = generateSessionFlag('sess-2', 'fundamentos-l1', secret);
    const c = generateSessionFlag('sess-1', 'filtrado-l1', secret);
    expect(a.value).not.toBe(b.value);
    expect(a.value).not.toBe(c.value);
  });

  it('depende del secreto', () => {
    const a = generateSessionFlag('sess-1', 'fundamentos-l1', secret);
    const b = generateSessionFlag('sess-1', 'fundamentos-l1', 'otro-secreto');
    expect(a.value).not.toBe(b.value);
  });

  it('valida en tiempo constante (ok / formato / valor feliz)', () => {
    const f = generateSessionFlag('sess-1', 'fundamentos-l1', secret);
    expect(validateFlag(f.value, f)).toBe(true);
    expect(validateFlag('FLAG{000000000000000000000000}', f)).toBe(false);
    expect(validateFlag('_flag_llum', f)).toBe(false);
    expect(validateFlag(f.value.toUpperCase(), f)).toBe(false);
  });

  it('extractFlag encuentra el primer match bien formado', () => {
    expect(extractFlag('basura FLAG{0123456789abcdef01234567} cola')).toBe(
      'FLAG{0123456789abcdef01234567}',
    );
    expect(extractFlag('sin flags')).toBeNull();
  });
});
