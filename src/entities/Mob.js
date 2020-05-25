import { Path, RNG, FOV } from 'rot-js';
import { formatCoords } from '../utils/helpers';

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
    this._stats = stats;

    switch (this._stats.alignment) {
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

  /* Attribute GETTERS && SETTERS */
  get x() {
    return this._x;
  }

  set x(arg) {
    this._x = arg;
  }

  get y() {
    return this._y;
  }

  set y(arg) {
    this._y = arg;
  }

  get alignment(){
    return this._stats.alignment;
  }

  get char(){
    return this._stats.char;
  }

  get name(){
    return this._stats.name;
  }

  get strength(){
    return this._stats.strength;
  }

  get toughness(){
    return this._stats.toughness;
  }

  get wounds(){
    return this._stats.wounds;
  }

  set wounds(amount){
    this._stats.wounds = amount;
  }

  /*  ACTIONS */ 
  _draw() {
    this._updateVisibility();
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

  _updateVisibility() {
    // returns true if light is able to pass through 
    function lightPasses(x, y) {
      const key = formatCoords(x, y);
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
      formatCoords(this.x - 1, this.y - 1),
      // top middle 
      formatCoords(this.x, this.y - 1),
      // top right corner
      formatCoords(this.x + 1,this.y - 1),
      // mid left
      formatCoords(this.x - 1, this.y),
      // center
      formatCoords(this.x, this.y),
      // mid right
      formatCoords(this.x + 1, this.y), 
      // bottom left corner
      formatCoords(this.x - 1,this.y + 1),
      // bottom middle
      formatCoords(this.x, this.y + 1),
      // bottom right corner
      formatCoords(this.x + 1, this.y + 1),
    ]

    const randomPos = radius[Math.floor(RNG.getUniform() * radius.length)];
    const [newX, newY] = randomPos.split(",");

    if(this._checkIfInMap(newX, newY)){
      this.game.display.draw(this.x, this.y, this.game.currentLevel.map[formatCoords(this.x, this.y)]);
      delete this.game.currentLevel.entityLocals[formatCoords(this.x, this.y)];
      this.x = parseInt(newX);
      this.y = parseInt(newY);
      this.game.currentLevel.entityLocals[formatCoords(this.x , this.y)] = this;
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
    
    
    astar.compute(this.x, this.y, addToPath);
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
      if (formatCoords(x, y) in this.game.currentLevel.entityLocals) return;

      // replace the current area with the tile 
      this.game.display.draw(this.x, this.y, this.game.currentLevel.map[formatCoords(this.x, this.y)]);

      // remove the entity from its current position
      delete this.game.currentLevel.entityLocals[formatCoords(this.x, this.y)];
      // update the x and y of the entity
      this.x = x;
      this.y = y;
      // update the position in the object
      this.game.currentLevel.entityLocals[formatCoords(this.x, this.y)] = this;
      // redraw the entity
      this._draw();
    };
  }

  takeDamage(amount){
    this.wounds = this.wounds - amount;
    if(this.wounds <= 0){
      this._remove();
    };
  }
  
  /* HELPERS */
  
  _remove(){
    this.game.scheduler.remove(this);
    this.game.display.draw(this.x, this.y, this.game.currentLevel.map[formatCoords(this.x, this.y)]);
    delete this.game.currentLevel.entityLocals[formatCoords(this.x, this.y)];
    this.game.currentLevel.removeMob(this);
  }

  _playerIsInFOV(){
    return formatCoords(this.game.player.x, this.game.player.y) in this.fov;
  }

  _checkIfInMap(x, y) {
    return (formatCoords(x, y) in this.game.currentLevel.map);
  }
};

export default Mob;
