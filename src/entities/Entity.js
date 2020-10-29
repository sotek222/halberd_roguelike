class Entity {
  constructor(x, y, game, stats = {
    name: "unkown",
    alignment: "neutral",
    char: "⚉",
    weaponSkill: 2,
    strength: 2,
    toughness: 2,
    armourSave: 7,
    wounds: 1,
  }) {

    this._x = x;
    this._y = y;

    this.game = game;
    this._stats = stats;

  }

  get x() {
    return this._x;
  }

  set x(arg) {
    this._x = arg;
  }

  get y() {
    return this._y;
  }

  set y(arg) {
    this._y = arg;
  }

  get name() {
    return this._stats.name;
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
    this.game.currentLevel.fightRoundOfCombat(this, entity);
  }
};

export default Entity;