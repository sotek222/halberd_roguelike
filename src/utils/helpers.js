function numParse(arr) {
  return arr.map(element => parseInt(element));
};

function formatCoords(x, y) {
  return [x, y].join();
};

function getRollToHit(attackerWeaponSkill, defenderWeaponSkill) {
  if (defenderWeaponSkill > attackerWeaponSkill * 2) {
    return 5;
  } else if (defenderWeaponSkill < attackerWeaponSkill) {
    return 3;
  } else {
    return 4;
  };
};

function getRollToWound(attackerStrength, defenderToughness) {
  if (attackerStrength + 4 <= defenderToughness) return 7;

  if (attackerStrength === defenderToughness) return 4;
  if (defenderToughness === attackerStrength + 1) return 5;
  if (defenderToughness === attackerStrength - 1) return 3;
  if (defenderToughness > attackerStrength + 1) return 6;
  if (defenderToughness < attackerStrength - 1) return 2;
};

function getSavingThrow(attackerStrength, defenderArmourSave) {
  switch (attackerStrength) {
    case 4:
      defenderArmourSave + 1;
      break;
    case 5:
      defenderArmourSave + 2;
      break;
    case 6:
      defenderArmourSave + 3;
      break;
    case 7:
      defenderArmourSave + 4;
      break;
    case 8:
      defenderArmourSave + 5;
      break;
    case 9:
      defenderArmourSave + 6;
      break;
    case 10:
      defenderArmourSave + 7;
      break;
    default:
      return defenderArmourSave;
      break;
  }
}

function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
};

export {
  numParse,
  formatCoords,
  rollD6,
  getRollToHit,
  getRollToWound,
  getSavingThrow,
};