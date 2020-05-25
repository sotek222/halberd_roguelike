import Player from '../../src/entities/Player';
import Game from '../../src/entities/Game';
import Mob from '../../src/entities/Mob';

let game;
let player;
let map;

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

  test('player has a character icon by default', () => {
    expect(player.char).not.toBeUndefined();
  });

  test('player has strength by default', () => {
    expect(player.strength).not.toBeUndefined();
  });

  test('player has toughness by default', () => {
    expect(player.toughness).not.toBeUndefined();
  });

  test('player has wounds by default', () => {
    expect(player.wounds).not.toBeUndefined();
  });
});

describe('Tests Player instance methods', () => {
  test('only arrow keys move the player', () => {
    const { x, y } = player;
    window.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 32 }));
    expect(player.x + "," + player.y).toEqual(x + "," + y);
  });

  test('player can attack an enemy', () => {
    const newMob = new Mob(player.x, player.y + 1, game);
    game.currentLevel.entityLocals[newMob.x + "," + newMob.y] = newMob;
    const spy = jest.spyOn(player, '_attack');
    window.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 40 }));
    expect(spy).toHaveBeenCalled();
  });

});

