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
  'vox-spark',
  'vox-dust',
  'vox-hitring',
  'vox-slanderer',
  'vox-gatekeeper',
  'vox-recorder',
  'vox-accuser',
  'vox-clerk',
  'vox-boss2',
  'vox-bubble',
  'vox-bubble-truth',
  'vox-shadow',
  'vox-detector',
  'vox-loopgen',
  'vox-siren',
  'vox-boss3',
  'vox-holdwave',
  'vox-car',
  'vox-neighbor',
  'vox-antenna',
  'vox-window',
  'vox-flash',
  'vox-drone',
  'vox-lurker',
  'vox-prowler',
  'vox-hummer',
  'vox-door',
  'vox-bark',
  'vox-boss4',
  'vox-ringer',
  'vox-ringwave',
  'vox-doctor',
  'vox-drainer',
  'vox-beamer',
  'vox-striker',
  'vox-boss5',
  'vox-spinner',
  'vox-mailthief',
  'vox-spammer',
  'vox-runaround',
  'vox-clunker',
  'vox-vanisher',
  'vox-locker',
  'vox-call',
  'vox-boss6',
  'vox-pushy',
  'vox-knower',
  'vox-lodge',
  'vox-baiter',
  'vox-proposition',
  'vox-secret',
  'vox-fakefriend',
  'vox-fakefriend-real',
  'vox-family',
  'vox-lure',
  'vox-boss7',
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

  // A soft round spark for impact bursts (fades to nothing, additive-blended).
  gen('vox-spark', 12, 12, () => {
    g.fillStyle(0xffffff, 0.35);
    g.fillCircle(6, 6, 6);
    g.fillStyle(0xffffff, 0.7);
    g.fillCircle(6, 6, 3.5);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(6, 6, 1.6);
  });

  // A soft puff of dust for landings.
  gen('vox-dust', 14, 14, () => {
    g.fillStyle(0xffffff, 0.5);
    g.fillCircle(7, 7, 7);
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(7, 7, 3);
  });

  // A thin ring that expands on a solid hit.
  gen('vox-hitring', 40, 40, () => {
    g.lineStyle(3, 0xffffff, 0.9);
    g.strokeCircle(20, 20, 17);
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

  // --- World 3: Specterforce ---

  // Shadow (#9) — a cap-and-shades cop, all watchfulness.
  gen('vox-shadow', 32, 40, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(4, 8, 24, 30, 6);
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(4, 4, 24, 8); // cap
    g.fillRect(2, 10, 28, 3); // brim
    g.fillStyle(p.playerAccent, 0.9);
    g.fillRect(8, 15, 16, 5); // mirrored shades
    g.fillStyle(p.projectile, 1);
    g.fillCircle(16, 27, 2.5); // badge
  });

  // Detector (#39) — a store security archway.
  gen('vox-detector', 48, 64, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRect(4, 4, 8, 58); // left post
    g.fillRect(36, 4, 8, 58); // right post
    g.fillRect(4, 4, 40, 8); // top bar
    g.fillStyle(p.projectile, 0.85);
    g.fillCircle(24, 20, 4); // the little beeper light
  });

  // Loop generator (#41) — a spinning "on hold" ring.
  gen('vox-loopgen', 48, 48, () => {
    g.lineStyle(6, p.enemy, 1);
    g.strokeCircle(24, 24, 18);
    g.lineStyle(6, p.enemyAccent, 1);
    g.beginPath();
    g.arc(24, 24, 18, 0, Math.PI * 1.2);
    g.strokePath();
    g.fillStyle(p.projectile, 1);
    g.fillCircle(24, 24, 5); // the hold button, endlessly lit
  });

  // Siren (#47) — a light bar on wheels.
  gen('vox-siren', 32, 24, () => {
    g.fillStyle(p.enemyAccent, 1);
    g.fillRoundedRect(2, 10, 28, 10, 3); // body
    g.fillStyle(p.hurt, 1);
    g.fillRoundedRect(6, 4, 8, 6, 2); // red light
    g.fillStyle(p.player, 1);
    g.fillRoundedRect(18, 4, 8, 6, 2); // blue light
    g.fillStyle(p.uiCard, 1);
    g.fillCircle(9, 21, 3);
    g.fillCircle(23, 21, 3); // wheels
  });

  // Specterforce — the boss. A riot-shield ghost with a badge.
  gen('vox-boss3', 96, 112, () => {
    g.fillStyle(p.boss, 1);
    g.fillEllipse(48, 46, 86, 82);
    g.fillTriangle(8, 76, 26, 76, 17, 104);
    g.fillTriangle(30, 80, 48, 80, 39, 108);
    g.fillTriangle(52, 80, 70, 80, 61, 108);
    g.fillTriangle(72, 76, 90, 76, 81, 104);
    g.fillStyle(p.bossAccent, 1);
    g.fillRect(24, 6, 48, 10); // cap brim across the top
    g.fillStyle(p.playerAccent, 1);
    g.fillCircle(34, 40, 8);
    g.fillCircle(62, 40, 8);
    g.fillStyle(p.bossAccent, 1);
    g.fillCircle(34, 41, 3.5);
    g.fillCircle(62, 41, 3.5);
    g.fillStyle(p.projectile, 1);
    g.fillCircle(48, 62, 6); // a big shiny badge
    g.fillStyle(p.bossAccent, 1);
    g.fillRect(40, 74, 16, 4); // stern line of a mouth
  });

  // The compliance shockwave / hold-wave share the wave sprite already, but the hold-wave
  // reads as a "please hold" ripple, tinted with the dim UI color.
  gen('vox-holdwave', 44, 22, () => {
    g.fillStyle(p.checkpoint, 0.9);
    g.fillRoundedRect(0, 4, 44, 16, 8);
    g.fillStyle(p.projectile, 0.7);
    g.fillRoundedRect(6, 9, 32, 8, 4);
  });

  // --- World 4: Specterrealm ---

  // Parked car (#3) — a watcher's sedan.
  gen('vox-car', 52, 30, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(2, 12, 48, 14, 4); // body
    g.fillRoundedRect(12, 4, 28, 12, 4); // cabin
    g.fillStyle(p.playerAccent, 0.5);
    g.fillRect(16, 7, 20, 7); // windshield — someone inside
    g.fillStyle(p.enemyAccent, 1);
    g.fillCircle(14, 27, 4);
    g.fillCircle(38, 27, 4); // wheels
  });

  // Neighbor / new-neighbor / peeker (#5, #10) — a plain standing figure.
  gen('vox-neighbor', 28, 40, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(4, 10, 20, 28, 6);
    g.fillStyle(p.enemyAccent, 1);
    g.fillCircle(14, 8, 7); // head
    g.fillStyle(p.playerAccent, 0.8);
    g.fillRect(9, 6, 3, 2);
    g.fillRect(16, 6, 3, 2); // watching eyes
  });

  // Antenna (#6) — a fresh mast on a pole.
  gen('vox-antenna', 32, 56, () => {
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(14, 12, 4, 44); // pole
    g.lineStyle(2, p.enemy, 1);
    g.lineBetween(16, 14, 4, 4);
    g.lineBetween(16, 14, 28, 4);
    g.lineBetween(16, 20, 7, 12);
    g.lineBetween(16, 20, 25, 12);
    g.fillStyle(p.projectile, 1);
    g.fillCircle(16, 12, 3); // blinking tip (steady)
  });

  // Strange window-light (#12) — an odd-colored glow.
  gen('vox-window', 34, 34, () => {
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(2, 2, 30, 30); // frame
    g.fillStyle(p.projectile, 0.85);
    g.fillRect(6, 6, 22, 22); // the glow
    g.lineStyle(2, p.enemyAccent, 1);
    g.lineBetween(17, 6, 17, 28);
    g.lineBetween(6, 17, 28, 17); // panes
  });

  // Light-flash (#32) — a steady starburst (never a strobe).
  gen('vox-flash', 30, 30, () => {
    g.fillStyle(p.projectile, 0.9);
    g.fillCircle(15, 15, 6);
    g.lineStyle(3, p.projectile, 0.7);
    for (let a = 0; a < 8; a++) {
      const th = (a / 8) * Math.PI * 2;
      g.lineBetween(15 + Math.cos(th) * 8, 15 + Math.sin(th) * 8, 15 + Math.cos(th) * 14, 15 + Math.sin(th) * 14);
    }
  });

  // Drone (#7) — a quadcopter eye.
  gen('vox-drone', 32, 20, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(10, 6, 12, 8, 3); // hull
    g.fillStyle(p.playerAccent, 0.9);
    g.fillCircle(16, 10, 2.5); // lens
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(0, 4, 10, 2);
    g.fillRect(22, 4, 10, 2); // rotor arms
    g.fillCircle(3, 5, 3);
    g.fillCircle(29, 5, 3);
  });

  // Lurker (#46) — a coat-and-briefcase figure.
  gen('vox-lurker', 28, 40, () => {
    g.fillStyle(p.enemyAccent, 1);
    g.fillRoundedRect(5, 10, 18, 28, 5); // long coat
    g.fillStyle(p.enemy, 1);
    g.fillCircle(14, 8, 6);
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(20, 24, 7, 8); // briefcase
  });

  // Prowler (#36) — a shadowy crouched shape.
  gen('vox-prowler', 32, 36, () => {
    g.fillStyle(p.enemyAccent, 1);
    g.fillRoundedRect(4, 12, 24, 22, 8);
    g.fillCircle(20, 12, 7);
    g.fillStyle(p.hurt, 0.8);
    g.fillCircle(22, 11, 2); // one watching eye
  });

  // Hummer (#22) — a utility box that buzzes.
  gen('vox-hummer', 32, 44, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(2, 4, 28, 36, 3);
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(6, 10, 20, 4);
    g.fillRect(6, 18, 20, 4);
    g.fillRect(6, 26, 20, 4); // vents
    g.fillStyle(p.projectile, 1);
    g.fillCircle(24, 35, 2.5); // status light
  });

  // Revolving door (#11) — a doorway with a turnstile cross.
  gen('vox-door', 40, 56, () => {
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(2, 2, 36, 54);
    g.fillStyle(p.enemy, 1);
    g.fillRect(6, 8, 28, 46); // opening
    g.lineStyle(4, p.enemyAccent, 1);
    g.lineBetween(20, 8, 20, 54);
    g.lineBetween(8, 31, 32, 31); // revolving cross
  });

  // Bark-speaker (#50) — a loud-hailer on a post.
  gen('vox-bark', 32, 28, () => {
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(14, 14, 4, 14); // post
    g.fillStyle(p.enemy, 1);
    g.fillTriangle(6, 4, 6, 20, 22, 12); // horn
    g.fillStyle(p.projectile, 0.8);
    g.fillCircle(24, 12, 2);
    g.fillCircle(28, 12, 1.5); // sound blips
  });

  // Specterrealm — the boss. A watchtower eye over a fanned-out block.
  gen('vox-boss4', 96, 112, () => {
    g.fillStyle(p.boss, 1);
    g.fillEllipse(48, 46, 86, 82);
    g.fillTriangle(8, 76, 26, 76, 17, 104);
    g.fillTriangle(30, 80, 48, 80, 39, 108);
    g.fillTriangle(52, 80, 70, 80, 61, 108);
    g.fillTriangle(72, 76, 90, 76, 81, 104);
    // One enormous surveillance eye
    g.fillStyle(p.playerAccent, 1);
    g.fillEllipse(48, 44, 56, 40);
    g.fillStyle(p.bossAccent, 1);
    g.fillCircle(48, 44, 14);
    g.fillStyle(p.hurt, 0.9);
    g.fillCircle(48, 44, 6); // a red pupil, always watching
    g.fillStyle(p.bossAccent, 1);
    g.fillRect(40, 70, 16, 4);
  });

  // --- World 5: Specterbane ---

  // Ringer (#8) — a tuning-fork-ish emitter.
  gen('vox-ringer', 32, 40, () => {
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(14, 20, 4, 20); // stem
    g.lineStyle(4, p.enemy, 1);
    g.lineBetween(16, 22, 8, 4);
    g.lineBetween(16, 22, 24, 4); // fork tines
    g.fillStyle(p.projectile, 1);
    g.fillCircle(16, 22, 3);
  });

  // Ring-wave (#8 projectile) — a hollow ring rolling out.
  gen('vox-ringwave', 34, 34, () => {
    g.lineStyle(5, p.projectile, 0.85);
    g.strokeCircle(17, 17, 13);
  });

  // False doctor (#21) — a coat with a clipboard, half-there.
  gen('vox-doctor', 30, 40, () => {
    g.fillStyle(p.playerAccent, 0.85);
    g.fillRoundedRect(4, 10, 22, 28, 5); // white coat
    g.fillStyle(p.enemyAccent, 1);
    g.fillCircle(15, 8, 6);
    g.fillStyle(p.enemy, 1);
    g.fillRect(18, 20, 8, 10); // clipboard
    g.fillStyle(p.hurt, 0.8);
    g.fillRect(12, 22, 6, 2); // a stethoscope hint
  });

  // Drainer (#24) — a heavy, sagging weight.
  gen('vox-drainer', 32, 32, () => {
    g.fillStyle(p.enemy, 1);
    g.fillCircle(16, 16, 13);
    g.fillStyle(p.enemyAccent, 1);
    g.fillEllipse(16, 22, 18, 8); // sagging drip
    g.fillStyle(p.bossAccent, 0.9);
    g.fillCircle(11, 13, 2);
    g.fillCircle(21, 13, 2); // tired eyes
  });

  // Beamer (#28) — a spotlight head.
  gen('vox-beamer', 32, 26, () => {
    g.fillStyle(p.enemyAccent, 1);
    g.fillRoundedRect(4, 6, 18, 14, 4); // housing
    g.fillStyle(p.projectile, 0.95);
    g.fillCircle(22, 13, 7); // the lamp
    g.fillStyle(p.playerAccent, 0.9);
    g.fillCircle(22, 13, 3);
  });

  // Striker (#45) — a coiled fist.
  gen('vox-striker', 32, 36, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(6, 8, 20, 24, 8);
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(20, 14, 10, 8); // knuckles jabbing out
    g.fillStyle(p.bossAccent, 1);
    g.fillCircle(13, 16, 2);
    g.fillCircle(19, 16, 2);
  });

  // Specterbane — the boss. A skull-ish ghost wreathed in beams.
  gen('vox-boss5', 96, 112, () => {
    g.fillStyle(p.boss, 1);
    g.fillEllipse(48, 46, 86, 82);
    g.fillTriangle(8, 76, 26, 76, 17, 104);
    g.fillTriangle(30, 80, 48, 80, 39, 108);
    g.fillTriangle(52, 80, 70, 80, 61, 108);
    g.fillTriangle(72, 76, 90, 76, 81, 104);
    g.fillStyle(p.bossAccent, 1);
    g.fillCircle(34, 42, 11);
    g.fillCircle(62, 42, 11); // hollow sockets
    g.fillStyle(p.projectile, 0.9);
    g.fillCircle(34, 42, 4);
    g.fillCircle(62, 42, 4); // burning points
    g.fillStyle(p.bossAccent, 1);
    for (let i = 0; i < 5; i++) g.fillRect(34 + i * 7, 66, 3, 10); // gritted teeth
  });

  // --- World 6: Specterrise ---

  // Spinner (#20) — a buffering ring on a form.
  gen('vox-spinner', 40, 44, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(2, 4, 36, 36, 4); // the form/page
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(8, 10, 24, 3);
    g.fillRect(8, 30, 24, 3); // form lines
    g.lineStyle(4, p.projectile, 0.9);
    g.beginPath();
    g.arc(20, 22, 8, 0, Math.PI * 1.4);
    g.strokePath(); // the eternal spinner
  });

  // MailThief (#23) — a hooded figure clutching an envelope.
  gen('vox-mailthief', 30, 38, () => {
    g.fillStyle(p.enemyAccent, 1);
    g.fillRoundedRect(4, 8, 20, 28, 6);
    g.fillStyle(p.enemy, 1);
    g.fillCircle(14, 8, 6);
    g.fillStyle(p.playerAccent, 0.95);
    g.fillRect(18, 20, 10, 7); // your envelope
    g.lineStyle(1, p.enemyAccent, 1);
    g.lineBetween(18, 20, 23, 24);
    g.lineBetween(28, 20, 23, 24);
  });

  // Spammer (#35) — a ringing phone.
  gen('vox-spammer', 30, 38, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(6, 4, 18, 30, 4);
    g.fillStyle(p.playerAccent, 0.9);
    g.fillRect(9, 9, 12, 18); // screen
    g.fillStyle(p.hurt, 0.9);
    g.fillCircle(15, 30, 2);
    g.fillStyle(p.projectile, 1);
    g.fillCircle(24, 6, 2);
    g.fillCircle(27, 4, 1.5); // ring waves
  });

  // RunAround (#40) — a darting will-o'-the-wisp with an arrow.
  gen('vox-runaround', 30, 30, () => {
    g.fillStyle(p.enemy, 1);
    g.fillCircle(15, 15, 11);
    g.fillStyle(p.projectile, 0.95);
    g.fillTriangle(9, 15, 18, 9, 18, 21); // a misleading arrow
    g.fillRect(16, 13, 6, 4);
  });

  // Clunker (#42) — a sputtering junk car.
  gen('vox-clunker', 52, 30, () => {
    g.fillStyle(p.enemyAccent, 1);
    g.fillRoundedRect(2, 12, 48, 14, 4);
    g.fillRoundedRect(12, 4, 26, 12, 4);
    g.fillStyle(p.enemy, 1);
    g.fillRect(16, 7, 18, 7);
    g.fillStyle(p.enemyAccent, 1);
    g.fillCircle(14, 27, 4);
    g.fillCircle(38, 27, 4);
    g.fillStyle(p.hurt, 0.8);
    g.fillCircle(2, 10, 3); // a puff of backfire smoke
  });

  // Vanisher (#43) — a box flickering out of existence.
  gen('vox-vanisher', 30, 30, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRect(4, 8, 22, 18); // a parcel
    g.lineStyle(2, p.enemyAccent, 1);
    g.lineBetween(4, 14, 26, 14);
    g.lineBetween(15, 8, 15, 26);
    g.fillStyle(p.projectile, 0.6);
    g.fillCircle(24, 8, 3); // a fading sparkle
  });

  // Locker (#51) — a padlock on your account.
  gen('vox-locker', 40, 44, () => {
    g.lineStyle(6, p.enemyAccent, 1);
    g.beginPath();
    g.arc(20, 16, 10, Math.PI, 0);
    g.strokePath(); // shackle
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(6, 16, 28, 24, 4); // body
    g.fillStyle(p.projectile, 1);
    g.fillCircle(20, 26, 3);
    g.fillRect(19, 26, 2, 8); // keyhole
  });

  // Spam-call projectile (#35).
  gen('vox-call', 20, 20, () => {
    g.fillStyle(p.hurt, 0.9);
    g.fillCircle(10, 10, 8);
    g.fillStyle(p.playerAccent, 0.95);
    // a little handset glyph
    g.fillRoundedRect(6, 6, 8, 8, 2);
    g.fillStyle(p.hurt, 0.9);
    g.fillRect(8, 8, 4, 4);
  });

  // Specterrise — the boss. A server-stack ghost bristling with antennae.
  gen('vox-boss6', 96, 112, () => {
    g.fillStyle(p.boss, 1);
    g.fillEllipse(48, 46, 86, 82);
    g.fillTriangle(8, 76, 26, 76, 17, 104);
    g.fillTriangle(30, 80, 48, 80, 39, 108);
    g.fillTriangle(52, 80, 70, 80, 61, 108);
    g.fillTriangle(72, 76, 90, 76, 81, 104);
    g.fillStyle(p.bossAccent, 1);
    g.fillRect(20, 30, 56, 6);
    g.fillRect(20, 44, 56, 6);
    g.fillRect(20, 58, 56, 6); // server slots
    g.fillStyle(p.projectile, 1);
    g.fillCircle(28, 33, 2);
    g.fillCircle(28, 47, 2);
    g.fillCircle(28, 61, 2); // blinking lights
    g.fillStyle(p.playerAccent, 1);
    g.fillCircle(60, 33, 2);
    g.fillCircle(68, 47, 2);
  });

  // --- World 7: The Recruiters ---

  // Pushy newcomer (#14) — arms out for a smothering hug.
  gen('vox-pushy', 32, 40, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(6, 10, 20, 28, 6);
    g.fillStyle(p.enemyAccent, 1);
    g.fillCircle(16, 8, 6);
    g.fillRect(0, 16, 8, 4);
    g.fillRect(24, 16, 8, 4); // outstretched arms
  });

  // Knower (#15) — a wide staring eye with a knowing brow.
  gen('vox-knower', 32, 28, () => {
    g.fillStyle(p.enemy, 1);
    g.fillEllipse(16, 15, 28, 20);
    g.fillStyle(p.playerAccent, 1);
    g.fillCircle(16, 15, 7);
    g.fillStyle(p.bossAccent, 1);
    g.fillCircle(16, 15, 3);
    g.lineStyle(2, p.enemyAccent, 1);
    g.lineBetween(4, 5, 14, 9); // a raised brow
  });

  // Lodge (#19) — a members hall with an all-seeing symbol.
  gen('vox-lodge', 52, 48, () => {
    g.fillStyle(p.enemyAccent, 1);
    g.fillRect(4, 16, 44, 30); // hall
    g.fillTriangle(2, 16, 50, 16, 26, 2); // pediment
    g.fillStyle(p.projectile, 0.9);
    g.fillTriangle(26, 22, 20, 34, 32, 34); // eye triangle
    g.fillStyle(p.bossAccent, 1);
    g.fillCircle(26, 30, 2);
  });

  // Baiter (#25) — holds out a shiny lure on a stick.
  gen('vox-baiter', 32, 40, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(4, 10, 18, 28, 6);
    g.fillStyle(p.enemyAccent, 1);
    g.fillCircle(13, 8, 6);
    g.lineStyle(2, p.enemyAccent, 1);
    g.lineBetween(20, 16, 30, 10); // fishing rod
    g.fillStyle(p.projectile, 1);
    g.fillCircle(30, 9, 3); // the lure
  });

  // Proposition (#26) — a leaning, leering figure (abstract).
  gen('vox-proposition', 32, 40, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(6, 8, 20, 30, 7);
    g.fillStyle(p.enemyAccent, 1);
    g.fillCircle(16, 8, 6);
    g.fillStyle(p.hurt, 0.8);
    g.fillRect(11, 18, 10, 3); // a leering grin
  });

  // Secret-keeper (#33) — a cloaked figure with a finger to its lips.
  gen('vox-secret', 32, 40, () => {
    g.fillStyle(p.enemyAccent, 1);
    g.fillRoundedRect(5, 8, 22, 30, 8); // cloak
    g.fillStyle(p.enemy, 1);
    g.fillCircle(16, 9, 6);
    g.fillStyle(p.playerAccent, 0.9);
    g.fillRect(15, 10, 2, 8); // shhh finger
  });

  // Fake friend (#37) — wears VOX's own colors to seem safe.
  gen('vox-fakefriend', 32, 40, () => {
    g.fillStyle(p.player, 1); // friendly teal, just like you
    g.fillRoundedRect(4, 4, 24, 34, 7);
    g.fillStyle(p.playerAccent, 1);
    g.fillRect(8, 11, 18, 5);
    g.fillStyle(p.projectile, 1);
    g.fillCircle(16, 26, 3); // a too-wide smile pin
  });

  // Fake friend, revealed (#37) — the mask drops to the enemy palette.
  gen('vox-fakefriend-real', 32, 40, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(4, 4, 24, 34, 7);
    g.fillStyle(p.hurt, 1);
    g.fillRect(8, 11, 18, 5); // a hostile glare
    g.fillStyle(p.enemyAccent, 1);
    g.fillTriangle(10, 30, 16, 24, 22, 30); // a sharp grin
  });

  // Forced family (#49) — a bulky figure barging in.
  gen('vox-family', 34, 40, () => {
    g.fillStyle(p.enemy, 1);
    g.fillRoundedRect(3, 8, 28, 30, 6);
    g.fillStyle(p.enemyAccent, 1);
    g.fillCircle(17, 8, 7);
    g.fillRect(3, 20, 28, 4); // arms crossed, pushing in
  });

  // Lure (#25 hazard) — a shiny trap on the ground.
  gen('vox-lure', 22, 18, () => {
    g.fillStyle(p.projectile, 0.95);
    g.fillCircle(11, 11, 7);
    g.fillStyle(p.hurt, 0.9);
    g.fillCircle(11, 11, 3); // the hook inside the shine
    g.fillStyle(p.playerAccent, 0.9);
    g.fillCircle(8, 8, 1.5);
  });

  // The Recruiters — the final boss. A many-masked ghost, faces all around.
  gen('vox-boss7', 100, 112, () => {
    g.fillStyle(p.boss, 1);
    g.fillEllipse(50, 46, 92, 82);
    g.fillTriangle(10, 76, 28, 76, 19, 104);
    g.fillTriangle(34, 80, 52, 80, 43, 108);
    g.fillTriangle(56, 80, 74, 80, 65, 108);
    g.fillTriangle(76, 76, 94, 76, 85, 104);
    // A ring of little masks — all the fake faces it wears
    g.fillStyle(p.playerAccent, 1);
    const faces: [number, number][] = [[32, 34], [68, 34], [24, 54], [76, 54], [50, 30]];
    for (const [fx, fy] of faces) g.fillCircle(fx, fy, 7);
    g.fillStyle(p.bossAccent, 1);
    for (const [fx, fy] of faces) g.fillCircle(fx, fy, 3);
    g.fillStyle(p.projectile, 1);
    g.fillCircle(50, 62, 5); // a recruiter's pin
  });

  g.destroy();
  generatedFor = mode;
}
