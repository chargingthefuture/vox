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
  'vox-slanderer',
  'vox-gatekeeper',
  'vox-recorder',
  'vox-accuser',
  'vox-clerk',
  'vox-boss2',
  'vox-bubble',
  'vox-bubble-truth',
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

  // --- World 2: Spectervox ---

  // Slanderer (#2) — all mouth.
  gen('vox-slanderer', 32, 36, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(3, 4, 26, 30, 6);
    g.fillStyle(p.enemyAccent, 1);
    g.fillCircle(11, 13, 2);
    g.fillCircle(21, 13, 2);
    g.fillStyle(p.playerAccent, 1);
    g.fillEllipse(16, 24, 14, 9); // the ever-running mouth
    g.fillStyle(p.enemyAccent, 1);
    g.fillEllipse(16, 25, 9, 5);
  });

  // Gatekeeper (#18) — a stamping gate with a smug little window.
  gen('vox-gatekeeper', 48, 52, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(2, 8, 44, 42, 4);
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(6, 2, 36, 10); // the stamp arm resting on top
    g.fillStyle(p.playerAccent, 0.9);
    g.fillRect(12, 20, 24, 10); // service window
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(14, 23, 20, 4); // firmly closed
  });

  // Recorder (#30) — a hovering mic that thinks it is subtle.
  gen('vox-recorder', 32, 28, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(4, 8, 24, 14, 6);
    g.fillStyle(p.enemyAccent, 1);
    g.fillCircle(10, 15, 4); // lens
    g.fillStyle(p.playerAccent, 0.9);
    g.fillCircle(10, 15, 1.8);
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(14, 3, 3, 6); // antenna
    g.fillRect(20, 24, 8, 2); // little tail fin
  });

  // Accuser (#31) — mostly pointing finger.
  gen('vox-accuser', 32, 38, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(2, 5, 22, 30, 6);
    g.fillStyle(p.enemyAccent, 1);
    g.fillCircle(9, 13, 2);
    g.fillCircle(17, 13, 2);
    g.fillStyle(p.playerAccent, 0.95);
    g.fillRect(20, 18, 11, 4); // the finger, always out
  });

  // Clerk (#38) — a check-in desk with a bell.
  gen('vox-clerk', 36, 32, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(2, 12, 32, 18, 3);
    g.fillStyle(p.playerAccent, 0.9);
    g.fillRect(6, 16, 24, 5); // the ledger
    g.fillStyle(p.projectile, 1);
    g.fillCircle(27, 9, 4); // the bell
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(26, 4, 2, 3);
  });

  // Spectervox — the boss. A ghost that is mostly megaphone.
  gen('vox-boss2', 96, 112, () => {
    g.fillStyle(p.boss, 1);
    g.fillEllipse(48, 46, 86, 82);
    g.fillTriangle(8, 76, 26, 76, 17, 104);
    g.fillTriangle(30, 80, 48, 80, 39, 108);
    g.fillTriangle(52, 80, 70, 80, 61, 108);
    g.fillTriangle(72, 76, 90, 76, 81, 104);
    g.fillStyle(p.playerAccent, 1);
    g.fillCircle(32, 34, 6);
    g.fillCircle(58, 34, 6);
    g.fillStyle(p.bossAccent, 1);
    g.fillCircle(32, 35, 2.8);
    g.fillCircle(58, 35, 2.8);
    // The megaphone mouth — enormous, of course
    g.fillStyle(p.playerAccent, 1);
    g.fillEllipse(48, 64, 40, 26);
    g.fillStyle(p.bossAccent, 1);
    g.fillEllipse(48, 65, 30, 18);
  });

  // A lie in transit: a speech bubble with a scribble inside.
  gen('vox-bubble', 30, 26, () => {
    g.fillStyle(p.playerAccent, 0.95);
    g.fillRoundedRect(1, 1, 28, 18, 7);
    g.fillTriangle(6, 17, 14, 17, 7, 24); // tail
    g.lineStyle(2, p.hurt, 0.9);
    g.lineBetween(8, 7, 14, 13);
    g.lineBetween(14, 7, 8, 13); // the X of a falsehood
    g.lineBetween(17, 10, 23, 10);
  });

  // The same bubble, deflected into a truth.
  gen('vox-bubble-truth', 30, 26, () => {
    g.fillStyle(p.checkpointLit, 0.95);
    g.fillRoundedRect(1, 1, 28, 18, 7);
    g.fillTriangle(16, 17, 24, 17, 23, 24); // tail flipped — it is going back
    g.lineStyle(2.5, p.uiCard, 0.9);
    g.lineBetween(8, 10, 12, 14);
    g.lineBetween(12, 14, 21, 6); // a check mark
  });

  g.destroy();
  generatedFor = mode;
}
