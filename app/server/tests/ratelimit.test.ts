import { describe, expect, it } from 'vitest';
import { RateLimiter } from '../src/ws/ratelimit.js';

describe('RateLimiter (token bucket)', () => {
  it('permite hasta la capacidad y luego bloquea', () => {
    const rl = new RateLimiter(3, 60);
    expect(rl.allow('ip1')).toBe(true);
    expect(rl.allow('ip1')).toBe(true);
    expect(rl.allow('ip1')).toBe(true);
    expect(rl.allow('ip1')).toBe(false);
    expect(rl.allow('ip2')).toBe(true);
  });

  it('cada clave tiene su propio bucket', () => {
    const rl = new RateLimiter(1, 0);
    expect(rl.allow('a')).toBe(true);
    expect(rl.allow('a')).toBe(false);
    expect(rl.allow('b')).toBe(true);
  });

  it('sweep limpia buckets viejos', () => {
    const rl = new RateLimiter(1, 0);
    expect(rl.allow('old')).toBe(true);
    rl.sweep(-1); // todo es viejo
    // tras el sweep el bucket se recrea lleno
    expect(rl.allow('old')).toBe(true);
  });
});
