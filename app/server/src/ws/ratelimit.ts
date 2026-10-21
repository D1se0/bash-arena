/** Rate limiter token-bucket en memoria, por clave (IP, playerId…). */

interface Bucket {
  tokens: number;
  last: number;
}

export class RateLimiter {
  private buckets = new Map<string, Bucket>();
  constructor(
    private readonly capacity: number,
    private readonly refillPerMin: number,
  ) {}

  allow(key: string, cost = 1): boolean {
    const now = Date.now();
    let b = this.buckets.get(key);
    if (!b) {
      b = { tokens: this.capacity, last: now };
      this.buckets.set(key, b);
    }
    const elapsedMin = (now - b.last) / 60_000;
    b.tokens = Math.min(this.capacity, b.tokens + elapsedMin * this.refillPerMin);
    b.last = now;
    if (b.tokens >= cost) {
      b.tokens -= cost;
      return true;
    }
    return false;
  }

  /** limpia buckets viejos (llamado periódicamente). */
  sweep(olderThanMs = 10 * 60_000): void {
    const now = Date.now();
    for (const [k, b] of this.buckets) {
      if (now - b.last > olderThanMs) this.buckets.delete(k);
    }
  }
}
