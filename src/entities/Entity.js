import {
  ALIGNMENT,
  ALIGNMENT_COLOR_MAP,
  Chars,
  Colors,
  ENTITY_NAME,
} from '../constants';
import Player from './Player';

class Entity {
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
    x,
    y,
    game,
    stats = {
      name: 'unknown',
      alignment: ALIGNMENT.NEUTRAL,
      char: Chars.unknown,
      weaponSkill: 2,
      strength: 2,
      toughness: 2,
      armourSave: 7,
      wounds: 1,
    },
  ) {
    this._x = x;
    this._y = y;

    this.game = game;
    this._stats = stats;

    this.color = this.getEntityColor(this);
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

  get x() {
    return this._x;
  }

  set x(arg) {
    this.game.devLog(`Setting x to ${arg}`);
    this._x = arg;
  }

  get y() {
    return this._y;
  }

  set y(arg) {
    this.game.devLog(`Setting y to ${arg}`);
    this._y = arg;
  }

  get alignment() {
    return this._stats.alignment;
  }

  set alignment(newAlignment) {
    this._stats.alignment = newAlignment;
  }

  get stats() {
    return this._stats;
  }

  get name() {
    return this.isPlayer() ? 'you' : this._stats.name;
  }

  set name(newName) {
    this._stats.name = newName;
  }

  get char() {
    return this._stats.char;
  }

  get wounds() {
    return this._stats.wounds;
  }

  set wounds(amount) {
    this._stats.wounds = amount;
  }

  get weaponSkill() {
    return this._stats.weaponSkill;
  }

  get armourSave() {
    return this._stats.armourSave;
  }

  get strength() {
    return this._stats.strength;
  }

  get toughness() {
    return this._stats.toughness;
  }

  draw() {
    this.game.display.draw(this.x, this.y, this.char, this.color);
  }

  attack(entity) {
    const isPlayer = this.isPlayer();

    const attackText = isPlayer
      ? `You attack the ${entity.name}!`
      : `The ${this.name} attacks you!`;

    this.game.displayText(attackText, Colors.green);
    this.game.currentLevel.fightRoundOfCombat(this, entity);
    this.game.displayText('+'.repeat(10));
  }

  takeDamage(amount) {
    const isPlayer = this.isPlayer();

    const damageText = isPlayer
      ? `You take ${amount} wound${amount > 1 ? 's' : ''}!`
      : `The ${this.name} takes ${amount} wound${amount > 1 ? 's' : ''}!`;

    this.game.displayText(damageText, isPlayer ? 'red' : this.color);
    this.wounds = this.wounds - amount;

    if (this.wounds <= 0) {
      const deathText = isPlayer
        ? `You are slain! Game Over :(`
        : `The ${this.name} is slain!`;

      this.game.displayText(
        deathText,
        isPlayer ? Colors.darkred : Colors.lightgreen,
      );
      if (isPlayer) {
        this.game.engine.lock();
      } else {
        this._remove();
      }
    }
  }

  // =====================
  // Helper Methods
  // =====================
  //
  //
  //
  //
  //
  //
  //
  //

  getEntityColor(entity) {
    return ALIGNMENT_COLOR_MAP[entity.alignment] || '#fff';
  }

  isPlayer() {
    return this._stats.name === ENTITY_NAME.PLAYER;
  }
}

export default Entity;
