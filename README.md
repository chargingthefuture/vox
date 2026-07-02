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

## Current build — vertical slice

World 1, **Specterwave** (public crowding and street harassment), playable end to end:

- Four problem-enemies: Crowders (#1 phone crowding), Blockers (#4 path blocking),
  Starers (#13 hostile staring), Mimics (#48 mirroring).
- The Specterwave boss: crowd-wave pulses, Crowder summons, and a phase-2 swoop.
  It shrinks with every hit.
- Beacons (generous checkpoints), win/lose states with no punishment — the boss keeps
  its damage even if you go down.
- The world-clear screen lists the whole Specterwave playbook (all 10 of its problems)
  and what answers each in real life.

Worlds 2–7 are next, one world at a time.

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

| Action | Keys |
|---|---|
| Move | ← → or A D |
| Jump | Space, W, or ↑ |
| Attack (combo: press again) | J or X |

On phones and tablets, on-screen touch buttons appear (move on the left, attack and jump
on the right). The game plays sideways — portrait shows a rotate prompt.

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
