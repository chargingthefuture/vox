import Phaser from 'phaser';
import { TitleScene } from './scenes/TitleScene';
import { UIScene } from './scenes/UIScene';
import { World1Scene } from './scenes/world/World1Scene';
import { World2Scene } from './scenes/world/World2Scene';

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
  scene: [TitleScene, World1Scene, World2Scene, UIScene],
});
