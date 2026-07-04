import Phaser from 'phaser';
import { registerSW } from 'virtual:pwa-register';
import { enterFullscreen } from './systems/fullscreen';

// Precache the game for offline play and keep it current: `autoUpdate` reloads the page
// once a newly deployed worker activates, so players always get the latest without ever
// clearing a cache — and can still play with no network after the first visit.
registerSW({ immediate: true });
import * as savecode from './systems/savecode';
import { TitleScene } from './scenes/TitleScene';
import { UIScene } from './scenes/UIScene';
import { World1Scene } from './scenes/world/World1Scene';
import { World2Scene } from './scenes/world/World2Scene';
import { World3Scene } from './scenes/world/World3Scene';
import { World4Scene } from './scenes/world/World4Scene';
import { World5Scene } from './scenes/world/World5Scene';
import { World6Scene } from './scenes/world/World6Scene';
import { World7Scene } from './scenes/world/World7Scene';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  backgroundColor: '#0d0d17',
  pixelArt: false,
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 1500 }, debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    TitleScene,
    World1Scene,
    World2Scene,
    World3Scene,
    World4Scene,
    World5Scene,
    World6Scene,
    World7Scene,
    UIScene,
  ],
});

// Open in fullscreen landscape on the first user gesture — browsers require a gesture, and
// it is what mobile players expect. Desktop keeps its window (the title has a toggle button).
game.events.once(Phaser.Core.Events.READY, () => {
  if (game.device.os.desktop) return;
  const goFullscreen = (): void => enterFullscreen(game.scale);
  window.addEventListener('pointerdown', goFullscreen, { once: true });
  window.addEventListener('keydown', goFullscreen, { once: true });
});

// Test-only handle for the save code helpers (used by the automated browser checks).
if (new URLSearchParams(location.search).has('debug')) {
  (window as unknown as { __voxSave: typeof savecode }).__voxSave = savecode;
  (window as unknown as { __voxGame: Phaser.Game }).__voxGame = game;
}
