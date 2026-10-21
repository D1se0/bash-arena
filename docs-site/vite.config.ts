import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.VITE_BASE ?? '/';

export default defineConfig({
  plugins: [react()],
  base,
  build: { outDir: 'dist', sourcemap: false },
  server: { port: 5174 },
});
