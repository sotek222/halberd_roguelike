import { Path } from 'rot-js';

class Mob {
  constructor(x, y, game, char = "⚉"){
    this._x = x;
    this._y = y;
    this.game = game;
    this.char = char;
    this._draw();
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  _draw() {
    this.game.display.draw(this.x, this.y, this.char, "#f00");
  }

  act(){
    // Get the players current coords
    let x = this.game.player.x;
    let y = this.game.player.y;

    // while generating a path this 
    // callback is used to determine when a wall is hit
    function checkIfInMap(x, y){
      return (x + "," + y in this.game.currentLevel.map);
    };

    // Path generating algorithm
    const astar = new Path.AStar(x, y, checkIfInMap.bind(this), { topology: 4 });
    const path = [];

    function addToPath(x, y){
      path.push([x, y]);
    };


    astar.compute(this._x, this._y, addToPath);
    // the mobs current position is also in the path 
    // so we remove the first coordinates 
    path.shift();

    if (path.length == 1) {
      console.log("Game over")
      // location.reload();
      this.game.engine.lock();
    } else {
      x = path[0][0];
      y = path[0][1];
      this.game.display.draw(this._x, this._y, this.game.currentLevel.map[this._x + "," + this._y]);
      this._x = x;
      this._y = y;
      this._draw();
    };

  }
};

export default Mob;
