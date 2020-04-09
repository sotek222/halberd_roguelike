import { Map, RNG } from 'rot-js';
import Player from './Player';
import numParse from '../utils/helpers';

class Level {
  constructor(game){
    this.map = {};
    this.game = game;
    this.player = null;
    this._generateMap();
  }

  _generateMap(){
    const dungeon = new Map.Uniform();
    const freeCells = [];

    function dungeonTileCreator(x, y, value){
      // Value here refers to a wall space.
      if (value) return;

      const key = [x, y].join();
      freeCells.push(key);
      this.map[key] = ".";
    };

    dungeon.create(dungeonTileCreator.bind(this));
    this._generateWholeMap();
    const player = this._createEntity(Player, freeCells);
    this.game.addPlayer(player);

  }

  _generateWholeMap() {
    for (const key in this.map) {
      const [x, y] = numParse(key.split(","))
      this.game.display.draw(x, y, this.map[key]);
    }
  }

  _createEntity(Entity, freeCells){
    const location = freeCells.splice(0, 1)[0].split(",");
    const [x, y] = numParse(location)
    const entity = new Entity(x, y, this.game);

    if (entity instanceof Player) {
      this.player = entity;
    };

    return entity;
  }

};

export default Level;
