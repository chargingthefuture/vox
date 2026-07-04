import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Served from https://chargingthefuture.github.io/vox/ — assets must resolve under /vox/.
export default defineConfig({
  base: '/vox/',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 2000, // phaser is one big chunk; that is expected
  },
  plugins: [
    // Offline + always-fresh. A service worker precaches the whole game (one JS bundle plus a
    // handful of static files), so it plays with no network once loaded. `autoUpdate` fetches a
    // new deploy in the background and applies it on the next load — no manual cache clearing,
    // no stale versions. skipWaiting/clientsClaim let the new worker take over immediately.
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // registered explicitly in src/main.ts
      manifest: false, // we ship our own public/manifest.webmanifest
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: '/vox/index.html',
      },
    }),
  ],
});
