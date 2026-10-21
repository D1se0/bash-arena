import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    hookTimeout: 30_000,
    testTimeout: 30_000,
  },
});
