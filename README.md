# VOX

A 2D side-scrolling action platformer about taking your voice back.

You play VOX — a survivor who reclaimed their voice. The enemies are the Specterati, an
organized harassment network drawn as the cartoons they deserve to be. Every enemy, hazard,
and boss stands in for a real harassment tactic that survivors report. Flattening it is the
point: the game exists to relieve stress and restore a sense of agency for people who have
lived these experiences.

**Play it:** https://chargingthefuture.github.io/vox/

## What the game is

- Tight melee combat: move, jump, and a three-hit combo with a lunging finisher.
- Seven worlds named after the Specterati lexicon (Specterwave, Spectervox, Specterforce,
  Specterrealm, Specterbane, Specterrise, The Recruiters). Each bundles related tactics as
  enemy types and ends with a boss that shrinks as you beat it.
- All 51 problems survivors report are represented across the worlds — see
  `src/data/problems.ts` (verbatim, with the app features that answer each one) and
  `src/data/worlds.ts` (the world groupings).
- The payoff loop: defeat a tactic in-game and a small skippable card names the real
  Charging The Future tool that answers it in real life.

## Current build — Worlds 1, 2, and 3

**World 1 — Specterwave** (public crowding and street harassment):

- Four problem-enemies: Crowders (#1 phone crowding), Blockers (#4 path blocking),
  Starers (#13 hostile staring), Mimics (#48 mirroring).
- The Specterwave boss: crowd-wave pulses, Crowder summons, and a phase-2 swoop.

**World 2 — Spectervox** (slander, reputation, being recorded and baited) — opens after
World 1 is cleared:

- All five of its problems are playable: Slanderers (#2 workplace turn) fling lie-bubbles;
  Gatekeepers (#18 unfair denials) are stamping gates; Recorders (#30 recorded baiting)
  hover and drop loaded questions; Accusers (#31 false accusation) point, lunge, and end
  up winded; the Clerk (#38 name flinch) rings its bell and a Slanderer comes running.
- The deflection loop: attack a lie mid-air and it flips into a truth that flies back and
  hurts whoever threw it. The reputation meter fills as you deflect and defeat; at full,
  your combo finisher hits harder.
- The Spectervox boss, "the megaphone that eats voices": lie-bubble fans, Slanderer
  summons, a phase-2 swoop — and deflected lies hit it twice as hard.

**World 3 — Specterforce** (authority and enforcement) — opens after World 2 is cleared:

- All four of its problems are playable: Shadows (#9 police shadowing) tail you once they
  clock you; the Detector (#39 doorway beeps) pings and calls a Shadow over; the
  LoopGenerator (#41 customer-service hold-loop) puts you on hold, shoving you back until
  you smash it; Sirens (#47 siren circles) ride fixed loops around their posts.
- The Specterforce boss, "the badge that answers to no one": compliance shockwaves that
  roll both ways along the ground, circling-Siren summons, and a phase-2 charge.

Everywhere: bosses shrink with every hit, beacons save your spot generously, going down
costs nothing (the boss keeps its damage), and the world-clear screen lists that world's
whole playbook with the real-life answer to each tactic. The title screen unlocks each
world as you clear the one before it.

Worlds 4–7 are next, one world at a time.

## Safety and accessibility

- Content note on first launch.
- **Calm mode**, one tap: soft palette, sound off, no shakes or flashes.
- Reduced motion is the default; nothing in the game strobes or flashes — beam attacks
  telegraph as steady lines.
- Captions for all audio cues, on by default.
- Remappable controls (title screen → controls), with WASD + X always active as alternates.
- Settings and progress stay on your device (browser localStorage). No accounts, no
  tracking, fully playable offline once loaded.

## Controls (defaults)

| Action | Keys | Gamepad |
|---|---|---|
| Move | ← → or A D | left stick or d-pad |
| Jump | Space, W, or ↑ | bottom face button (A) |
| Attack (combo: press again) | J or X | any other face button |

Gamepads that use the browser's standard mapping (Xbox-style, 8BitDo, DualShock) work out
of the box; Start also confirms menus. On phones and tablets, on-screen touch buttons
appear (move on the left, attack and jump on the right). The game plays sideways —
portrait shows a rotate prompt.

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build to dist/
npm run preview  # serve the built game
```

Stack: [Phaser 3](https://phaser.io) + TypeScript + Vite. No backend. Art is generated
placeholder shapes for now, structured so drawn art can swap in later without touching
gameplay code (`src/systems/textures.ts`).

Deploys to GitHub Pages automatically on every push to `main`
(`.github/workflows/deploy.yml`).

## Repo layout

| Path | What it is |
|---|---|
| `src/data/` | The 51 problems, the 7 worlds, the payoff-card source of truth |
| `src/scenes/` | Title (content note, settings, controls), game world, HUD/cards |
| `src/entities/` | VOX, the four Specterwave enemies, the boss |
| `src/systems/` | Settings/persistence, palettes, input remapping, sounds, textures |
| `AGENTS.md` | Working rules for agents in this repo |
