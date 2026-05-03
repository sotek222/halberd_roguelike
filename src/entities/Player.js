import { DIRS, FOV } from 'rot-js';
import Mob from './Mob';
import { formatCoords, numParse } from '../utils/helpers';
import Entity from './Entity';
import { ALIGNMENT, ENTITY_NAME } from '../constants';

class Player extends Entity {
  constructor(
    x,
    y,
    game,
    stats = {
      name: ENTITY_NAME.PLAYER,
      alignment: ALIGNMENT.PLAYER,
      char: '☺︎',
      wounds: 4,
      weaponSkill: 3,
      strength: 3,
      toughness: 3,
      armourSave: 5,
    },
  ) {
    super(x, y, game, stats);

    this.keyMap = {
      38: 0,
      33: 1,
      39: 2,
      34: 3,
      40: 4,
      35: 5,
      37: 6,
      36: 7,
    };

    this._draw();
  }

  _draw() {
    this._updateVisibility();
    super.draw();
  }

  act() {
    this.game.engine.lock();
    this.ref = this.handleEvent.bind(this);
    window.addEventListener('keydown', this.ref);
  }

  takeDamage(amount) {
    super.takeDamage(amount);
    this.game.displayStats(this.stats);
  }

  handleEvent(e) {
    if (!(e.keyCode in this.keyMap)) return;
    e.preventDefault();

    const dir = DIRS[8][this.keyMap[e.keyCode]];
    const newX = this._x + dir[0];
    const newY = this._y + dir[1];
    const newLocation = formatCoords(newX, newY);

    // const onExit =
    //   this.game.currentLevel.exit &&
    //   newLocation === this.game.currentLevel.exit[0];

    // Don't allow movement if the new location is outside the map
    if (!(newLocation in this.game.currentLevel.map)) return;

    // if there's a mob in the new location, attack it instead of moving
    if (
      newLocation in this.game.currentLevel.entityLocals &&
      this.game.currentLevel.entityLocals[newLocation] instanceof Mob
    ) {
      const mob = this.game.currentLevel.entityLocals[newLocation];

      this.attack(mob);
      window.removeEventListener('keydown', this.ref);
      this.game.engine.unlock();
      return;
    }

    // this.game.display.draw(this.x, this.y, this.game.currentLevel.map[formatCoords(this.x, this.y)]);
    delete this.game.currentLevel.entityLocals[formatCoords(this.x, this.y)];
    this.x = newX;
    this.y = newY;
    this.game.currentLevel.entityLocals[formatCoords(this.x, this.y)] = this;
    this._draw();

    window.removeEventListener('keydown', this.ref);
    this.game.engine.unlock();
  }

  _updateVisibility() {
    this.game.currentLevel.redraw();
    // returns true if light is able to pass through
    function lightPasses(x, y) {
      const key = formatCoords(x, y);
      return key in this.game.currentLevel.map;
    }

    const fov = new FOV.PreciseShadowcasting(lightPasses.bind(this));
    // output callback
    fov.compute(
      this.x,
      this.y,
      5,
      function (x, y, r, visibility) {
        const mapChar = this.game.currentLevel.map[formatCoords(x, y)];

        let char;
        if (r) {
          if (mapChar) {
            char = mapChar;
          } else {
            char = '';
          }
        } else {
          char = this.char;
        }

        const color = mapChar ? '#660' : '';
        this.game.display.draw(x, y, char, '#fff', color);
      }.bind(this),
    );
  }

  static create(game, freeCells) {
    const [x, y] = numParse(freeCells.splice(0, 1)[0].split(','));
    return new Player(x, y, game);
  }
}

export default Player;
