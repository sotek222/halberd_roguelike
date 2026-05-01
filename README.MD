# Halberd Roguelike

Small browser roguelike built with [rot.js](https://ondras.github.io/rot.js/hp/) for dungeon generation, field of view, pathfinding, and a canvas display. The game loop uses rot.js `Scheduler` and `Engine` for turn-based movement: you act with the keyboard, then enemies and neutral creatures take their turns.

Combat uses a simple dice-driven flow (to hit, to wound, armour save) defined on `Level`.

## Requirements

- [Node.js](https://nodejs.org/) (LTS recommended) and npm

## Getting started

From the repository root:

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the game in development**

   ```bash
   npm start
   ```

   This runs `webpack-dev-server` with `webpack.dev.js`, bundles the app, and should open the game in your default browser. If it does not, open the URL printed in the terminal (typically `http://localhost:8080`).

3. **Run tests**

   ```bash
   npm test
   ```

   Jest runs in watch mode (see `jest.config.js`).

4. **Production build**

   ```bash
   npm run build
   ```

   Emits hashed JS and `index.html` under `dist/`, using `webpack.prod.js`. You can serve `dist/` with any static file server.

## How to play

- **Move**: number pad or arrow keys (eight directions, as mapped in `Player`).
- **Fight**: move into a hostile creature to attack; enemies path toward you when you are in their FOV.
- **UI**: the canvas shows the dungeon; the sidebar shows narrative text and your stats (wounds, weapon skill, strength, toughness, armour save).

The exit is drawn as `∏` on the map; stepping on it is not wired to a next level yet (see `TODO` below).

## Project layout

| Path                     | Role                                                  |
| ------------------------ | ----------------------------------------------------- |
| `src/app.js`             | Entry: constructs `Game` and calls `init()`           |
| `src/entities/Game.js`   | Display, scheduler, engine, current level             |
| `src/entities/Level.js`  | Dungeon generation, entities, exit, combat resolution |
| `src/entities/Player.js` | Input-driven actor                                    |
| `src/entities/Mob.js`    | AI actors (wander, chase, attack)                     |
| `src/entities/Entity.js` | Shared stats, draw, attack dispatch                   |
| `src/utils/mobs.js`      | Weighted random mob definitions                       |
| `src/utils/helpers.js`   | Coordinates, dice rolls, combat thresholds            |
| `public/index.html`      | Shell markup; title and containers                    |

## Upcoming features (`TODO` in source)

These markers are the living backlog; search with:

```bash
grep -R "TODO" src
```

| Location                 | Intent                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `src/entities/Mob.js`    | Refactor shared actor behaviour with `Player` (common base class or mixins).         |
| `src/entities/Level.js`  | Use the exit tile: next floor generation or win state — **multi-level progression**. |
| `src/entities/Player.js` | **Experience and leveling** after kills (stats or abilities).                        |
| `src/utils/mobs.js`      | **Richer encounters**: depth-based tables, rare variants, bosses.                    |

Already in place today: procedurally generated uniform dungeons (`Map.Uniform`), several mob types with weighted spawning, and a basic multi-step combat round.
