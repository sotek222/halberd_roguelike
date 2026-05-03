import { Scheduler, Engine, Display } from 'rot-js';
import { displayStats, displayText } from '../utils/textDisplay';
import Level from './Level';
import { Colors, GameModes } from '../constants';
import AudioEngine from './AudioEngine';

class Game {
  // =====================
  // Constructor
  // =====================
  //
  //
  //
  //
  //
  //
  //
  //
  //

  constructor(
    config = {
      mode: GameModes.live,
      options: {
        showGameMap: false,
      },
    },
  ) {
    this.config = config;
    // the Display class comes from rot.js
    // it creates a canvas element
    this.display = new Display();

    // this will hold all the levels of the game.
    this.levels = [new Level(this), new Level(this), new Level(this)];

    // used to track which level of the game we are on
    this.currentLevel = null;
    this.player = null;
    // This will store the game loop engine
    this.engine = null;
    this.scheduler = null;

    this.ae = new AudioEngine();

    // attaches the canvas element onto the dom
    document.addEventListener('DOMContentLoaded', () => {
      document
        .querySelector('#game-container')
        .insertAdjacentElement('beforeend', this.display.getContainer());
    });
  }

  // =====================
  // Instance Methods
  // =====================
  //
  //
  //
  //
  //
  //
  //
  //
  //

  init() {
    this.ae.backgroundMusic.play();

    // const initialLevel = new Level(this);
    const initialLevel = this.levels[0];

    // creates the first level and adds it to the levels array
    // this.levels.push(initialLevel);

    // sets the first level
    this.currentLevel = initialLevel;
    this.currentLevel.init();
    this.scheduler = new Scheduler.Simple();
    // adds the player to the scheduler
    // the second argument indicates that
    // the entity is a recurring event
    this.scheduler.add(this.player, true);

    // Add mobs to the scheduler
    for (const mob of this.currentLevel.mobs) {
      this.scheduler.add(mob, true);
    }

    // creates the game engine
    this.engine = new Engine(this.scheduler);
    this.engine.start();
  }

  goToNextLevel() {
    this.ae.soundEffects.descent.play();

    // first we clear the rendered map and entities from the previous level
    this.display.clear();

    // then we create the new level and set it to be the current level
    // const nextLevel = new Level(this);
    const nextLevel = this.levels[this.levels.indexOf(this.currentLevel) + 1];
    // this.levels.push(nextLevel);
    this.currentLevel = nextLevel;
    this.currentLevel.init();

    // RESET scheduler
    this.scheduler.clear();

    // re-add player
    this.scheduler.add(this.player, true);
  }

  addPlayer(player) {
    this.player = player;
    this.displayStats(this.player.stats);
  }

  displayText(text, color = Colors.white) {
    displayText(text, color);
  }

  displayStats(stats) {
    displayStats(stats);
  }

  devLog(...text) {
    if (!this.isDevMode()) return;

    this.displayText(`[DEV] ${text.join(' ')}`, Colors.violet);
  }

  // =====================
  // Instance Helper Methods
  // =====================
  //
  //
  //
  //
  //
  //
  //
  //
  //

  isLiveMode() {
    return this.config.mode === GameModes.live;
  }

  isDevMode() {
    return this.config.mode === GameModes.development;
  }
}

export default Game;
