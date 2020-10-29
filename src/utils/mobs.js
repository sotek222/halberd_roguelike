const mobs = {
  rat: {
    weight: 8,
    stats: {
      name: "rat",
      alignment: "neutral",
      char: "r",
      weaponSkill: 2,
      strength: 1,
      toughness: 2,
      armourSave: 7,
      wounds: 1,
    }
  },
  goblin: {
    weight: 6,
    stats: {
      name: "goblin",
      alignment: "enemy",
      char: "g",
      weaponSkill: 2,
      strength: 2,
      toughness: 3,
      armourSave: 6,
      wounds: 1,
    }
  },
  orc: {
    weight: 4,
    stats: {
      name: "orc",
      alignment: "enemy",
      char: "o",
      weaponSkill: 3,
      strength: 3,
      toughness: 4,
      armourSave: 6,
      wounds: 2,
    }
  },
  ogre: {
    weight: 2,
    stats: {
      name: "ogre",
      char: "O",
      alignment: "enemy",
      weaponSkill: 3,
      strength: 4,
      toughness: 5,
      armourSave: 6,
      wounds: 3,
    }
  },
  guard: {
    weight: 5,
    stats: {
      name: "prison guard",
      alignment: "enemy",
      char: "u",
      weaponSkill: 3,
      strength: 3,
      toughness: 3,
      armourSave: 5,
      wounds: 2,
    }
  },
  prisoner: {
    weight: 6,
    stats: {
      name: "human prisoner",
      alignment: "neutral",
      char: "p",
      weaponSkill: 2,
      strength: 2,
      toughness: 2,
      armourSave: 7,
      wounds: 1,
    }
  },
  guardDog: {
    weight: 7,
    stats: {
      name: "guard dog",
      alignment: "enemy",
      char: "d",
      weaponSkill: 3,
      strength: 3,
      toughness: 3,
      armourSave: 7,
      wounds: 1,
    }
  }
};

const mobWeightMap = Object.keys(mobs).reduce((map, mob) => {
  map[mob] = mobs[mob].weight;
  return map;
}, {});


export {
  mobs,
  mobWeightMap
}
