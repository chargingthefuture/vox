import { defineConfig } from 'vite';

// Served from https://chargingthefuture.github.io/vox/ — assets must resolve under /vox/.
export default defineConfig({
  base: '/vox/',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 2000, // phaser is one big chunk; that is expected
  },
});
