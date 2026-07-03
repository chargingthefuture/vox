// Two palettes: the normal one (night-city, defiant neon) and the calm one (soft pastel,
// low contrast, no harsh brights). Everything that draws reads colors from here so the
// calm-mode switch restyles the whole game at once.

import { settings } from './settings';

export interface Palette {
  sky: number;
  skyBottom: number;
  ground: number;
  platform: number;
  player: number;
  playerAccent: number;
  enemy: number;
  enemyAccent: number;
  boss: number;
  bossAccent: number;
  projectile: number;
  checkpoint: number;
  checkpointLit: number;
  confetti: number[];
  uiText: string;
  uiDim: string;
  uiCard: number;
  uiAccent: string;
  hurt: number;
  /** Confident cartoon outline color. Used to ink every sprite. */
  ink: number;
  /** A soft light used for rim/shine accents that survive the calm recolor. */
  shine: number;
}

const NORMAL: Palette = {
  sky: 0x11122b,
  skyBottom: 0x2b1b3d,
  ground: 0x2e2e4e,
  platform: 0x44446e,
  player: 0x35d0ba,
  playerAccent: 0xf7f7ff,
  enemy: 0x8f86c9,
  enemyAccent: 0x5a5390,
  boss: 0xb46ad0,
  bossAccent: 0x7a3a95,
  projectile: 0xffc857,
  checkpoint: 0x5a5a7a,
  checkpointLit: 0x7ce38b,
  confetti: [0x7ce38b, 0x35d0ba, 0xffc857, 0xf7f7ff, 0xff8fa3],
  uiText: '#f7f7ff',
  uiDim: '#a8a8c8',
  uiCard: 0x1c1c34,
  uiAccent: '#7ce38b',
  hurt: 0xff6b6b,
  ink: 0x0c0c1a,
  shine: 0xffffff,
};

const CALM: Palette = {
  sky: 0x2a3140,
  skyBottom: 0x3a4152,
  ground: 0x4a5163,
  platform: 0x5d6478,
  player: 0x8fc8bd,
  playerAccent: 0xe8e8ee,
  enemy: 0x9d97b8,
  enemyAccent: 0x7d789a,
  boss: 0xa88cba,
  bossAccent: 0x8a7099,
  projectile: 0xd8c28e,
  checkpoint: 0x6d7488,
  checkpointLit: 0x9dc4a4,
  confetti: [0x9dc4a4, 0x8fc8bd, 0xd8c28e, 0xe8e8ee],
  uiText: '#e8e8ee',
  uiDim: '#b0b4c4',
  uiCard: 0x333a4a,
  uiAccent: '#9dc4a4',
  hurt: 0xc98a8a,
  // Calm mode keeps outlines soft and low-contrast — a muted slate, never harsh black.
  ink: 0x2a3040,
  shine: 0xf0f2f6,
};

export function pal(): Palette {
  return settings.calmMode ? CALM : NORMAL;
}
