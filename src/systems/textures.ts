// Placeholder programmer art, generated at runtime from the active palette so calm mode
// restyles every sprite. Structured so hand-drawn art can replace these keys later without
// touching gameplay code.

import Phaser from 'phaser';
import { pal } from './palette';
import { settings } from './settings';

const KEYS = [
  'vox-player',
  'vox-crowder',
  'vox-blocker',
  'vox-starer',
  'vox-mimic',
  'vox-boss',
  'vox-wave',
  'vox-block',
  'vox-beacon',
  'vox-beacon-lit',
  'vox-particle',
] as const;

let generatedFor: 'normal' | 'calm' | null = null;

export function ensureTextures(scene: Phaser.Scene): void {
  const mode = settings.calmMode ? 'calm' : 'normal';
  if (generatedFor === mode && KEYS.every((k) => scene.textures.exists(k))) return;
  for (const k of KEYS) if (scene.textures.exists(k)) scene.textures.remove(k);
  const p = pal();
  const g = scene.add.graphics();

  const gen = (key: string, w: number, h: number, draw: () => void): void => {
    g.clear();
    draw();
    g.generateTexture(key, w, h);
  };

  // VOX — the hero. Teal, upright, visor bright.
  gen('vox-player', 32, 40, () => {
    g.fillStyle(p.player, 1);
    g.fillRoundedRect(4, 4, 24, 34, 7);
    g.fillStyle(p.playerAccent, 1);
    g.fillRect(8, 11, 18, 5); // visor — always looking forward
    g.fillRect(6, 32, 8, 4); // boot
    g.fillRect(18, 32, 8, 4);
  });

  // Crowder (#1) — shuffles into your space, phone out.
  gen('vox-crowder', 32, 36, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(4, 4, 22, 30, 6);
    g.fillStyle(p.enemyAccent, 1);
    g.fillCircle(11, 12, 2);
    g.fillCircle(19, 12, 2);
    g.fillStyle(p.playerAccent, 0.9);
    g.fillRect(24, 14, 6, 11); // the ever-present phone
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(25, 16, 4, 7);
  });

  // Blocker (#4) — a wall with a smug face. Exists to be in the way.
  gen('vox-blocker', 48, 48, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(1, 3, 46, 44, 5);
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(6, 26, 36, 6); // crossed arms
    g.fillCircle(17, 15, 2.5);
    g.fillCircle(31, 15, 2.5);
  });

  // Starer (#13) — a floating eyeball with an attitude.
  gen('vox-starer', 32, 32, () => {
    g.fillStyle(p.enemy, 1);
    g.fillCircle(16, 16, 14);
    g.fillStyle(p.playerAccent, 1);
    g.fillCircle(16, 15, 7);
    g.fillStyle(p.enemyAccent, 1);
    g.fillCircle(16, 15, 3.2);
  });

  // Mimic (#48) — dresses like you, moves like you, is not you.
  gen('vox-mimic', 32, 40, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(4, 4, 24, 34, 7);
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(8, 11, 18, 5); // a knock-off visor
    g.fillRect(6, 32, 8, 4);
    g.fillRect(18, 32, 8, 4);
  });

  // Specterwave — the boss. A big smug ghost that shrinks as you hit it.
  gen('vox-boss', 96, 112, () => {
    g.fillStyle(p.boss, 1);
    g.fillEllipse(48, 46, 86, 82);
    g.fillTriangle(8, 76, 26, 76, 17, 104);
    g.fillTriangle(30, 80, 48, 80, 39, 108);
    g.fillTriangle(52, 80, 70, 80, 61, 108);
    g.fillTriangle(72, 76, 90, 76, 81, 104);
    g.fillStyle(p.playerAccent, 1);
    g.fillCircle(34, 40, 8);
    g.fillCircle(62, 40, 8);
    g.fillStyle(p.bossAccent, 1);
    g.fillCircle(34, 41, 3.5);
    g.fillCircle(62, 41, 3.5);
    g.fillRect(36, 60, 24, 4); // flat unimpressed mouth
  });

  // The boss's crowd-wave pulse. Low and jumpable.
  gen('vox-wave', 44, 24, () => {
    g.fillStyle(p.boss, 0.9);
    g.fillRoundedRect(0, 4, 44, 20, 8);
    g.fillStyle(p.bossAccent, 0.9);
    g.fillRoundedRect(6, 10, 32, 12, 6);
  });

  gen('vox-block', 32, 32, () => {
    g.fillStyle(p.platform, 1);
    g.fillRect(0, 0, 32, 32);
    g.fillStyle(p.ground, 1);
    g.fillRect(0, 28, 32, 4);
    g.lineStyle(2, p.skyBottom, 0.35);
    g.strokeRect(1, 1, 30, 30);
  });

  // Beacon — VOX's checkpoint lamppost. Lighting one saves your spot.
  gen('vox-beacon', 20, 56, () => {
    g.fillStyle(p.checkpoint, 1);
    g.fillRect(8, 12, 4, 42);
    g.fillCircle(10, 9, 8);
  });
  gen('vox-beacon-lit', 20, 56, () => {
    g.fillStyle(p.checkpoint, 1);
    g.fillRect(8, 12, 4, 42);
    g.fillStyle(p.checkpointLit, 1);
    g.fillCircle(10, 9, 8);
  });

  gen('vox-particle', 6, 6, () => {
    g.fillStyle(0xffffff, 1);
    g.fillRect(0, 0, 6, 6);
  });

  g.destroy();
  generatedFor = mode;
}
