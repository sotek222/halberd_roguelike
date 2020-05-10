import { Map, RNG } from 'rot-js';
import Player from './Player';
import Mob from './Mob';
import numParse from '../utils/helpers';

class Level {
  constructor(game, tileSet){
    this.map = {};
    this.wall = {};
    this.game = game;
    this.player = null;
    this.enemies = [];
    // used to keep track of where the exit is located
    this.exit = null;
    this._generateMap();
  }

  _generateMap(){
    // Map comes from Rot.js and allows us to create dungeons
    const dungeon = new Map.Uniform();
    const freeCells = [];

    // this function is used to generate the walls of the dungeon
    function dungeonTileCreator(x, y, value){
      // value can be either 1 or 0
      if (value){
        const key = [x, y].join();
        this.wall[key] = " ";
        return;
      }

      const key = [x, y].join();
      // we push this key into freeCells so we know which spaces 
      // are part of the dungeon
      freeCells.push(key);
      this.map[key] = "⧈";
    };

    // the dungeon is an instance of Map.Uniform
    // the create method must take a callback
    // the callback is passed every x and y coordinate in the map
    // and a value. This is used to generate and store the values for 
    // the dungeon in our map and walls.
    dungeon.create(dungeonTileCreator.bind(this));
    // this method is used to actually render the map in the canvas
    this._generateWholeMap();
    // add the player to the level and the game as a whole
    this.game.addPlayer(this._createEntity(Player, freeCells));
    for (let i = 0; i < 5; i++) {
      const mob = this._createEntity(Mob, freeCells);
      this.enemies.push(mob);
    };
    // add the exit to the end of the map
    this._createExit(freeCells);
  }

  _generateWholeMap() {
    for (const key in this.map) {
      const [x, y] = numParse(key.split(","))
      this.game.display.draw(x, y, this.map[key]);
    }
    for(const key in this.wall) {
      const [x, y] = numParse(key.split(","))
      this.game.display.draw(x, y, this.wall[key]);
    }
  }

  _createEntity(Entity, freeCells){
    if (Entity.prototype === Player.prototype){
      const [x, y] = numParse(freeCells.splice(0, 1)[0].split(','))
      this.player = new Entity(x, y, this.game);
      return this.player;
    } else {
      const index = Math.floor(RNG.getUniform() * freeCells.length);
      // we use splice so that the space is now considered occupied
      const [x, y] = numParse(freeCells.splice(index, 1)[0].split(','))
      return new Entity(x, y, this.game);
    };
  }

  _createExit(freeCells){
    const lastSpace = freeCells.length - 1
    const exitSpace = freeCells.splice(lastSpace, 1);
    const [x, y] = numParse(exitSpace[0].split(','));
    this.map[x + "," + y] = "∏";
    this.exit = exitSpace;
    this.game.display.draw(x, y, "∏", "#f5f")
  }

};

export default Level;
