// SPECTERWAVE — World 1 boss. A big smug ghost that pushes crowd-waves and summons
// Crowders. Pillar 1 made mechanical: it literally shrinks as you damage it, and its
// defeat is a pop, not a spectacle of menace.

import Phaser from 'phaser';
import { cue } from '../systems/sound';
import { EVENTS } from './enemies';
import type { Player } from './Player';

export const BOSS_EVENTS = {
  hp: 'vox:boss-hp',
  summon: 'vox:boss-summon',
  wave: 'vox:boss-wave',
  down: 'vox:boss-down',
} as const;

export const BOSS_MAX_HP = 22;

export class SpecterwaveBoss extends Phaser.Physics.Arcade.Sprite {
  hp = BOSS_MAX_HP;
  defeated = false;
  touchDamage = 1;
  private baseY: number;
  private waveTimer = 2200;
  private summonTimer = 4200;
  private dashTimer = 3000;
  private dashing = 0;
  private hitFlash = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'vox-boss');
    this.baseY = y;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setSize(78, 92).setOffset(9, 8);
    (this.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    this.setDepth(6);
    cue('boss-appear');
  }

  get phase(): 1 | 2 {
    return this.hp > BOSS_MAX_HP / 2 ? 1 : 2;
  }

  hit(damage: number, dir: 1 | -1): void {
    if (this.defeated) return;
    this.hp = Math.max(0, this.hp - damage);
    this.setTintFill(0xffffff);
    this.hitFlash = 70;
    this.x += dir * 6;
    // The Specterati shrink as you win. Down to ~55% size at 1 hp.
    this.setScale(0.55 + 0.45 * (this.hp / BOSS_MAX_HP));
    this.scene.game.events.emit(BOSS_EVENTS.hp, this.hp, BOSS_MAX_HP);
    if (this.hp <= 0) this.defeat();
  }

  private defeat(): void {
    this.defeated = true;
    cue('boss-down');
    (this.body as Phaser.Physics.Arcade.Body).enable = false;
    this.scene.tweens.add({
      targets: this,
      scale: 0.05,
      angle: 360,
      alpha: 0,
      y: this.y - 30,
      duration: 900,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.scene.game.events.emit(BOSS_EVENTS.down, this.x, this.y);
        this.destroy();
      },
    });
  }

  updateBoss(dtMs: number, player: Player): void {
    if (this.defeated) return;
    this.hitFlash -= dtMs;
    if (this.hitFlash <= 0) this.clearTint();

    // Hover in a lazy sine, low enough to hit with a jump
    this.y = this.baseY + Math.sin(this.scene.time.now / 700) * 34;

    if (this.dashing > 0) {
      this.dashing -= dtMs;
      if (this.dashing <= 0) this.setVelocityX(0);
    } else {
      // Drift toward VOX, slowly — it is a wave, not a missile
      const dx = player.x - this.x;
      this.setVelocityX(Phaser.Math.Clamp(dx, -55, 55));
      this.setFlipX(dx < 0);
    }

    const speedUp = this.phase === 2 ? 0.72 : 1;
    this.waveTimer -= dtMs;
    if (this.waveTimer <= 0) {
      this.waveTimer = 2600 * speedUp;
      this.scene.game.events.emit(BOSS_EVENTS.wave, this.x, Math.sign(player.x - this.x) || 1);
    }

    this.summonTimer -= dtMs;
    if (this.summonTimer <= 0) {
      this.summonTimer = 5200 * speedUp;
      this.scene.game.events.emit(BOSS_EVENTS.summon, this.x);
    }

    if (this.phase === 2) {
      this.dashTimer -= dtMs;
      if (this.dashTimer <= 0 && this.dashing <= 0) {
        this.dashTimer = 3400;
        // Telegraph: a slow, readable puff-up, then the swoop. No flash.
        this.scene.tweens.add({
          targets: this,
          scaleX: this.scaleX * 1.12,
          scaleY: this.scaleY * 1.12,
          duration: 420,
          yoyo: true,
          onComplete: () => {
            if (this.defeated || !this.active) return;
            this.dashing = 620;
            this.setVelocityX(Math.sign(player.x - this.x || 1) * 240);
          },
        });
      }
    }
  }

  /** Ask the scene to damage the player. */
  requestPlayerHit(): void {
    this.scene.game.events.emit(EVENTS.playerHit, this.x);
  }
}
