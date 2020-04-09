import { Scheduler, Engine, Display } from 'rot-js';
import Level from './Level';

class Game {
  constructor(){
    this.display = new Display();
    this.currentLevel = null;
    this.player = null;
    this.engine = null;
    document.body.insertAdjacentElement('beforeend', this.display.getContainer());
  }

  init(){
    this.currentLevel = new Level(this);
    const scheduler = new Scheduler.Simple();
    scheduler.add(this.player, true);
    this.engine = new Engine(scheduler);
    this.engine.start();
  }

  addPlayer(player){
    this.player = player
  }
};

export default Game;