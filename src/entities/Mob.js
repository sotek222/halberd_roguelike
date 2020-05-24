import { Path, RNG, FOV } from 'rot-js';

class Mob {
  constructor(x, y, game, stats = {
    name: "unkown",
    alignment: "neutral",
    char: "⚉",
    strength: 2,
    toughness: 2,
    wounds: 1,
  }){
    this._x = x;
    this._y = y;
    this.game = game;
    this.fov = null;
    
    // --- characteristics --- 
    this.alignment = stats.alignment;
    this.char = stats.char;
    this.name = stats.name;

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
    this.updateVisibility();
    this.game.display.draw(this.x, this.y, this.char, this.color);
  }

  act(){
    switch (this.alignment) {
      case "enemy":
        if(this._playerIsInFOV()) {
          this._moveTowardsPlayer();
        } else {
          this._draw();
        };
        break;
      default:
        this._wander();
        break;
    }
  }

  updateVisibility() {
    // returns true if light is able to pass through 
    function lightPasses(x, y) {
      const key = x + "," + y;
      return key in this.game.currentLevel.map
    };
    const sight = {};

    const fov = new FOV.PreciseShadowcasting(lightPasses.bind(this));
    // output callback 
    fov.compute(this.x, this.y, 5, function (x, y, r, visibility) {
      if (r) {
        sight[x + "," + y] = true; 
      };
    }.bind(this));

    this.fov = sight;
  }



  _wander(){
    const radius = [
      // top left corner
      (this.x - 1) + "," + (this.y + 1),
      // top middle 
      this.x + "," + (this.y + 1),
      // top right corner
      (this.x + 1) + "," + (this.y + 1),
      // mid left
      (this.x - 1) + "," + this.y,
      // center
      this.x + "," + this.y,
      // mid right
      (this.x + 1) + "," + this.y, 
      // bottom left corner
      (this.x - 1) + "," + (this.y - 1),
      // bottom middle
      (this.x) + "," + (this.y - 1),
      // bottom right corner
      (this.x + 1) + "," + (this.y - 1)
    ]

    const randomPos = radius[Math.floor(RNG.getUniform() * radius.length)];
    const [newX, newY] = randomPos.split(",");

    if(this._checkIfInMap(newX, newY)){
      this.game.display.draw(this._x, this._y, this.game.currentLevel.map[this._x + "," + this._y]);
      delete this.game.currentLevel.entityLocals[this.x + "," + this.y];
      this._x = parseInt(newX);
      this._y = parseInt(newY);
      this.game.currentLevel.entityLocals[this._x + "," + this._y] = this;
      this._draw();
    } else {
      this._wander();
    };
  }
  
  _moveTowardsPlayer(){
    // Get the players current coords
    let x = this.game.player.x;
    let y = this.game.player.y;
    
    // Path generating algorithm
    const astar = new Path.AStar(x, y, this._checkIfInMap.bind(this), { topology: 4 });
    const path = [];
    
    function addToPath(x, y) {
      path.push([x, y]);
    };
    
    
    astar.compute(this._x, this._y, addToPath);
    // the mobs current position is also in the path 
    // so we remove the first coordinates 
    path.shift();
    if (path.length == 1) {
      this.game.display.drawText(0,0, `${this.name} attacks`)
      // TODO: When the enemy nears the player attack
      // console.log("Game over")
      // location.reload();
      // this.game.engine.lock();
    } else {
      x = path[0][0];
      y = path[0][1];

      // If there is another entity in the direction its moving 
      // dont let it move forward
      if (x + "," + y in this.game.currentLevel.entityLocals) return;

      // replace the current area with the tile 
      this.game.display.draw(this._x, this._y, this.game.currentLevel.map[this._x + "," + this._y]);

      // remove the entity from its current position
      delete this.game.currentLevel.entityLocals[this.x + "," + this.y];
      // update the x and y of the entity
      this._x = x;
      this._y = y;
      // update the position in the object
      this.game.currentLevel.entityLocals[this._x + "," + this._y] = this;
      // redraw the entity
      this._draw();
    };
  }

  _playerIsInFOV(){
    return this.game.player.x + "," + this.game.player.y in this.fov;
  }


  _checkIfInMap(x, y) {
    return (x + "," + y in this.game.currentLevel.map);
  }
};

export default Mob;
