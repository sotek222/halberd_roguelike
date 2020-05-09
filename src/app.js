import Game from './entities/Game';

document.addEventListener('DOMContentLoaded', () => { 
  // When the document fully loads we create a new game instances
  // and initialize it
  const game = new Game();
  game.init();
});