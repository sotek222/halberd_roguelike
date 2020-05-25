function numParse(arr){
  return arr.map(element => parseInt(element));
};

function formatCoords(x, y){
  return x + "," + y;
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

function fightRoundOfCombat(attacker, defender) {
  if (defender.wounds <= 0) return;
  console.log(`The ${attacker.name} attacks the ${defender.name}`);

  const successfullyHit = rollD6() >= getRollToHit(attacker.weaponSkill, defender.weaponSkill);

  if (successfullyHit) {
    console.log(`The ${defender.name} is hit!`);
    const successfullyWounded = rollD6() >= getRollToWound(attacker.strength, defender.toughness);

    if (successfullyWounded) {
      const madeSave = rollD6() >= getSavingThrow(attacker.strength, defender.armourSave);
      if (madeSave) {
        console.log(`The ${attacker.name}'s attack bounces harmlessly off the ${defender.name}'s armour!`);
        return;
      } else {
        console.log(`The ${defender.name} has taken a wound!!!`);
        defender.wounds--;
      }

    } else {
      console.log(`The ${attacker.name} fails to wound the ${defender.name}`);
      return;
    }

  } else {
    console.log(`The ${attacker.name} misses!`);
    return;
  }
};

export {
  numParse,
  formatCoords
};