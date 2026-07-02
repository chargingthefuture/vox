// Title screen: start, comfort settings (calm mode one tap away), control remapping,
// and the first-launch content note.

import Phaser from 'phaser';
import { pal } from '../systems/palette';
import {
  DEFAULT_BINDINGS,
  progress,
  saveSettings,
  settings,
  type BindableAction,
} from '../systems/settings';
import { cue } from '../systems/sound';
import { keyLabel } from '../systems/input';
import { ensureTextures } from '../systems/textures';

const W = 960;
const H = 540;

export class TitleScene extends Phaser.Scene {
  private overlayOpen = false;

  constructor() {
    super('title');
  }

  create(): void {
    ensureTextures(this);
    this.overlayOpen = false;
    const p = pal();
    this.cameras.main.setBackgroundColor(p.sky);
    this.add.rectangle(W / 2, H - 90, W, 180, p.skyBottom);
    this.add.rectangle(W / 2, H - 20, W, 40, p.ground);

    this.add
      .text(W / 2, 92, 'VOX', { fontFamily: 'monospace', fontSize: '96px', color: p.uiText, fontStyle: 'bold' })
      .setOrigin(0.5);
    this.add
      .text(W / 2, 158, 'take your voice back', { fontFamily: 'monospace', fontSize: '20px', color: p.uiAccent })
      .setOrigin(0.5);
    this.add
      .text(
        W / 2,
        196,
        'Every enemy is a real harassment tactic, drawn as the cartoon it deserves to be.\nFlatten it, and see the real-world tool that answers it.',
        { fontFamily: 'monospace', fontSize: '13px', color: p.uiDim, align: 'center' },
      )
      .setOrigin(0.5);

    // The hero, present and unbothered
    this.add.image(W / 2, H - 60, 'vox-player').setScale(2);

    const cleared = progress.worldsCleared.includes(1);
    const menu: { label: () => string; action: () => void }[] = [
      {
        label: () => `▶ ${cleared ? 'replay' : 'start'} — World 1: Specterwave${cleared ? '  ✓ cleared' : ''}`,
        action: () => this.startGame(),
      },
      {
        label: () => `calm mode: ${settings.calmMode ? 'ON' : 'off'}   (soft colors, muted, no shakes)`,
        action: () => {
          settings.calmMode = !settings.calmMode;
          saveSettings();
          this.scene.restart();
        },
      },
      {
        label: () => `reduced motion: ${settings.reducedMotion ? 'ON' : 'off'}`,
        action: () => {
          settings.reducedMotion = !settings.reducedMotion;
          saveSettings();
          this.scene.restart();
        },
      },
      {
        label: () => `sound: ${settings.sound ? 'ON' : 'off'}`,
        action: () => {
          settings.sound = !settings.sound;
          saveSettings();
          this.scene.restart();
        },
      },
      {
        label: () => `captions: ${settings.captions ? 'ON' : 'off'}`,
        action: () => {
          settings.captions = !settings.captions;
          saveSettings();
          this.scene.restart();
        },
      },
      { label: () => 'controls…', action: () => this.openControls() },
    ];

    menu.forEach((item, i) => {
      const t = this.add
        .text(W / 2, 252 + i * 30, item.label(), {
          fontFamily: 'monospace',
          fontSize: i === 0 ? '18px' : '14px',
          color: i === 0 ? p.uiText : p.uiDim,
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
      t.on('pointerover', () => t.setColor(p.uiAccent));
      t.on('pointerout', () => t.setColor(i === 0 ? p.uiText : p.uiDim));
      t.on('pointerdown', () => {
        if (this.overlayOpen) return;
        cue('ui');
        item.action();
      });
    });

    this.input.keyboard?.on('keydown-ENTER', () => {
      if (!this.overlayOpen) this.startGame();
    });

    if (!settings.contentNoteSeen) this.showContentNote();
  }

  private startGame(): void {
    if (this.overlayOpen) return;
    this.scene.start('game');
  }

  // --- first-launch content note ------------------------------------------------

  private showContentNote(): void {
    this.overlayOpen = true;
    const p = pal();
    const overlay = this.add.container(0, 0).setDepth(300);
    overlay.add(this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.86));
    const panel = this.add.graphics();
    panel.fillStyle(p.uiCard, 1).fillRoundedRect(W / 2 - 340, 70, 680, 400, 12);
    overlay.add(panel);
    overlay.add(
      this.add
        .text(W / 2, 104, 'Before you play', { fontFamily: 'monospace', fontSize: '24px', color: p.uiAccent })
        .setOrigin(0.5),
    );
    overlay.add(
      this.add
        .text(
          W / 2,
          230,
          'VOX turns real harassment tactics that survivors report into cartoon\n' +
            'enemies you can flatten. Nothing here is graphic, and the harassers are\n' +
            'always the ones losing. The point is relief, not reliving.\n\n' +
            'If anything ever feels like too much, calm mode is one tap away: softer\n' +
            'colors, sound off, no shakes or flashes. Flash-style effects are off by\n' +
            'default either way.\n\n' +
            'You are the powerful one here.',
          { fontFamily: 'monospace', fontSize: '14px', color: p.uiText, align: 'center', lineSpacing: 4 },
        )
        .setOrigin(0.5),
    );

    const calmBtn = this.add
      .text(W / 2, 372, `calm mode: ${settings.calmMode ? 'ON' : 'off'}`, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: p.uiDim,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    calmBtn.on('pointerdown', () => {
      settings.calmMode = !settings.calmMode;
      saveSettings();
      cue('ui');
      this.scene.restart(); // note reappears with the new palette until dismissed
    });
    overlay.add(calmBtn);

    const playBtn = this.add
      .text(W / 2, 420, '[ got it — play ]', { fontFamily: 'monospace', fontSize: '18px', color: p.uiAccent })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    playBtn.on('pointerdown', () => {
      settings.contentNoteSeen = true;
      saveSettings();
      cue('ui');
      overlay.destroy();
      this.overlayOpen = false;
    });
    overlay.add(playBtn);
  }

  // --- controls remap -------------------------------------------------------------

  private openControls(): void {
    this.overlayOpen = true;
    const p = pal();
    const overlay = this.add.container(0, 0).setDepth(300);
    overlay.add(this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.86));
    const panel = this.add.graphics();
    panel.fillStyle(p.uiCard, 1).fillRoundedRect(W / 2 - 280, 90, 560, 360, 12);
    overlay.add(panel);
    overlay.add(
      this.add
        .text(W / 2, 122, 'Controls', { fontFamily: 'monospace', fontSize: '22px', color: p.uiAccent })
        .setOrigin(0.5),
    );
    overlay.add(
      this.add
        .text(W / 2, 152, 'click an action, then press the key you want\n(WASD and X always work too)', {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: p.uiDim,
          align: 'center',
        })
        .setOrigin(0.5),
    );

    const actions: [BindableAction, string][] = [
      ['left', 'move left'],
      ['right', 'move right'],
      ['jump', 'jump'],
      ['attack', 'attack'],
    ];
    const rows: Phaser.GameObjects.Text[] = [];
    let rebinding: BindableAction | null = null;

    const rowText = (a: BindableAction, name: string): string =>
      rebinding === a ? `${name}:  press a key…` : `${name}:  ${keyLabel(settings.bindings[a])}`;

    actions.forEach(([a, name], i) => {
      const t = this.add
        .text(W / 2, 200 + i * 40, rowText(a, name), { fontFamily: 'monospace', fontSize: '17px', color: p.uiText })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
      t.on('pointerover', () => t.setColor(p.uiAccent));
      t.on('pointerout', () => t.setColor(p.uiText));
      t.on('pointerdown', () => {
        if (rebinding) return;
        rebinding = a;
        rows.forEach((r, j) => r.setText(rowText(actions[j][0], actions[j][1])));
        const capture = (e: KeyboardEvent): void => {
          e.preventDefault();
          if (e.code !== 'Escape') {
            settings.bindings[a] = e.code;
            saveSettings();
          }
          rebinding = null;
          rows.forEach((r, j) => r.setText(rowText(actions[j][0], actions[j][1])));
        };
        window.addEventListener('keydown', capture, { once: true, capture: true });
      });
      rows.push(t);
      overlay.add(t);
    });

    const resetBtn = this.add
      .text(W / 2, 372, 'reset to defaults', { fontFamily: 'monospace', fontSize: '14px', color: p.uiDim })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    resetBtn.on('pointerdown', () => {
      settings.bindings = { ...DEFAULT_BINDINGS };
      saveSettings();
      cue('ui');
      rows.forEach((r, j) => r.setText(rowText(actions[j][0], actions[j][1])));
    });
    overlay.add(resetBtn);

    const closeBtn = this.add
      .text(W / 2, 414, '[ done ]', { fontFamily: 'monospace', fontSize: '18px', color: p.uiAccent })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => {
      cue('ui');
      overlay.destroy();
      this.overlayOpen = false;
    });
    overlay.add(closeBtn);
  }
}
