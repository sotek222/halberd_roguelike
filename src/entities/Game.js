import { Scheduler, Engine, Display } from 'rot-js';
import { displayStats, displayText } from '../utils/textDisplay';
import Level from './Level';

class Game {
  constructor() {
    // the Display class comes from rot.js
    // it creates a canvas element
    this.display = new Display();
    // used to track which level of the game we are on 
    this.currentLevel = null;
    this.player = null;
    // This will store the game loop engine
    this.engine = null;
    this.scheduler = null;

    // attaches the canvas element onto the dom
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelector('#game-container').insertAdjacentElement('beforeend', this.display.getContainer());
    })
  }

  init() {
    // sets the first level
    this.currentLevel = new Level(this);
    this.currentLevel.init();
    this.scheduler = new Scheduler.Simple();
    // adds the player to the scheduler
    // the second argument indicates that
    // the entity is a recurring event
    this.scheduler.add(this.player, true);
    for (const mob of this.currentLevel.mobs) {
      this.scheduler.add(mob, true);
    };
    // creates the game engine
    this.engine = new Engine(this.scheduler);
    this.engine.start();
  }

  addPlayer(player) {
    this.player = player;
    this.displayStats(this.player.stats);
  }

  displayText(text, color = "white") {
    displayText(text, color);
  }

  displayStats(stats) {
    displayStats(stats);
  }
};

export default Game;
