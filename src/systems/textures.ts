// Placeholder programmer art, generated at runtime from the active palette so calm mode
// restyles every sprite. Structured so hand-drawn art can replace these keys later without
// touching gameplay code.

import Phaser from 'phaser';
import { pal } from './palette';
import { settings } from './settings';

const KEYS = [
  'vox-player', // idle frame 0 (also the default static key)
  'vox-player-idle1',
  'vox-player-run0',
  'vox-player-run1',
  'vox-player-run2',
  'vox-player-run3',
  'vox-player-jump',
  'vox-player-fall',
  'vox-player-atk1',
  'vox-player-atk2',
  'vox-player-atk3',
  'vox-player-hurt',
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

  // --- hand-inked cartoon helpers ------------------------------------------------
  // Everything is drawn as bold flat shapes with a confident dark outline, so the
  // silhouettes read on their own (colorblind-safe) and survive the calm recolor.
  const INK = 1.6; // base line weight; ~1.5x on screen at the game's zoom

  const fillRR = (x: number, y: number, w: number, h: number, r: number, color: number, a = 1) => {
    g.fillStyle(color, a);
    g.fillRoundedRect(x, y, w, h, r);
  };
  const inkRR = (x: number, y: number, w: number, h: number, r: number, lw = INK) => {
    g.lineStyle(lw, p.ink, 1);
    g.strokeRoundedRect(x, y, w, h, r);
  };
  // A filled+inked rounded rect in one call.
  const rr = (x: number, y: number, w: number, h: number, r: number, color: number, lw = INK) => {
    fillRR(x, y, w, h, r, color);
    inkRR(x, y, w, h, r, lw);
  };
  const fillC = (x: number, y: number, r: number, color: number, a = 1) => {
    g.fillStyle(color, a);
    g.fillCircle(x, y, r);
  };
  const circ = (x: number, y: number, r: number, color: number, lw = INK) => {
    fillC(x, y, r, color);
    g.lineStyle(lw, p.ink, 1);
    g.strokeCircle(x, y, r);
  };

  // VOX — the hero. A cool, unbothered survivor: teal body, a bright forward visor
  // (the reclaimed "voice"), and a small energy chevron on the chest. Drawn facing
  // right; the scene flips X for facing. All frames share this 32x40 footprint so the
  // physics body offset stays valid and animations swap cleanly.
  const drawVox = (o: {
    bob?: number; // vertical breathing offset
    lean?: number; // forward lean in px (attacks/jump)
    legs: 'stand' | 'stepA' | 'pass' | 'stepB' | 'tuck' | 'reach' | 'back';
    backArm: 'side' | 'fwd' | 'swingA' | 'swingB' | 'up' | 'guard' | 'jab' | 'chop' | 'wind';
    frontArm: 'side' | 'fwd' | 'swingA' | 'swingB' | 'up' | 'guard' | 'jab' | 'chop' | 'wind';
    slash?: 1 | 2 | 3; // energy swoosh in front
    hurt?: boolean;
  }) => {
    const bob = o.bob ?? 0;
    const lean = o.lean ?? 0;
    const cx = 16 + lean; // torso center x, nudged by lean

    // Legs (drawn first, behind torso)
    const legTop = 27 + bob;
    const drawLeg = (x: number, footDx: number, len: number) => {
      rr(x, legTop, 5, len, 2, p.player);
      // a dark boot reads as a foot and grounds the silhouette
      g.fillStyle(p.ink, 1);
      g.fillRoundedRect(x + footDx, legTop + len - 3, 7, 4, 2);
    };
    switch (o.legs) {
      case 'stand':
        drawLeg(cx - 6, -1, 11);
        drawLeg(cx + 2, 0, 11);
        break;
      case 'stepA': // running contact: front leg reaching forward
        drawLeg(cx + 4, 1, 9);
        drawLeg(cx - 8, -2, 9);
        break;
      case 'pass': // legs gathered under the body
        drawLeg(cx - 3, -1, 8);
        drawLeg(cx + 1, 1, 12);
        break;
      case 'stepB':
        drawLeg(cx + 6, 1, 9);
        drawLeg(cx - 6, -2, 10);
        break;
      case 'tuck': // jumping up: knees pulled up
        drawLeg(cx - 5, -1, 6);
        drawLeg(cx + 2, 1, 7);
        break;
      case 'reach': // falling: legs reaching for ground
        drawLeg(cx - 6, -1, 12);
        drawLeg(cx + 3, 1, 10);
        break;
      case 'back': // hurt recoil: weight shifted back
        drawLeg(cx - 7, -2, 10);
        drawLeg(cx + 3, 2, 9);
        break;
    }

    // Torso
    rr(cx - 9, 15 + bob, 18, 14, 6, p.player);
    // Chest chevron — the reclaimed voice, always bright
    g.lineStyle(2, p.projectile, 1);
    g.beginPath();
    g.moveTo(cx - 4, 25 + bob);
    g.lineTo(cx, 21 + bob);
    g.lineTo(cx + 4, 25 + bob);
    g.strokePath();

    // Head + visor
    rr(cx - 7, 3 + bob, 14, 13, 6, p.player);
    fillRR(cx - 5, 7 + bob, 12, 4, 2, p.playerAccent); // bright forward visor
    g.lineStyle(1.2, p.ink, 1);
    g.strokeRoundedRect(cx - 5, 7 + bob, 12, 4, 2);
    if (o.hurt) {
      // a small stunned spark by the head — still unbothered, just knocked back
      g.lineStyle(2, p.projectile, 1);
      g.strokeCircle(cx + 11, 5 + bob, 3);
    }

    // Arms (hands are dark "gloves")
    const shoulderY = 17 + bob;
    const drawArm = (pose: string, front: boolean) => {
      const baseX = front ? cx + 6 : cx - 6;
      switch (pose) {
        case 'side':
          rr(baseX - 2, shoulderY, 4, 11, 2, p.player);
          fillC(baseX, shoulderY + 11, 2.4, p.ink);
          break;
        case 'fwd':
        case 'swingA':
          rr(baseX - 1, shoulderY, 4, 9, 2, p.player);
          fillC(baseX + 3, shoulderY + 8, 2.4, p.ink);
          break;
        case 'swingB':
          rr(baseX - 4, shoulderY - 1, 4, 9, 2, p.player);
          fillC(baseX - 3, shoulderY + 7, 2.4, p.ink);
          break;
        case 'up':
          rr(baseX - 1, shoulderY - 8, 4, 11, 2, p.player);
          fillC(baseX + 1, shoulderY - 8, 2.4, p.ink);
          break;
        case 'guard':
          rr(baseX - 2, shoulderY - 2, 5, 7, 2, p.player);
          fillC(baseX + 1, shoulderY - 2, 2.6, p.ink);
          break;
        case 'jab': // straight forward punch
          rr(cx + 6, shoulderY + 1, 11, 4, 2, p.player);
          fillC(cx + 17, shoulderY + 3, 3, p.ink);
          break;
        case 'chop': // arm high, coming down
          rr(cx + 5, shoulderY - 7, 4, 10, 2, p.player);
          fillC(cx + 7, shoulderY - 7, 3, p.ink);
          break;
        case 'wind': // finisher wind-up/extend, big reach
          rr(cx + 5, shoulderY, 13, 5, 2, p.player);
          fillC(cx + 18, shoulderY + 2, 3.2, p.ink);
          break;
      }
    };
    drawArm(o.backArm, false);
    drawArm(o.frontArm, true);

    // Energy swoosh in front for attacks — a bright crescent, bigger on the finisher
    if (o.slash) {
      const sy = 18 + bob;
      g.lineStyle(o.slash === 3 ? 4 : 2.5, p.projectile, o.slash === 3 ? 1 : 0.9);
      g.beginPath();
      if (o.slash === 1) g.arc(cx + 12, sy, 9, -0.9, 0.7, false);
      else if (o.slash === 2) g.arc(cx + 12, sy + 2, 10, -0.5, 1.1, false);
      else g.arc(cx + 11, sy, 15, -1.1, 1.1, false);
      g.strokePath();
    }
  };

  gen('vox-player', 32, 40, () => drawVox({ legs: 'stand', backArm: 'side', frontArm: 'side' }));
  gen('vox-player-idle1', 32, 40, () =>
    drawVox({ bob: 1, legs: 'stand', backArm: 'side', frontArm: 'side' }),
  );
  gen('vox-player-run0', 32, 40, () => drawVox({ legs: 'stepA', backArm: 'swingB', frontArm: 'fwd' }));
  gen('vox-player-run1', 32, 40, () =>
    drawVox({ bob: -1, legs: 'pass', backArm: 'side', frontArm: 'fwd' }),
  );
  gen('vox-player-run2', 32, 40, () => drawVox({ legs: 'stepB', backArm: 'fwd', frontArm: 'swingB' }));
  gen('vox-player-run3', 32, 40, () =>
    drawVox({ bob: -1, legs: 'pass', backArm: 'fwd', frontArm: 'side' }),
  );
  gen('vox-player-jump', 32, 40, () =>
    drawVox({ bob: -1, legs: 'tuck', backArm: 'up', frontArm: 'up' }),
  );
  gen('vox-player-fall', 32, 40, () =>
    drawVox({ bob: 1, legs: 'reach', backArm: 'side', frontArm: 'up' }),
  );
  gen('vox-player-atk1', 32, 40, () =>
    drawVox({ lean: 1, legs: 'stepB', backArm: 'guard', frontArm: 'jab', slash: 1 }),
  );
  gen('vox-player-atk2', 32, 40, () =>
    drawVox({ lean: 1, legs: 'stepA', backArm: 'side', frontArm: 'chop', slash: 2 }),
  );
  gen('vox-player-atk3', 32, 40, () =>
    drawVox({ lean: 2, legs: 'stepB', backArm: 'swingB', frontArm: 'wind', slash: 3 }),
  );
  gen('vox-player-hurt', 32, 40, () =>
    drawVox({ lean: -2, legs: 'back', backArm: 'guard', frontArm: 'guard', hurt: true }),
  );

  // Crowder (#1) — a hunched figure fused to a glowing phone, oblivious and pathetic.
  gen('vox-crowder', 32, 36, () => {
    // little shuffling legs
    g.fillStyle(p.ink, 1);
    g.fillRoundedRect(9, 31, 5, 4, 1);
    g.fillRoundedRect(17, 31, 5, 4, 1);
    rr(6, 6, 20, 26, 7, p.enemy); // hunched body
    rr(9, 2, 14, 12, 6, p.enemy); // head, tilted down over the phone
    // downcast eyes (staring at the screen)
    fillC(13, 10, 1.6, p.ink);
    fillC(19, 10, 1.6, p.ink);
    // the ever-present phone, held up, screen glowing
    rr(20, 14, 8, 12, 2, p.enemyAccent);
    fillRR(21, 15, 6, 8, 1, p.playerAccent, 0.95);
    // the arm cradling it
    rr(14, 18, 8, 4, 2, p.enemy);
  });

  // Blocker (#4) — a smug bouncer-wall. Harmless, just endlessly In The Way.
  gen('vox-blocker', 48, 48, () => {
    // stubby feet
    g.fillStyle(p.ink, 1);
    g.fillRoundedRect(12, 44, 8, 4, 1);
    g.fillRoundedRect(28, 44, 8, 4, 1);
    rr(3, 4, 42, 41, 7, p.enemy); // the wall of a torso
    // shades: one long smug bar with two lenses
    fillRR(9, 14, 30, 7, 3, p.enemyAccent);
    inkRR(9, 14, 30, 7, 3);
    fillC(17, 17, 2, p.ink);
    fillC(31, 17, 2, p.ink);
    // flat, unbothered mouth
    g.lineStyle(2, p.ink, 1);
    g.lineBetween(18, 27, 30, 27);
    // crossed arms bar — the "you shall not pass"
    rr(6, 31, 36, 8, 3, p.enemyAccent);
  });

  // Starer (#13) — a floating eyeball with an attitude, framed by an angry brow.
  gen('vox-starer', 32, 32, () => {
    circ(16, 17, 13, p.playerAccent); // the white of the eye
    fillC(16, 17, 6.5, p.enemy); // iris
    fillC(16, 17, 3, p.ink); // pupil
    fillC(13.5, 15, 1.6, p.playerAccent); // catchlight
    // heavy angry eyebrow across the top — pure silhouette attitude
    g.fillStyle(p.enemyAccent, 1);
    g.fillTriangle(3, 8, 29, 3, 29, 9);
    g.lineStyle(INK, p.ink, 1);
    g.strokeTriangle(3, 8, 29, 3, 29, 9);
  });

  // Mimic (#48) — copies VOX's silhouette in enemy colors, with a cracked knock-off
  // visor and a lopsided emblem so it always reads as "not you."
  gen('vox-mimic', 32, 40, () => {
    g.fillStyle(p.ink, 1);
    g.fillRoundedRect(9, 34, 6, 4, 1);
    g.fillRoundedRect(18, 34, 6, 4, 1);
    rr(7, 15, 18, 15, 6, p.enemy); // torso
    rr(9, 3, 14, 13, 6, p.enemy); // head
    fillRR(11, 7, 12, 4, 2, p.enemyAccent); // knock-off visor
    // a crack across the visor
    g.lineStyle(1.2, p.ink, 1);
    g.lineBetween(15, 7, 17, 11);
    // lopsided emblem
    g.lineStyle(2, p.enemyAccent, 1);
    g.beginPath();
    g.moveTo(11, 25);
    g.lineTo(15, 22);
    g.lineTo(18, 26);
    g.strokePath();
    // arms at sides
    rr(6, 17, 4, 11, 2, p.enemy);
    rr(22, 17, 4, 11, 2, p.enemy);
  });

  // A reusable smug ghost body for the shrinking bosses.
  const drawGhost = (
    w: number,
    h: number,
    body: number,
    face: (cx: number) => void,
  ) => {
    const cx = w / 2;
    g.fillStyle(body, 1);
    g.fillEllipse(cx, h * 0.42, w * 0.9, h * 0.74);
    // wavy skirt tails along the bottom
    const tails = 4;
    const tw = (w * 0.86) / tails;
    const left = w * 0.07;
    for (let i = 0; i < tails; i++) {
      const x0 = left + i * tw;
      g.fillTriangle(x0, h * 0.68, x0 + tw, h * 0.68, x0 + tw / 2, h * 0.95);
    }
    // outline the head dome
    g.lineStyle(2, p.ink, 1);
    g.strokeEllipse(cx, h * 0.42, w * 0.9, h * 0.74);
    face(cx);
  };

  // Specterwave — the boss. A big smug ghost riding a crowd of little heads (the "wave"),
  // absurd rather than looming. Reads well at 55%–100% as it shrinks.
  gen('vox-boss', 96, 112, () => {
    drawGhost(96, 112, p.boss, (cx) => {
      // heavy-lidded, unimpressed eyes
      circ(cx - 14, 40, 8, p.playerAccent);
      circ(cx + 14, 40, 8, p.playerAccent);
      fillC(cx - 14, 42, 3.5, p.ink);
      fillC(cx + 14, 42, 3.5, p.ink);
      g.fillStyle(p.bossAccent, 1); // droopy lids
      g.fillRect(cx - 22, 33, 16, 4);
      g.fillRect(cx + 6, 33, 16, 4);
      // flat unimpressed mouth
      g.lineStyle(3, p.ink, 1);
      g.lineBetween(cx - 12, 60, cx + 12, 60);
      // a little cluster of crowd-heads it surfs on
      g.fillStyle(p.bossAccent, 1);
      for (const dx of [-24, -8, 8, 24]) g.fillCircle(cx + dx, 84, 6);
      g.lineStyle(1.5, p.ink, 1);
      for (const dx of [-24, -8, 8, 24]) g.strokeCircle(cx + dx, 84, 6);
    });
  });

  // The boss's crowd-wave pulse — a low rolling row of little heads. Clearly jumpable.
  gen('vox-wave', 44, 24, () => {
    fillRR(1, 12, 42, 11, 5, p.boss);
    for (let i = 0; i < 4; i++) {
      circ(6 + i * 11, 12, 6, p.bossAccent, 1.5);
    }
    g.lineStyle(INK, p.ink, 1);
    g.strokeRoundedRect(1, 12, 42, 11, 5);
  });

  gen('vox-block', 32, 32, () => {
    g.fillStyle(p.platform, 1);
    g.fillRect(0, 0, 32, 32);
    g.fillStyle(p.ground, 1);
    g.fillRect(0, 26, 32, 6); // a solid capped top edge
    g.fillStyle(p.shine, 0.12);
    g.fillRect(0, 0, 32, 4); // faint top highlight
    g.lineStyle(1.5, p.ink, 0.5);
    g.strokeRect(0.75, 0.75, 30.5, 30.5);
  });

  // Beacon — VOX's checkpoint lamppost. Lighting one saves your spot.
  gen('vox-beacon', 20, 56, () => {
    rr(7, 12, 6, 42, 2, p.checkpoint); // post
    circ(10, 9, 8, p.checkpoint); // dark lamp
  });
  gen('vox-beacon-lit', 20, 56, () => {
    rr(7, 12, 6, 42, 2, p.checkpoint);
    fillC(10, 9, 11, p.checkpointLit, 0.3); // glow halo
    circ(10, 9, 8, p.checkpointLit); // lit lamp
    fillC(8, 7, 2, p.shine, 0.9); // shine dot
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

/**
 * Register VOX's animations. Each frame is its own single-frame texture (see the
 * `vox-player-*` keys above), so an animation is just an ordered list of texture keys.
 * The calm-mode recolor regenerates those textures under the same keys, so the
 * animations stay valid and never need rebuilding. Safe to call every scene create.
 */
export function ensureAnims(scene: Phaser.Scene): void {
  const add = (
    key: string,
    frames: string[],
    frameRate: number,
    repeat: number,
  ): void => {
    if (scene.anims.exists(key)) return;
    scene.anims.create({
      key,
      frames: frames.map((f) => ({ key: f })),
      frameRate,
      repeat,
    });
  };

  add('vox-idle', ['vox-player', 'vox-player-idle1'], 2, -1);
  add('vox-run', ['vox-player-run0', 'vox-player-run1', 'vox-player-run2', 'vox-player-run3'], 12, -1);
  add('vox-jump', ['vox-player-jump'], 1, 0);
  add('vox-fall', ['vox-player-fall'], 1, 0);
  // Attack steps play once; the finisher lingers a beat longer.
  add('vox-atk1', ['vox-player-atk1'], 1, 0);
  add('vox-atk2', ['vox-player-atk2'], 1, 0);
  add('vox-atk3', ['vox-player-atk3'], 1, 0);
  add('vox-hurt', ['vox-player-hurt'], 1, 0);
}
