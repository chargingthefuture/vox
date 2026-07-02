// Player settings and progress, kept in localStorage. Safety-first defaults:
// reduced motion ON, flashing effects OFF, captions ON.

export interface Settings {
  /** One-tap comfort switch: soft palette, sound muted, no shake, no flash. */
  calmMode: boolean;
  /** Reduced motion (default ON): no camera shake, no fast strobing telegraphs. */
  reducedMotion: boolean;
  /** Master sound switch. */
  sound: boolean;
  /** Show text captions for audio cues. */
  captions: boolean;
  /** Player has seen and dismissed the first-launch content note. */
  contentNoteSeen: boolean;
  /** Custom key bindings (action -> KeyboardEvent.code). */
  bindings: Record<BindableAction, string>;
}

export type BindableAction = 'left' | 'right' | 'jump' | 'attack';

export const DEFAULT_BINDINGS: Record<BindableAction, string> = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  jump: 'Space',
  attack: 'KeyJ',
};

/** Secondary bindings that always work alongside the custom ones (WASD + X). */
export const BUILTIN_ALT_BINDINGS: Record<BindableAction, string[]> = {
  left: ['KeyA'],
  right: ['KeyD'],
  jump: ['KeyW', 'ArrowUp'],
  attack: ['KeyX'],
};

export interface Progress {
  /** Highest checkpoint reached in world 1 (index into the checkpoint list). */
  world1Checkpoint: number;
  /** Problem ids whose payoff card has been shown in full. */
  cardsSeen: number[];
  /** World ids cleared. */
  worldsCleared: number[];
}

const SETTINGS_KEY = 'vox.settings.v1';
const PROGRESS_KEY = 'vox.progress.v1';

const defaultSettings: Settings = {
  calmMode: false,
  reducedMotion: true,
  sound: true,
  captions: true,
  contentNoteSeen: false,
  bindings: { ...DEFAULT_BINDINGS },
};

const defaultProgress: Progress = {
  world1Checkpoint: 0,
  cardsSeen: [],
  worldsCleared: [],
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(fallback);
    return { ...structuredClone(fallback), ...JSON.parse(raw) };
  } catch {
    return structuredClone(fallback);
  }
}

export const settings: Settings = load(SETTINGS_KEY, defaultSettings);
export const progress: Progress = load(PROGRESS_KEY, defaultProgress);

export function saveSettings(): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* storage unavailable (private mode); play on without persistence */
  }
}

export function saveProgress(): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    /* storage unavailable; play on without persistence */
  }
}

/** True when motion-heavy feedback (shake, flash) should be skipped. */
export function motionReduced(): boolean {
  return settings.reducedMotion || settings.calmMode;
}

/** True when audio should stay silent. */
export function soundOff(): boolean {
  return !settings.sound || settings.calmMode;
}
