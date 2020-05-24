import Player from '../../src/entities/Player';
import Game from '../../src/entities/Game';

let game;
let player;

beforeAll(() => {
  game = new Game();
  game.init();
  player = game.player;
});


describe('Tests player instance properties', () => {
  test('Player instance is a Player', () => {
    expect(player instanceof Player).toEqual(true);
  });

  test('player has x and y coords', () => {
    const { x, y } = player;

    expect(typeof x).toEqual('number');
    expect(typeof y).toEqual('number');
  });

  test('player has x and y coords that are on the map', () => {
    const { x, y } = player;
    const key = x + "," + y;
    const map = game.currentLevel.map;

    expect(key in map).toEqual(true);
  });

  test('player has a name by default', () => {
    expect(player.name).not.toBeNull()
  });

});

