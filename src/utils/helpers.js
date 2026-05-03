export const numParse = (arr) => arr.map((element) => parseInt(element));

export const formatCoords = (x, y) => [x, y].join();

export const getRollToHit = (attackerWeaponSkill, defenderWeaponSkill) => {
  if (defenderWeaponSkill > attackerWeaponSkill * 2) {
    return 5;
  } else if (defenderWeaponSkill < attackerWeaponSkill) {
    return 3;
  } else {
    return 4;
  }
};

export const getRollToWound = (attackerStrength, defenderToughness) => {
  if (attackerStrength + 4 <= defenderToughness) return 7;

  if (attackerStrength === defenderToughness) return 4;
  if (defenderToughness === attackerStrength + 1) return 5;
  if (defenderToughness === attackerStrength - 1) return 3;
  if (defenderToughness > attackerStrength + 1) return 6;
  if (defenderToughness < attackerStrength - 1) return 2;
};

export const getSavingThrow = (attackerStrength, defenderArmourSave) => {
  switch (attackerStrength) {
    case 4:
      return defenderArmourSave + 1;
      break;
    case 5:
      return defenderArmourSave + 2;
      break;
    case 6:
      return defenderArmourSave + 3;
      break;
    case 7:
      return defenderArmourSave + 4;
      break;
    case 8:
      return defenderArmourSave + 5;
      break;
    case 9:
      return defenderArmourSave + 6;
      break;
    case 10:
      return defenderArmourSave + 7;
      break;
    default:
      return defenderArmourSave;
      break;
  }
};

export const rollD6 = () => Math.floor(Math.random() * 6) + 1;
