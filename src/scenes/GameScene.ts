// World 1 — Specterwave. Side-scrolling level with four problem-enemies, beacons
// (checkpoints), and the Specterwave boss at the end.

import Phaser from 'phaser';
import { SpecterwaveBoss, BOSS_EVENTS, BOSS_MAX_HP } from '../entities/Boss';
import { Blocker, Crowder, EVENTS, Enemy, Mimic, Starer } from '../entities/enemies';
import { Player, PLAYER_MAX_HP } from '../entities/Player';
import { sampleGamepad } from '../systems/gamepad';
import { ActionInput } from '../systems/input';
import { pal } from '../systems/palette';
import { motionReduced, progress, saveProgress } from '../systems/settings';
import { cue } from '../systems/sound';
import { ensureTextures } from '../systems/textures';

export const UI_EVENTS = {
  hp: 'vox:hp',
  checkpoint: 'vox:checkpoint',
  worldClear: 'vox:world-clear',
  respawn: 'vox:respawn',
} as const;

const WORLD_W = 4200;
const WORLD_H = 540;
const GROUND_Y = 500;

// Beacon x positions; index 0 is the spawn (no beacon there).
const CHECKPOINTS = [80, 1250, 2450, 3350];
const BOSS_TRIGGER_X = 3560;

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private inputMap!: ActionInput;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private enemies: Enemy[] = [];
  private waves!: Phaser.Physics.Arcade.Group;
  private boss: SpecterwaveBoss | null = null;
  private bossStarted = false;
  private confetti!: Phaser.GameObjects.Particles.ParticleEmitter;
  private beacons: { sprite: Phaser.GameObjects.Image; index: number }[] = [];
  private lastSwingHit = new Map<number, Set<object>>();
  private respawning = false;
  private clearing = false;

  constructor() {
    super('game');
  }

  create(): void {
    ensureTextures(this);
    const p = pal();

    this.enemies = [];
    this.boss = null;
    this.bossStarted = false;
    this.respawning = false;
    this.clearing = false;
    this.lastSwingHit.clear();
    this.beacons = [];

    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBackgroundColor(p.sky);

    this.buildBackdrop();
    this.buildLevel();

    const spawnIdx = Math.min(progress.world1Checkpoint, CHECKPOINTS.length - 1);
    this.player = new Player(this, CHECKPOINTS[spawnIdx], GROUND_Y - 60);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(140, 400);

    this.inputMap = new ActionInput();
    this.inputMap.attach();

    this.physics.add.collider(this.player, this.platforms);

    this.waves = this.physics.add.group({ allowGravity: false });
    this.physics.add.overlap(this.player, this.waves, (_pl, wave) => {
      this.hurtPlayer((wave as Phaser.Physics.Arcade.Sprite).x);
    });

    this.confetti = this.add.particles(0, 0, 'vox-particle', {
      speed: { min: 90, max: 260 },
      angle: { min: 210, max: 330 },
      gravityY: 600,
      lifespan: { min: 400, max: 850 },
      scale: { start: 1, end: 0 },
      tint: p.confetti,
      emitting: false,
    });
    this.confetti.setDepth(20);

    this.spawnEnemies();

    // Cross-object events (enemies/boss ask; the scene decides)
    const g = this.game.events;
    g.on(EVENTS.playerHit, this.onPlayerHitRequest, this);
    g.on(EVENTS.problemDefeated, this.onProblemDefeated, this);
    g.on(BOSS_EVENTS.wave, this.onBossWave, this);
    g.on(BOSS_EVENTS.summon, this.onBossSummon, this);
    g.on(BOSS_EVENTS.down, this.onBossDown, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.inputMap.detach();
      g.off(EVENTS.playerHit, this.onPlayerHitRequest, this);
      g.off(EVENTS.problemDefeated, this.onProblemDefeated, this);
      g.off(BOSS_EVENTS.wave, this.onBossWave, this);
      g.off(BOSS_EVENTS.summon, this.onBossSummon, this);
      g.off(BOSS_EVENTS.down, this.onBossDown, this);
    });

    this.scene.launch('ui');
    this.time.delayedCall(0, () => this.game.events.emit(UI_EVENTS.hp, this.player.hp, PLAYER_MAX_HP));

    // Test/debug handle, only with ?debug in the URL (used by automated browser checks)
    if (new URLSearchParams(location.search).has('debug')) {
      (window as unknown as { __voxDebug: unknown }).__voxDebug = this;
    }
  }

  /** Exposed for the ?debug handle. */
  get debugBoss(): SpecterwaveBoss | null {
    return this.boss;
  }

  private buildBackdrop(): void {
    const p = pal();
    // Simple two-tone sky + distant skyline, parallax-scrolled
    this.add.rectangle(WORLD_W / 2, WORLD_H / 2, WORLD_W, WORLD_H, p.sky).setDepth(-10).setScrollFactor(1);
    this.add.rectangle(WORLD_W / 2, WORLD_H - 120, WORLD_W, 240, p.skyBottom).setDepth(-9);
    for (let x = 60; x < WORLD_W; x += 170) {
      const h = 60 + ((x * 37) % 130);
      this.add
        .rectangle(x, GROUND_Y - h / 2 + 6, 70 + ((x * 13) % 50), h, p.ground, 0.55)
        .setDepth(-8)
        .setScrollFactor(0.4, 1);
    }
  }

  private block(x: number, y: number, w: number, h: number): void {
    const b = this.platforms.create(x, y, 'vox-block') as Phaser.Physics.Arcade.Sprite;
    b.setScale(w / 32, h / 32).refreshBody();
  }

  private buildLevel(): void {
    this.platforms = this.physics.add.staticGroup();
    // Solid ground the whole way — the slice has no bottomless pits
    this.block(WORLD_W / 2, GROUND_Y + 20, WORLD_W, 40);
    // Floating platforms
    this.block(760, 400, 128, 24);
    this.block(1500, 392, 128, 24);
    this.block(1690, 320, 96, 24);
    this.block(2120, 380, 128, 24);
    this.block(2680, 400, 128, 24);
    this.block(2880, 330, 96, 24);
    this.block(3120, 396, 128, 24);

    // Beacons (checkpoints)
    for (let i = 1; i < CHECKPOINTS.length; i++) {
      const lit = progress.world1Checkpoint >= i;
      const sprite = this.add.image(CHECKPOINTS[i], GROUND_Y - 28, lit ? 'vox-beacon-lit' : 'vox-beacon').setDepth(2);
      this.beacons.push({ sprite, index: i });
    }

    // Movement hints, in-world
    const p = pal();
    const hint = (x: number, text: string): void => {
      this.add
        .text(x, 300, text, { fontFamily: 'monospace', fontSize: '15px', color: p.uiDim, align: 'center' })
        .setOrigin(0.5)
        .setDepth(-5);
    };
    hint(200, 'move ← → (or A D)\njump: Space or W');
    hint(560, 'attack: J or X\npress again for a 3-hit combo');
    hint(1250, 'beacons save your spot');
  }

  private spawnEnemies(): void {
    const add = (e: Enemy): void => {
      this.enemies.push(e);
      this.physics.add.collider(e, this.platforms);
      if (e instanceof Blocker) {
        this.physics.add.collider(this.player, e);
      }
    };
    // Section 1 — meet the Crowders
    add(new Crowder(this, 820, GROUND_Y - 40));
    add(new Crowder(this, 1050, GROUND_Y - 40));
    // Section 2 — Starer overwatch + escort
    add(new Starer(this, 1690, 240));
    add(new Crowder(this, 1560, GROUND_Y - 40));
    // Section 3 — the queue of Blockers
    add(new Blocker(this, 2050, GROUND_Y - 44));
    add(new Blocker(this, 2210, GROUND_Y - 44));
    add(new Starer(this, 2120, 250));
    // Section 4 — hall of mirrors
    add(new Mimic(this, 2760, GROUND_Y - 40));
    add(new Crowder(this, 2950, GROUND_Y - 40));
    add(new Mimic(this, 3120, GROUND_Y - 40));
  }

  private startBoss(): void {
    this.bossStarted = true;
    // Keep the fight in the arena: an invisible wall behind VOX
    this.block(3480, GROUND_Y - 80, 24, 160);
    const wall = this.platforms.getLast(true) as Phaser.Physics.Arcade.Sprite;
    wall.setVisible(false);
    this.boss = new SpecterwaveBoss(this, 3880, 400);
    this.physics.add.overlap(this.player, this.boss, () => this.boss && this.hurtPlayer(this.boss.x));
    this.game.events.emit(BOSS_EVENTS.hp, this.boss.hp, BOSS_MAX_HP);
    if (!motionReduced()) this.cameras.main.shake(180, 0.004);
  }

  // --- event handlers -------------------------------------------------------

  private onPlayerHitRequest(sourceX: number): void {
    this.hurtPlayer(sourceX);
  }

  private onProblemDefeated(_pid: number, x: number, y: number): void {
    this.confetti.explode(16, x, y);
  }

  private onBossWave(x: number, dir: number): void {
    if (!this.boss || this.boss.defeated) return;
    const wave = this.waves.create(x, GROUND_Y - 14, 'vox-wave') as Phaser.Physics.Arcade.Sprite;
    wave.setVelocityX(dir * 170);
    wave.setDepth(5);
    this.time.delayedCall(4200, () => wave.destroy());
  }

  private onBossSummon(x: number): void {
    if (!this.boss || this.boss.defeated) return;
    const crowders = this.enemies.filter((e) => e.active && e instanceof Crowder && e.x > 3400);
    if (crowders.length >= 2) return;
    const e = new Crowder(this, x + Phaser.Math.Between(-120, 120), 300);
    this.enemies.push(e);
    this.physics.add.collider(e, this.platforms);
  }

  private onBossDown(x: number, y: number): void {
    this.confetti.explode(48, x, y);
    this.boss = null;
    if (this.clearing) return;
    this.clearing = true;
    progress.worldsCleared = Array.from(new Set([...progress.worldsCleared, 1]));
    progress.world1Checkpoint = 0;
    saveProgress();
    this.time.delayedCall(1300, () => this.game.events.emit(UI_EVENTS.worldClear, 1));
  }

  // --- combat ---------------------------------------------------------------

  hurtPlayer(sourceX: number): void {
    if (this.respawning || this.clearing) return;
    if (!this.player.takeHit(sourceX)) return;
    this.game.events.emit(UI_EVENTS.hp, this.player.hp, PLAYER_MAX_HP);
    if (!motionReduced()) this.cameras.main.shake(90, 0.004);
    if (this.player.hp <= 0) this.respawn();
  }

  private respawn(): void {
    this.respawning = true;
    this.game.events.emit(UI_EVENTS.respawn);
    this.cameras.main.fadeOut(280, 0, 0, 0);
    this.time.delayedCall(420, () => {
      const idx = Math.min(progress.world1Checkpoint, CHECKPOINTS.length - 1);
      this.player.setPosition(CHECKPOINTS[idx], GROUND_Y - 60).setVelocity(0, 0);
      this.player.refill();
      this.game.events.emit(UI_EVENTS.hp, this.player.hp, PLAYER_MAX_HP);
      // The boss does NOT heal while you were down — no punishing resets
      if (this.boss && !this.boss.defeated) this.boss.setPosition(3880, 400);
      this.cameras.main.fadeIn(280, 0, 0, 0);
      this.respawning = false;
    });
  }

  private processAttack(): void {
    const box = this.player.attackBox();
    if (!box) return;
    let hitSet = this.lastSwingHit.get(box.swingId);
    if (!hitSet) {
      hitSet = new Set();
      this.lastSwingHit.set(box.swingId, hitSet);
      // Keep the map small
      for (const key of this.lastSwingHit.keys()) {
        if (key < box.swingId - 3) this.lastSwingHit.delete(key);
      }
    }
    const dir = this.player.facing;
    const targets: (Enemy | SpecterwaveBoss)[] = [...this.enemies.filter((e) => e.active && !e.defeated)];
    if (this.boss && this.boss.active && !this.boss.defeated) targets.push(this.boss);
    for (const t of targets) {
      if (hitSet.has(t)) continue;
      if (!Phaser.Geom.Intersects.RectangleToRectangle(box.rect, t.getBounds())) continue;
      hitSet.add(t);
      t.hit(box.damage, dir, box.finisher);
      cue(box.finisher ? 'combo-finish' : 'hit');
      this.hitstop(box.finisher ? 70 : 45);
      if (box.finisher && !motionReduced()) this.cameras.main.shake(70, 0.003);
    }
  }

  private hitstop(ms: number): void {
    if (this.physics.world.isPaused) return;
    this.physics.pause();
    this.time.delayedCall(ms, () => this.physics.resume());
  }

  // --- main loop --------------------------------------------------------------

  update(_time: number, delta: number): void {
    sampleGamepad(this.game.loop.frame);
    if (this.respawning || this.clearing) {
      this.inputMap.endFrame();
      return;
    }

    this.player.updatePlayer(delta, this.inputMap);

    for (const e of this.enemies) {
      if (e.active && !e.defeated) e.updateEnemy(delta, this.player);
    }
    this.enemies = this.enemies.filter((e) => e.active);

    if (this.boss) this.boss.updateBoss(delta, this.player);

    // Contact damage
    for (const e of this.enemies) {
      if (!e.active || e.defeated || e.touchDamage <= 0) continue;
      if (this.player.invulnerable) break;
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), e.getBounds())) {
        this.hurtPlayer(e.x);
        break;
      }
    }

    this.processAttack();

    // Checkpoints
    for (const b of this.beacons) {
      if (b.index > progress.world1Checkpoint && Math.abs(this.player.x - b.sprite.x) < 26) {
        progress.world1Checkpoint = b.index;
        saveProgress();
        b.sprite.setTexture('vox-beacon-lit');
        cue('checkpoint');
        this.game.events.emit(UI_EVENTS.checkpoint);
      }
    }

    // Boss trigger
    if (!this.bossStarted && this.player.x > BOSS_TRIGGER_X) this.startBoss();

    // Safety net — should be unreachable (solid ground), but never soft-lock
    if (this.player.y > WORLD_H + 40) {
      const idx = Math.min(progress.world1Checkpoint, CHECKPOINTS.length - 1);
      this.player.setPosition(CHECKPOINTS[idx], GROUND_Y - 60).setVelocity(0, 0);
    }

    this.inputMap.endFrame();
  }
}
