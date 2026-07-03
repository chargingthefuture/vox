import Phaser from 'phaser';
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

new Phaser.Game({
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

// Test-only handle for the save code helpers (used by the automated browser checks).
if (new URLSearchParams(location.search).has('debug')) {
  (window as unknown as { __voxSave: typeof savecode }).__voxSave = savecode;
}
