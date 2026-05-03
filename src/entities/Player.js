import { DIRS, FOV } from 'rot-js';
import Mob from './Mob';
import { formatCoords, numParse } from '../utils/helpers';
import Entity from './Entity';
import { ALIGNMENT, Chars, Colors, ENTITY_NAME } from '../constants';

class Player extends Entity {
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

  constructor(
    x,
    y,
    game,
    stats = {
      name: ENTITY_NAME.PLAYER,
      alignment: ALIGNMENT.PLAYER,
      char: Chars.player,
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

    this.visible = {};
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

  act() {
    this.game.engine.lock();
    this.ref = this.handleEvent.bind(this);
    window.addEventListener('keydown', this.ref);
  }

  setNewStartingLocation(startingLocation) {
    const [x, y] = startingLocation;
    this.x = x;
    this.y = y;
  }

  handleEvent(e) {
    // if the key pressed isn't one of the movement keys, ignore it
    if (!(e.keyCode in this.keyMap)) return;
    e.preventDefault();

    const dir = DIRS[8][this.keyMap[e.keyCode]];
    const newX = this._x + dir[0];
    const newY = this._y + dir[1];
    const newLocation = formatCoords(newX, newY);

    this.game.devLog(`From ${formatCoords(this.x, this.y)} to ${newLocation}`);

    const onExit =
      this.game.currentLevel.exit &&
      newLocation === this.game.currentLevel.exit[0];

    if (onExit) {
      const lastLevel =
        this.game.levels[this.game.levels.length - 1] ===
        this.game.currentLevel;

      if (lastLevel) {
        this.game.displayText(
          'You have reached the end of the demo! Thanks for playing!',
          Colors.green,
        );
        this.game.ae.backgroundMusic.stop();
        this.game.ae.soundEffects.victory.play();
      } else {
        this.game.displayText('You descend to the next level...', Colors.red);
        this.game.goToNextLevel();
      }

      window.removeEventListener('keydown', this.ref);
      this.game.engine.unlock();
      return;
    }

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

  takeDamage(amount) {
    super.takeDamage(amount);
    this.game.displayStats(this.stats);
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

  _draw() {
    this._updateVisibility();
    super.draw();
  }

  // _updateVisibility() {
  //   this.game.currentLevel.redraw();
  //   // returns true if light is able to pass through
  //   function lightPasses(x, y) {
  //     const key = formatCoords(x, y);
  //     return key in this.game.currentLevel.map;
  //   }

  //   const fov = new FOV.PreciseShadowcasting(lightPasses.bind(this));
  //   // output callback
  //   fov.compute(
  //     this.x,
  //     this.y,
  //     5,
  //     function (x, y, r, visibility) {
  //       const mapChar = this.game.currentLevel.map[formatCoords(x, y)];

  //       let char;
  //       if (r) {
  //         if (mapChar) {
  //           char = mapChar;
  //         } else {
  //           char = '';
  //         }
  //       } else {
  //         char = this.char;
  //       }

  //       const color = mapChar ? '#660' : '';
  //       this.game.display.draw(x, y, char, '#fff', color);
  //     }.bind(this),
  //   );
  // }

  _updateVisibility() {
    const visible = {};

    function lightPasses(x, y) {
      const key = formatCoords(x, y);
      return key in this.game.currentLevel.map;
    }

    const fov = new FOV.PreciseShadowcasting(lightPasses.bind(this));

    // Compute FOV
    fov.compute(this.x, this.y, 5, (x, y, r, visibility) => {
      const key = formatCoords(x, y);
      visible[key] = true;

      // mark as explored
      this.game.currentLevel.explored[key] = true;
    });

    // render ONLY explored + visible
    for (const key in this.game.currentLevel.map) {
      if (!this.game.currentLevel.explored[key]) continue;

      const [x, y] = numParse(key.split(','));
      const isVisible = visible[key];

      const mapChar = this.game.currentLevel.map[key];

      let fg = isVisible ? '#fff' : '#666'; // dim if not visible
      let bg = isVisible ? '#660' : '';

      this.game.display.draw(x, y, mapChar, fg, bg);
    }

    // draw player LAST so it’s always visible
    this.game.display.draw(this.x, this.y, this.char, '#fff');
    this.visible = visible;
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

  static create(game, startingLocation) {
    const [x, y] = startingLocation;
    return new Player(x, y, game);
  }
}

export default Player;
