import { Map, RNG } from 'rot-js';
import Player from './Player';
import Mob from './Mob';
import {
  numParse,
  rollD6,
  getRollToHit,
  getRollToWound,
  getSavingThrow,
  formatCoords,
} from '../utils/helpers';
import { mobs, mobWeightMap } from '../utils/mobs';
import { Colors, Tiles } from '../constants';

class Level {
  // =====================
  // Constructor
  // =====================
  //
  //
  //
  //
  //
  //
  //
  //
  //

  constructor(game, tileSet) {
    this.entityLocals = {};
    this.map = {};
    this.wall = {};
    this.explored = {};
    this.game = game;
    this.player = null;
    this.mobs = [];
    // used to keep track of where the exit is located
    this.exit = null;
  }

  // =====================
  // Instance Methods
  // =====================
  //
  //
  //
  //
  //
  //
  //
  //
  //

  init() {
    this._generateMap();
  }

  removeMob(mobToRemove) {
    this.mobs = this.mobs.filter((mob) => mob === mobToRemove);
  }

  redraw() {
    this._generateWholeMap();
  }

  fightRoundOfCombat(attacker, defender) {
    let playerAttacking = false;
    if (attacker instanceof Player) playerAttacking = true;

    const successfullyHit =
      rollD6() >= getRollToHit(attacker.weaponSkill, defender.weaponSkill);

    if (successfullyHit) {
      const successfullyWounded =
        rollD6() >= getRollToWound(attacker.strength, defender.toughness);

      if (successfullyWounded) {
        const madeSave =
          rollD6() >= getSavingThrow(attacker.strength, defender.armourSave);
        if (madeSave) {
          this.game.displayText(
            playerAttacking
              ? `Your attack bounces off the ${defender.name}'s armour`
              : `The ${attacker.name}'s attack bounces off your armour!`,
            Colors.yellow,
          );
          return;
        } else {
          defender.takeDamage(1);
        }
      } else {
        this.game.displayText('failed to wound');
        return;
      }
    } else {
      this.game.displayText(
        playerAttacking
          ? `You miss the ${defender.name}`
          : `The ${attacker.name} misses!`,
        Colors.yellow,
      );
      return;
    }
  }

  // =====================
  // Private Methods
  // =====================
  //
  //
  //
  //
  //
  //
  //
  //
  //

  _generateMap() {
    // Map comes from Rot.js and allows us to create dungeons
    const dungeon = new Map.Uniform();
    const freeCells = [];

    // this function is used to generate the walls of the dungeon
    function dungeonTileCreator(x, y, value) {
      // value can be either 1 or 0
      if (value) {
        this.wall[formatCoords(x, y)] = Tiles.empty;
        return;
      }

      const key = formatCoords(x, y);
      // we push this key into freeCells so we know which spaces
      // are part of the dungeon
      freeCells.push(key);
      this.map[key] = Tiles.floor;
    }

    // the dungeon is an instance of Map.Uniform
    // the create method must take a callback
    // the callback is passed every x and y coordinate in the map
    // and a value. This is used to generate and store the values for
    // the dungeon in our map and walls.
    dungeon.create(dungeonTileCreator.bind(this));

    // this method is used to actually render the map in the canvas
    this.game.config.options.showGameMap && this._generateWholeMap();
    // add the player to the level and the game as a whole
    this._createOrGetPlayer(freeCells);

    // TODO: create helper for this
    for (let i = 0; i < 5; i++) {
      const mob = mobs[RNG.getWeightedValue(mobWeightMap)];
      const createdMob = Mob.create(
        this.game,
        freeCells,
        mob.stats,
        mob.behaviors,
      );
      this.entityLocals[formatCoords(createdMob.x, createdMob.y)] = createdMob;
      this.mobs.push(createdMob);
    }

    // add the exit to the end of the map
    this._createExit(freeCells);
  }

  _generateWholeMap() {
    for (const key in this.map) {
      const [x, y] = numParse(key.split(','));
      this.game.display.draw(x, y, this.map[key]);
    }
    for (const key in this.wall) {
      const [x, y] = numParse(key.split(','));
      this.game.display.draw(x, y, this.wall[key]);
    }
  }

  _createExit(freeCells) {
    const lastSpace = freeCells.length - 1;
    const exitSpace = freeCells.splice(lastSpace, 1);
    const [x, y] = numParse(exitSpace[0].split(','));
    this.map[x + ',' + y] = Tiles.exit;
    this.exit = exitSpace;

    if (this.game.config.options.showGameMap) {
      this.game.display.draw(x, y, Tiles.exit);
    }
  }

  _createOrGetPlayer(freeCells) {
    const startingLocation = this._generateStartingLocation(freeCells);

    this.game.devLog(
      `Starting location for Level ${this.game.levels.length}: ${startingLocation}`,
    );

    // Only create a player if one doesn't already exist.
    // This is important for when we create new levels,
    // we want to reuse the same player.
    if (!this.player) {
      const player = Player.create(this.game, startingLocation);
      this.player = player;
      this.game.addPlayer(player);
    } else {
      this.player.setNewStartingLocation(startingLocation);
    }

    // we need to add the player to the entityLocals for the level so that we can
    // track where the player is in the level and render them in the correct spot on the map
    this.entityLocals[formatCoords(this.player.x, this.player.y)] = this.player;
  }

  _generateStartingLocation(freeCells) {
    return numParse(freeCells.splice(0, 1)[0].split(','));
  }

  // =====================
  // Static Methods
  // =====================
  //
  //
  //
  //
  //
  //
  //
  //
  //
}

export default Level;
