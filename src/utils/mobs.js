// TODO: floor-based spawn tables, rare variants, and bosses on set depths

import { ALIGNMENT, BEHAVIORS } from '../constants';

const { wander, guard, wait } = BEHAVIORS;

const mobs = {
  rat: {
    weight: 8,
    behaviors: [
      {
        name: wander,
        weight: 0.7,
      },
      {
        name: wait,
        weight: 0.3,
      },
    ],
    stats: {
      name: 'rat',
      alignment: ALIGNMENT.NEUTRAL,
      char: 'r',
      weaponSkill: 2,
      strength: 1,
      toughness: 2,
      armourSave: 7,
      wounds: 1,
    },
  },
  goblin: {
    weight: 6,
    behaviors: [
      {
        name: wander,
        weight: 0.5,
      },
      {
        name: wait,
        weight: 0.6,
      },
    ],
    stats: {
      name: 'goblin',
      alignment: ALIGNMENT.ENEMY,
      char: 'g',
      weaponSkill: 2,
      strength: 2,
      toughness: 3,
      armourSave: 6,
      wounds: 1,
    },
  },
  orc: {
    weight: 4,
    behaviors: [
      {
        name: wander,
        weight: 0.7,
      },
      {
        name: wait,
        weight: 0.3,
      },
    ],
    stats: {
      name: 'orc',
      alignment: ALIGNMENT.ENEMY,
      char: 'o',
      weaponSkill: 3,
      strength: 3,
      toughness: 4,
      armourSave: 6,
      wounds: 2,
    },
  },
  ogre: {
    weight: 2,
    behaviors: [
      {
        name: wander,
        weight: 0.7,
      },
      {
        name: wait,
        weight: 0.3,
      },
    ],
    stats: {
      name: 'ogre',
      char: 'O',
      alignment: ALIGNMENT.ENEMY,
      weaponSkill: 3,
      strength: 4,
      toughness: 5,
      armourSave: 6,
      wounds: 3,
    },
  },
  guard: {
    weight: 5,
    behaviors: [
      {
        name: guard,
        weight: 0.9,
      },
      {
        name: wander,
        weight: 0.1,
      },
    ],
    stats: {
      name: 'prison guard',
      alignment: ALIGNMENT.ENEMY,
      char: 'u',
      weaponSkill: 3,
      strength: 3,
      toughness: 3,
      armourSave: 5,
      wounds: 2,
    },
  },
  prisoner: {
    weight: 6,
    behaviors: [
      {
        name: wander,
        weight: 0.9,
      },
      {
        name: wait,
        weight: 0.1,
      },
    ],
    stats: {
      name: 'human prisoner',
      alignment: ALIGNMENT.NEUTRAL,
      char: 'p',
      weaponSkill: 2,
      strength: 2,
      toughness: 2,
      armourSave: 7,
      wounds: 1,
    },
  },
  guardDog: {
    weight: 7,
    behaviors: [
      {
        name: wander,
        weight: 0.8,
      },
      {
        name: guard,
        weight: 0.1,
      },
      {
        name: wait,
        weight: 0.1,
      },
    ],
    stats: {
      name: 'guard dog',
      alignment: ALIGNMENT.ENEMY,
      char: 'd',
      weaponSkill: 3,
      strength: 3,
      toughness: 3,
      armourSave: 7,
      wounds: 1,
    },
  },
};

const mobWeightMap = Object.keys(mobs).reduce((map, mob) => {
  map[mob] = mobs[mob].weight;
  return map;
}, {});

export { mobs, mobWeightMap };
