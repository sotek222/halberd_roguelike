import { Path, RNG, FOV } from 'rot-js';
import { formatCoords, numParse } from '../utils/helpers';
import Entity from './Entity';
import { ALIGNMENT, BEHAVIORS } from '../constants';
const { wander, wait, guard } = BEHAVIORS;

// TODO: share behavior with Player via a common actor base (movement, combat hooks) instead of duplicating patterns
class Mob extends Entity {
  constructor(
    x,
    y,
    game,
    stats = {
      name: 'unkown',
      alignment: ALIGNMENT.NEUTRAL,
      char: '⚉',
      weaponSkill: 2,
      strength: 2,
      toughness: 2,
      armourSave: 7,
      wounds: 1,
    },
    behaviors = [],
  ) {
    super(x, y, game, stats);

    this.fov = null;

    console.log({ stats, behaviors });

    this.behaviors = behaviors;

    this._draw();
  }

  /*  ACTIONS */
  _draw() {
    this._updateVisibility();
    super.draw();
    return new Promise(
      (result) => result,
      (reject) => reject,
    );
  }

  act() {
    switch (this.alignment) {
      case ALIGNMENT.ENEMY:
        if (this._playerIsInFOV()) {
          this._moveTowardsPlayer();
        } else {
          const weightedBehavior = this._getWeightedRandomBehavior();

          const action = this._mapBehaviorToFunction(weightedBehavior);
          action();
        }
        break;
      default:
        this._wander();
        break;
    }
  }

  _updateVisibility() {
    // returns true if light is able to pass through
    function lightPasses(x, y) {
      const key = formatCoords(x, y);
      return key in this.game.currentLevel.map;
    }
    const sight = {};

    const fov = new FOV.PreciseShadowcasting(lightPasses.bind(this));
    // output callback
    fov.compute(
      this.x,
      this.y,
      5,
      function (x, y, r, visibility) {
        if (r) {
          sight[x + ',' + y] = true;
        }
      }.bind(this),
    );

    this.fov = sight;
  }

  _wander() {
    const radius = [
      // top left corner
      formatCoords(this.x - 1, this.y - 1),
      // top middle
      formatCoords(this.x, this.y - 1),
      // top right corner
      formatCoords(this.x + 1, this.y - 1),
      // mid left
      formatCoords(this.x - 1, this.y),
      // center
      formatCoords(this.x, this.y),
      // mid right
      formatCoords(this.x + 1, this.y),
      // bottom left corner
      formatCoords(this.x - 1, this.y + 1),
      // bottom middle
      formatCoords(this.x, this.y + 1),
      // bottom right corner
      formatCoords(this.x + 1, this.y + 1),
    ];

    const randomPos = radius[Math.floor(RNG.getUniform() * radius.length)];
    const [newX, newY] = randomPos.split(',');

    if (this._checkIfInMap(newX, newY)) {
      this.game.display.draw(
        this.x,
        this.y,
        this.game.currentLevel.map[formatCoords(this.x, this.y)],
      );
      delete this.game.currentLevel.entityLocals[formatCoords(this.x, this.y)];
      this.x = parseInt(newX);
      this.y = parseInt(newY);
      this.game.currentLevel.entityLocals[formatCoords(this.x, this.y)] = this;
      this._draw();
    } else {
      this._wander();
    }
  }

  _moveTowardsPlayer() {
    // Get the players current coords
    let x = this.game.player.x;
    let y = this.game.player.y;

    // Path generating algorithm
    const astar = new Path.AStar(x, y, this._checkIfInMap.bind(this), {
      topology: 4,
    });
    const path = [];

    function addToPath(x, y) {
      path.push([x, y]);
    }

    astar.compute(this.x, this.y, addToPath);
    // the mobs current position is also in the path
    // so we remove the first coordinates
    path.shift();

    if (path.length == 1) {
      this._draw();

      const player = this.game.currentLevel.entityLocals[path[0].join()];
      this.attack(player);
    } else {
      x = path[0][0];
      y = path[0][1];
      // If there is another entity in the direction it's moving
      // don't let it move forward
      if (formatCoords(x, y) in this.game.currentLevel.entityLocals) {
        this._draw();
        return;
      }

      // replace the current area with the tile
      this.game.display.draw(
        this.x,
        this.y,
        this.game.currentLevel.map[formatCoords(this.x, this.y)],
      );

      // remove the entity from its current position
      delete this.game.currentLevel.entityLocals[formatCoords(this.x, this.y)];
      // update the x and y of the entity
      this.x = x;
      this.y = y;
      // update the position in the object
      this.game.currentLevel.entityLocals[formatCoords(this.x, this.y)] = this;
      // redraw the entity
      this._draw();
    }
  }

  /* HELPERS */

  _remove() {
    this.game.scheduler.remove(this);
    this.game.display.draw(
      this.x,
      this.y,
      this.game.currentLevel.map[formatCoords(this.x, this.y)],
    );
    delete this.game.currentLevel.entityLocals[formatCoords(this.x, this.y)];
    this.game.currentLevel.removeMob(this);
  }

  _playerIsInFOV() {
    return formatCoords(this.game.player.x, this.game.player.y) in this.fov;
  }

  _checkIfInMap(x, y) {
    return formatCoords(x, y) in this.game.currentLevel.map;
  }

  _mapBehaviorToFunction(behavior) {
    console.log(this.name, behavior.name);

    switch (behavior.name) {
      case wander:
        return this._wander.bind(this);
      case guard:
        return this._draw.bind(this);
      case wait:
        return this._draw.bind(this);
      default:
        return this._draw.bind(this);
    }
  }

  _getWeightedRandomBehavior() {
    const behaviors = this.behaviors;

    let totalWeight = 0;

    for (const b of behaviors) {
      totalWeight += b.weight;
    }

    console.log({ behaviors, name: this.name });
    let r = RNG.getUniform() * totalWeight;
    let behavior = behaviors[0].name;

    for (const b of behaviors) {
      // The higher the weight the more likely it will survive the random check
      if (r < b.weight) {
        behavior = b;
        break;
      }
      r -= b.weight;
    }

    return behavior;
  }
  static create(game, freeCells, stats, behaviors) {
    const index = Math.floor(RNG.getUniform() * freeCells.length);
    // we use splice so that the space is now considered occupied
    const [x, y] = numParse(freeCells.splice(index, 1)[0].split(','));
    const mob = new Mob(x, y, game, stats, behaviors);
    return mob;
  }
}

export default Mob;
