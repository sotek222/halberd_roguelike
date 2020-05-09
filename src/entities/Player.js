import { DIRS } from 'rot-js';

class Player {
  constructor(x, y, game, char = "☺︎"){
    this._x = x; 
    this._y = y;
    this.game = game;
    this.char = char
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

  get y(){
    return this._y;
  }

  _draw(){
    this.game.display.draw(this.x, this.y, this.char, "#ff0");
  }
  
  act() {
    this.game.engine.lock();
    this.ref = this.handleEvent.bind(this);
    window.addEventListener('keydown', this.ref);
  }

  handleEvent(e) {
    if (!(e.keyCode in this.keyMap)) return;
    e.preventDefault();


    const dir = DIRS[8][this.keyMap[e.keyCode]];
    const newX = this._x + dir[0];
    const newY = this._y + dir[1];
    const newLocation = newX + "," + newY;
    if (!(newLocation in this.game.currentLevel.map)) return;

    this.game.display.draw(this._x, this._y, this.game.currentLevel.map[`${this._x},${this._y}`]);
    this._x = newX;
    this._y = newY;
    this._draw();


    window.removeEventListener("keydown", this.ref)
    this.game.engine.unlock();
  }
};

export default Player;