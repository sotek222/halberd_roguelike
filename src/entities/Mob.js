import { Path, RNG } from 'rot-js';

class Mob {
  constructor(x, y, game, char = "⚉", alignment = "neutral"){
    this._x = x;
    this._y = y;
    this.game = game;
    this.char = char;

    this.alignment = alignment;

    switch (this.alignment) {
      case "ally":
        this.color = "#0ff";
        break;
      case "enemy":
        this.color = "#f00";
        break;
      default:
        this.color = "#ff0";
        break;
    }

    this._draw();
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  _draw() {
    this.game.display.draw(this.x, this.y, this.char, this.color);
  }

  act(){
    switch (this.alignment) {
      case "enemy":
        this._moveTowardsPlayer();
        break;
      default:
        this._wander();
        break;
    }
    

  }

  _wander(){
    const map = Object.keys(this.game.currentLevel.map);
    let [x, y] = map[Math.floor(RNG.getUniform() * map.length)];

    function checkIfInMap(x, y) {
      return (x + "," + y in this.game.currentLevel.map);
    };

    // Path generating algorithm
    const astar = new Path.AStar(x, y, checkIfInMap.bind(this), { topology: 4 });
    const path = [];

    function addToPath(x, y) {
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


  _moveTowardsPlayer(){
    // Get the players current coords
    let x = this.game.player.x;
    let y = this.game.player.y;

    // while generating a path this 
    // callback is used to determine when a wall is hit
    function checkIfInMap(x, y) {
      return (x + "," + y in this.game.currentLevel.map);
    };

    // Path generating algorithm
    const astar = new Path.AStar(x, y, checkIfInMap.bind(this), { topology: 4 });
    const path = [];

    function addToPath(x, y) {
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
