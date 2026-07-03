// HUD + the payoff cards. Cards are the empowerment-to-action bridge: defeat a tactic,
// see the real-world tool that answers it. One line, skippable, never a sales pitch.

import Phaser from 'phaser';
import { getProblem } from '../data/problems';
import { getWorld, WORLDS } from '../data/worlds';
import { EVENTS } from '../systems/events';
import { gpConfirmPressed, sampleGamepad } from '../systems/gamepad';
import { virtualPress, virtualRelease } from '../systems/input';
import { pal } from '../systems/palette';
import { progress, saveProgress, settings, type BindableAction } from '../systems/settings';
import { onCaption } from '../systems/sound';

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
  /** Armed while a dismissable overlay (card / world clear) is up; gamepad confirm fires it. */
  private overlayDismiss: (() => void) | null = null;
  private worldLabel!: Phaser.GameObjects.Text;
  private repBar!: Phaser.GameObjects.Graphics;
  private repLabel!: Phaser.GameObjects.Text;
  /** Scene key of the world scene that launched the HUD (stop target on world clear). */
  private worldSceneKey = 'world1';

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

    this.worldLabel = this.add
      .text(W / 2, 14, '', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: p.uiDim,
      })
      .setOrigin(0.5, 0)
      .setDepth(100);

    this.repBar = this.add.graphics().setDepth(100);
    this.repLabel = this.add
      .text(16, 42, '', { fontFamily: 'monospace', fontSize: '11px', color: p.uiDim })
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

    if (this.sys.game.device.input.touch) this.buildTouchControls();

    const g = this.game.events;
    g.on(EVENTS.hp, this.onHp, this);
    g.on(EVENTS.problemDefeated, this.onProblemDefeated, this);
    g.on(EVENTS.bossHp, this.onBossHp, this);
    g.on(EVENTS.worldClear, this.onWorldClear, this);
    g.on(EVENTS.respawn, this.onRespawn, this);
    g.on(EVENTS.worldInfo, this.onWorldInfo, this);
    g.on(EVENTS.reputation, this.onReputation, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      onCaption(() => undefined);
      g.off(EVENTS.hp, this.onHp, this);
      g.off(EVENTS.problemDefeated, this.onProblemDefeated, this);
      g.off(EVENTS.bossHp, this.onBossHp, this);
      g.off(EVENTS.worldClear, this.onWorldClear, this);
      g.off(EVENTS.respawn, this.onRespawn, this);
      g.off(EVENTS.worldInfo, this.onWorldInfo, this);
      g.off(EVENTS.reputation, this.onReputation, this);
    });
  }

  private onWorldInfo(_worldId: number, name: string, sceneKey: string): void {
    this.worldLabel.setText(name);
    this.worldSceneKey = sceneKey;
  }

  private onReputation(value: number): void {
    const p = pal();
    this.repBar.clear();
    const w = 120;
    this.repLabel.setText('reputation');
    this.repBar.fillStyle(p.uiCard, 0.9).fillRoundedRect(16, 56, w, 8, 3);
    this.repBar
      .fillStyle(Phaser.Display.Color.HexStringToColor(p.uiAccent).color, 1)
      .fillRoundedRect(17, 57, Math.max(3, (w - 2) * (value / 100)), 6, 2);
  }

  // On-screen buttons for phones/tablets: move on the left, jump + attack on the right.
  // They feed the same action-input layer as the keyboard. Styled to stay out of the way:
  // small, faint, tucked into the bottom corners — the hit zone is bigger than the drawing.
  private buildTouchControls(): void {
    const p = pal();
    // Two thumbs at once (move + jump/attack) need extra touch pointers
    this.input.addPointer(3);

    const button = (x: number, y: number, label: string, action: BindableAction): void => {
      const r = 34;
      const zone = this.add.circle(x, y, r, p.uiCard, 0.16).setDepth(95).setStrokeStyle(1.5, 0xffffff, 0.18);
      // Generous invisible hit area so smaller visuals don't mean missed presses
      zone.setInteractive(
        new Phaser.Geom.Circle(r, r, r + 18),
        Phaser.Geom.Circle.Contains as (shape: Phaser.Geom.Circle, x: number, y: number) => boolean,
      );
      this.add
        .text(x, y, label, { fontFamily: 'monospace', fontSize: '22px', color: p.uiText })
        .setOrigin(0.5)
        .setAlpha(0.45)
        .setDepth(96);
      const press = (): void => {
        zone.setFillStyle(p.uiCard, 0.45);
        virtualPress(action);
      };
      const release = (): void => {
        zone.setFillStyle(p.uiCard, 0.16);
        virtualRelease(action);
      };
      zone.on('pointerdown', press);
      zone.on('pointerup', release);
      zone.on('pointerout', release);
    };

    button(52, H - 44, '◀', 'left');
    button(140, H - 44, '▶', 'right');
    button(W - 140, H - 44, '✦', 'attack');
    button(W - 52, H - 44, '⤒', 'jump');
  }

  update(): void {
    // Gamepad confirm dismisses whatever overlay is up (cards, world clear)
    sampleGamepad(this.game.loop.frame);
    if (this.overlayDismiss && gpConfirmPressed()) {
      const fn = this.overlayDismiss;
      this.overlayDismiss = null;
      fn();
    }
  }

  private onHp(hp: number, max: number): void {
    this.hearts.setText('♥'.repeat(hp) + '·'.repeat(Math.max(0, max - hp)));
  }

  private onRespawn(): void {
    this.showCaption('Knocked down, not out.');
  }

  private onBossHp(hp: number, max: number, name: string, tagline: string): void {
    const p = pal();
    this.bossLabel.setVisible(hp > 0).setText(`${name} — ${tagline}`);
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
      this.overlayDismiss = null;
      this.input.keyboard?.off('keydown', dismiss);
      this.input.off('pointerdown', dismiss);
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
    // Dismissable with any key, tap, or gamepad press, a beat after it appears (so a
    // mid-combo press doesn't eat it)
    this.time.delayedCall(450, () => {
      if (done) return;
      this.input.keyboard?.once('keydown', dismiss);
      this.input.once('pointerdown', dismiss);
      this.overlayDismiss = dismiss;
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
        .text(W / 2, 138, `The whole ${world.name.replace(/^The /, '')} playbook, and what answers it in real life:`, {
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

    // Every implemented world cleared → the whole Specterati playbook is done.
    const allDone = WORLDS.filter((w) => w.implemented.length > 0).every((w) =>
      progress.worldsCleared.includes(w.id),
    );
    const next = WORLDS.find((w) => w.id === worldId + 1);
    let nextUp: string;
    if (allDone) {
      nextUp = 'you flattened all 51 tactics — the Specterati are done';
      overlay.add(
        this.add
          .text(W / 2, H - 72, 'VOX — Bane of the Specterati.', {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: p.uiAccent,
          })
          .setOrigin(0.5),
      );
    } else if (next && next.implemented.length > 0) {
      nextUp = `World ${next.id}: ${next.name.replace(/^The /, '')} is now open`;
    } else {
      nextUp = `Worlds ${worldId + 1}–7 are on their way`;
    }
    overlay.add(
      this.add
        .text(W / 2, H - 44, `press any key or tap — ${nextUp}`, {
          fontFamily: 'monospace',
          fontSize: '14px',
          color: p.uiDim,
        })
        .setOrigin(0.5),
    );

    overlay.setAlpha(0);
    this.tweens.add({ targets: overlay, alpha: 1, duration: 400 });

    this.time.delayedCall(900, () => {
      let used = false;
      const toTitle = (): void => {
        if (used) return;
        used = true;
        this.overlayDismiss = null;
        this.scene.stop(this.worldSceneKey);
        this.scene.start('title');
        this.scene.stop();
      };
      this.input.keyboard?.once('keydown', toTitle);
      this.input.once('pointerdown', toTitle);
      this.overlayDismiss = toTitle;
    });
  }
}
