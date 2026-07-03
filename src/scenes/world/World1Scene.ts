// World 1 — Specterwave: public crowding and street harassment.

import Phaser from 'phaser';
import { SpecterwaveBoss } from '../../entities/Boss';
import type { BossBase } from '../../entities/BossBase';
import { Blocker, Crowder, Mimic, Starer } from '../../entities/enemies';
import { BaseWorldScene, GROUND_Y } from './BaseWorldScene';

export class World1Scene extends BaseWorldScene {
  readonly worldId = 1;
  readonly worldName = 'WORLD 1 — SPECTERWAVE';
  readonly worldWidth = 4200;
  readonly checkpointXs = [80, 1250, 2450, 3350];
  readonly bossTriggerX = 3560;
  readonly bossWallX = 3480;

  private waves!: Phaser.Physics.Arcade.Group;

  constructor() {
    super('world1');
  }

  protected buildWorld(): void {
    // Floating platforms
    this.block(760, 400, 128, 24);
    this.block(1500, 392, 128, 24);
    this.block(1690, 320, 96, 24);
    this.block(2120, 380, 128, 24);
    this.block(2680, 400, 128, 24);
    this.block(2880, 330, 96, 24);
    this.block(3120, 396, 128, 24);

    this.hint(200, 'move ← → (or A D)\njump: Space or W');
    this.hint(560, 'attack: J or X\npress again for a 3-hit combo');
    this.hint(1250, 'beacons save your spot');

    // Section 1 — meet the Crowders
    this.spawnEnemy(new Crowder(this, 820, GROUND_Y - 40));
    this.spawnEnemy(new Crowder(this, 1050, GROUND_Y - 40));
    // Section 2 — Starer overwatch + escort
    this.spawnEnemy(new Starer(this, 1690, 240));
    this.spawnEnemy(new Crowder(this, 1560, GROUND_Y - 40));
    // Section 3 — the queue of Blockers
    this.spawnEnemy(new Blocker(this, 2050, GROUND_Y - 44));
    this.spawnEnemy(new Blocker(this, 2210, GROUND_Y - 44));
    this.spawnEnemy(new Starer(this, 2120, 250));
    // Section 4 — hall of mirrors
    this.spawnEnemy(new Mimic(this, 2760, GROUND_Y - 40));
    this.spawnEnemy(new Crowder(this, 2950, GROUND_Y - 40));
    this.spawnEnemy(new Mimic(this, 3120, GROUND_Y - 40));

    this.waves = this.physics.add.group({ allowGravity: false });
    this.physics.add.overlap(this.player, this.waves, (_pl, wave) => {
      this.hurtPlayer((wave as Phaser.Physics.Arcade.Sprite).x);
    });
  }

  protected createBoss(): BossBase {
    return new SpecterwaveBoss(this, this, 3880, 400);
  }

  bossAttack(_kind: string, x: number, dir: number): void {
    if (!this.boss || this.boss.defeated) return;
    const wave = this.waves.create(x, GROUND_Y - 14, 'vox-wave') as Phaser.Physics.Arcade.Sprite;
    wave.setVelocityX(dir * 170);
    wave.setDepth(5);
    this.time.delayedCall(4200, () => wave.destroy());
  }

  bossMinion(x: number): void {
    if (!this.boss || this.boss.defeated) return;
    const nearby = this.enemies.filter((e) => e.active && e instanceof Crowder && e.x > this.bossWallX);
    if (nearby.length >= 2) return;
    this.spawnEnemy(new Crowder(this, x + Phaser.Math.Between(-120, 120), 300));
  }
}
