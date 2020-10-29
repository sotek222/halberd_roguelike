import { DIRS, FOV } from 'rot-js';
import Mob from './Mob';
import { formatCoords, numParse } from '../utils/helpers';
import Entity from './Entity';

class Player extends Entity {
  constructor(x, y, game, stats = {
    char: "☺︎",
    wounds: 4,
    weaponSkill: 3,
    strength: 3,
    toughness: 3,
    armourSave: 5
  }) {
    super(x, y, game, stats);

    this.keyMap = {
      '38': 0,
      '33': 1,
      '39': 2,
      '34': 3,
      '40': 4,
      '35': 5,
      '37': 6,
      '36': 7,
    };
    this.color = "#0f0";
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

  _attack(entity) {
    this.game.displayText(`you attack the ${entity.name}`, "green");
    super.attack(entity);
  }

  takeDamage(amount) {
    this.game.displayText(`You take ${amount} wound!`, "red");
    this.wounds = this.wounds - amount;
    this.game.displayStats(this.stats);
    if (this.wounds <= 0) {
      this.game.displayText(`You are slain! Game Over :(`, "darkred");
      this.game.engine.lock();
    };
  }

  handleEvent(e) {
    if (!(e.keyCode in this.keyMap)) return;
    e.preventDefault();

    const dir = DIRS[8][this.keyMap[e.keyCode]];
    const newX = this._x + dir[0];
    const newY = this._y + dir[1];
    const newLocation = formatCoords(newX, newY);
    if (!(newLocation in this.game.currentLevel.map)) return;
    if (newLocation in this.game.currentLevel.entityLocals && this.game.currentLevel.entityLocals[newLocation] instanceof Mob) {
      this._attack(this.game.currentLevel.entityLocals[newLocation]);
      window.removeEventListener("keydown", this.ref)
      this.game.engine.unlock();
      return;
    }

    // this.game.display.draw(this.x, this.y, this.game.currentLevel.map[formatCoords(this.x, this.y)]);
    delete this.game.currentLevel.entityLocals[formatCoords(this.x, this.y)];
    this.x = newX;
    this.y = newY;
    this.game.currentLevel.entityLocals[formatCoords(this.x, this.y)] = this;
    this._draw();

    window.removeEventListener("keydown", this.ref)
    this.game.engine.unlock();
  }

  _updateVisibility() {
    this.game.currentLevel.redraw();
    // returns true if light is able to pass through 
    function lightPasses(x, y) {
      const key = formatCoords(x, y);
      return key in this.game.currentLevel.map
    };

    const fov = new FOV.PreciseShadowcasting(lightPasses.bind(this));
    // output callback 
    fov.compute(this.x, this.y, 5, function (x, y, r, visibility) {
      const mapChar = this.game.currentLevel.map[formatCoords(x, y)];

      let char;
      if (r) {
        if (mapChar) {
          char = mapChar
        } else {
          char = "";
        };
      } else {
        char = this.char;
      };

      const color = (mapChar ? "#660" : "");
      this.game.display.draw(x, y, char, "#fff", color);
    }.bind(this));
  }

  static create(game, freeCells) {
    const [x, y] = numParse(freeCells.splice(0, 1)[0].split(','));
    return new Player(x, y, game);
  }

};

export default Player;