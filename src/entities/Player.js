import { DIRS, FOV } from 'rot-js';
import Mob from './Mob';
import { formatCoords } from '../utils/helpers';

class Player {
  constructor(x, y, game, stats = {
    char: "☺︎",
    wounds: 4,
    strength: 3,
    toughness: 3
  }){
    this._x = x; 
    this._y = y;
    this.game = game;
    this._stats = stats;

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

    this._draw();
  }

  get x(){
    return this._x;
  }

  set x(arg){
    this._x = arg;
  }

  get y(){
    return this._y;
  }
  
  set y(arg){
    this._y = arg;
  }

  get char(){
    return this._stats.char;
  }

  get wounds(){
    return this._stats.wounds;
  }

  get strength(){
    return this._stats.strength;
  }

  get toughness(){
    return this._stats.toughness;
  }

  _draw(){
    this._updateVisibility();
    this.game.display.draw(this.x, this.y, this.char, "#0f0");
  }
  
  act() {
    this.game.engine.lock();
    this.ref = this.handleEvent.bind(this);
    window.addEventListener('keydown', this.ref);
  }

  _attack(entity){
    this.game.display.drawText(0, 0, `you attack the ${entity.name} causing 1 damage!`);
    entity.takeDamage(1);
      // TODO: figure out a way to determine attack damage
  }

  handleEvent(e) {
    if (!(e.keyCode in this.keyMap)) return;
    e.preventDefault();

    const dir = DIRS[8][this.keyMap[e.keyCode]];
    const newX = this._x + dir[0];
    const newY = this._y + dir[1];
    const newLocation = formatCoords(newX, newY);
    if (!(newLocation in this.game.currentLevel.map)) return;
    if (newLocation in this.game.currentLevel.entityLocals && this.game.currentLevel.entityLocals[newLocation] instanceof Mob){
      this._attack(this.game.currentLevel.entityLocals[newLocation]);
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

  _updateVisibility(){
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

};

export default Player;