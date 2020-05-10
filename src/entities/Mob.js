class Mob {
  constructor(x, y, game, char = "☠︎"){
    this._x = x;
    this._y = y;
    this.game = game;
    this.char = char;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  _draw() {
    this.game.display.draw(this.x, this.y, this.char, "#ff0");
  }
};

export default Mob;