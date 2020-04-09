import Game from './entities/Game';

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM CONTENT LOADED");
  const game = new Game();
  game.init();
});