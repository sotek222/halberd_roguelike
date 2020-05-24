const mobs = {
  rat: {
    name: "rat",
    weight: 8,
    char: "r",
    alignment: "neutral",
  },
  goblin: {
    name: "goblin",
    weight: 6,
    char: "g",
    alignment: "enemy"
  }, 
  orc: {
    name: "orc",
    weight: 4,
    char: "o",
    alignment: "enemy"
  },
  ogre: {
    name: "ogre",
    weight: 2,
    char: "O",
    alignment: "enemy"
  },
  guard: {
    name: "prison guard",
    weight: 5,
    char: "u",
    alignment: "enemy"
  },
  prisoner: {
    name: "human prisoner",
    weight: 6,
    char: "p",
    alignment: "neutral"
  }, 
  guardDog: {
    name: "guard dog",
    weight: 7,
    char: "d",
    alignment: "enemy"
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
