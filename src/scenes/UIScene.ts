// HUD + the payoff cards. Cards are the empowerment-to-action bridge: defeat a tactic,
// see the real-world tool that answers it. One line, skippable, never a sales pitch.

import Phaser from 'phaser';
import { BOSS_EVENTS } from '../entities/Boss';
import { EVENTS } from '../entities/enemies';
import { getProblem } from '../data/problems';
import { getWorld } from '../data/worlds';
import { pal } from '../systems/palette';
import { progress, saveProgress, settings } from '../systems/settings';
import { onCaption } from '../systems/sound';
import { UI_EVENTS } from './GameScene';

const W = 960;
const H = 540;

export class UIScene extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Text;
  private bossBar!: Phaser.GameObjects.Graphics;
  private bossLabel!: Phaser.GameObjects.Text;
  private captionText!: Phaser.GameObjects.Text;
  private captionTimer: Phaser.Time.TimerEvent | null = null;
  private cardQueue: number[] = [];
  private cardShowing = false;
  private clearShown = false;

  constructor() {
    super('ui');
  }

  create(): void {
    const p = pal();
    this.clearShown = false;
    this.cardQueue = [];
    this.cardShowing = false;

    this.hearts = this.add
      .text(16, 12, '', { fontFamily: 'monospace', fontSize: '24px', color: p.uiText })
      .setDepth(100);

    this.add
      .text(W / 2, 14, 'WORLD 1 — SPECTERWAVE', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: p.uiDim,
      })
      .setOrigin(0.5, 0)
      .setDepth(100);

    this.bossBar = this.add.graphics().setDepth(100);
    this.bossLabel = this.add
      .text(W / 2, 46, '', { fontFamily: 'monospace', fontSize: '13px', color: p.uiText })
      .setOrigin(0.5, 0)
      .setDepth(100)
      .setVisible(false);

    this.captionText = this.add
      .text(W - 14, H - 12, '', { fontFamily: 'monospace', fontSize: '14px', color: p.uiDim })
      .setOrigin(1, 1)
      .setDepth(100);

    onCaption((text) => this.showCaption(text));

    const g = this.game.events;
    g.on(UI_EVENTS.hp, this.onHp, this);
    g.on(EVENTS.problemDefeated, this.onProblemDefeated, this);
    g.on(BOSS_EVENTS.hp, this.onBossHp, this);
    g.on(UI_EVENTS.worldClear, this.onWorldClear, this);
    g.on(UI_EVENTS.respawn, this.onRespawn, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      onCaption(() => undefined);
      g.off(UI_EVENTS.hp, this.onHp, this);
      g.off(EVENTS.problemDefeated, this.onProblemDefeated, this);
      g.off(BOSS_EVENTS.hp, this.onBossHp, this);
      g.off(UI_EVENTS.worldClear, this.onWorldClear, this);
      g.off(UI_EVENTS.respawn, this.onRespawn, this);
    });
  }

  private onHp(hp: number, max: number): void {
    this.hearts.setText('♥'.repeat(hp) + '·'.repeat(Math.max(0, max - hp)));
  }

  private onRespawn(): void {
    this.showCaption('Knocked down, not out.');
  }

  private onBossHp(hp: number, max: number): void {
    const p = pal();
    this.bossLabel.setVisible(hp > 0).setText('SPECTERWAVE — the wave that thinks it is the ocean');
    this.bossBar.clear();
    if (hp <= 0) return;
    const w = 420;
    this.bossBar.fillStyle(p.uiCard, 0.9).fillRoundedRect(W / 2 - w / 2, 32, w, 10, 4);
    this.bossBar
      .fillStyle(Phaser.Display.Color.HexStringToColor(p.uiAccent).color, 1)
      .fillRoundedRect(W / 2 - w / 2 + 2, 34, Math.max(4, (w - 4) * (hp / max)), 6, 3);
  }

  private showCaption(text: string): void {
    if (!settings.captions) return;
    this.captionText.setText(text).setAlpha(1);
    this.captionTimer?.remove();
    this.captionTimer = this.time.delayedCall(1400, () => this.captionText.setAlpha(0));
  }

  // --- payoff cards -----------------------------------------------------------

  private onProblemDefeated(pid: number): void {
    if (progress.cardsSeen.includes(pid)) {
      // Already explained once — just a tiny confirmation, no interruption
      this.showCaption(`${getProblem(pid).label} — down`);
      return;
    }
    this.cardQueue.push(pid);
    this.pumpCards();
  }

  private pumpCards(): void {
    if (this.cardShowing || this.cardQueue.length === 0 || this.clearShown) return;
    const pid = this.cardQueue.shift()!;
    if (progress.cardsSeen.includes(pid)) {
      this.pumpCards();
      return;
    }
    this.cardShowing = true;
    progress.cardsSeen = [...progress.cardsSeen, pid];
    saveProgress();

    const p = pal();
    const problem = getProblem(pid);
    const solutions = problem.solutions.join(' and ');
    const verb = problem.solutions.length > 1 ? 'help' : 'helps';

    const card = this.add.container(W / 2, H + 60).setDepth(110);
    const bg = this.add.graphics();
    bg.fillStyle(p.uiCard, 0.96).fillRoundedRect(-330, -44, 660, 88, 10);
    bg.lineStyle(2, Phaser.Display.Color.HexStringToColor(p.uiAccent).color, 0.8).strokeRoundedRect(-330, -44, 660, 88, 10);
    card.add(bg);
    card.add(
      this.add
        .text(0, -24, `Tactic defeated — ${problem.label}`, {
          fontFamily: 'monospace',
          fontSize: '17px',
          color: p.uiAccent,
        })
        .setOrigin(0.5),
    );
    card.add(
      this.add
        .text(0, 0, `In real life: ${solutions} ${verb} with this.`, {
          fontFamily: 'monospace',
          fontSize: '15px',
          color: p.uiText,
        })
        .setOrigin(0.5),
    );
    card.add(
      this.add
        .text(0, 26, 'any key to dismiss', { fontFamily: 'monospace', fontSize: '11px', color: p.uiDim })
        .setOrigin(0.5),
    );

    this.tweens.add({ targets: card, y: H - 64, duration: 260, ease: 'Back.easeOut' });

    let done = false;
    const dismiss = (): void => {
      if (done) return;
      done = true;
      this.input.keyboard?.off('keydown', dismiss);
      this.tweens.add({
        targets: card,
        y: H + 60,
        duration: 200,
        ease: 'Sine.easeIn',
        onComplete: () => {
          card.destroy();
          this.cardShowing = false;
          this.pumpCards();
        },
      });
    };
    this.time.delayedCall(5200, dismiss);
    // Dismissable with any key, a beat after it appears (so a mid-combo press doesn't eat it)
    this.time.delayedCall(450, () => {
      if (!done) this.input.keyboard?.once('keydown', dismiss);
    });
  }

  // --- world clear --------------------------------------------------------------

  private onWorldClear(worldId: number): void {
    if (this.clearShown) return;
    this.clearShown = true;
    const p = pal();
    const world = getWorld(worldId);

    const overlay = this.add.container(0, 0).setDepth(200);
    const dim = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.82);
    overlay.add(dim);
    overlay.add(
      this.add
        .text(W / 2, 64, `${world.name.toUpperCase()} — CLEARED`, {
          fontFamily: 'monospace',
          fontSize: '30px',
          color: p.uiAccent,
        })
        .setOrigin(0.5),
    );
    overlay.add(
      this.add
        .text(W / 2, 102, 'The Specterati shrink. Your voice does not.', {
          fontFamily: 'monospace',
          fontSize: '15px',
          color: p.uiText,
        })
        .setOrigin(0.5),
    );
    overlay.add(
      this.add
        .text(W / 2, 138, `The whole ${world.name} playbook, and what answers it in real life:`, {
          fontFamily: 'monospace',
          fontSize: '13px',
          color: p.uiDim,
        })
        .setOrigin(0.5),
    );

    // Two columns of the world's problems and their real-world answers
    const col = (items: string[], x: number): void => {
      overlay.add(
        this.add.text(x, 166, items.join('\n\n'), {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: p.uiText,
          lineSpacing: 2,
          wordWrap: { width: 420 },
        }),
      );
    };
    const lines = world.problemIds.map((pid) => {
      const pr = getProblem(pid);
      return `• ${pr.label} → ${pr.solutions.join(', ')}`;
    });
    const half = Math.ceil(lines.length / 2);
    col(lines.slice(0, half), 60);
    col(lines.slice(half), 500);

    overlay.add(
      this.add
        .text(W / 2, H - 44, 'press any key — Worlds 2–7 are on their way', {
          fontFamily: 'monospace',
          fontSize: '14px',
          color: p.uiDim,
        })
        .setOrigin(0.5),
    );

    overlay.setAlpha(0);
    this.tweens.add({ targets: overlay, alpha: 1, duration: 400 });

    this.time.delayedCall(900, () => {
      this.input.keyboard?.once('keydown', () => {
        this.scene.stop('game');
        this.scene.start('title');
        this.scene.stop();
      });
    });
  }
}
