function displayText(text, color) {
  const textContainer = document.querySelector(".text-container");
  textContainer.insertAdjacentHTML('beforeend', `
      <p class="text" style="color: ${color}">${text}</p>
    `);
  textContainer.scrollTo({ top: textContainer.scrollHeight, behavior: "smooth" });
};

function displayStats({ armourSave, strength, toughness, wounds, weaponSkill }) {
  const statsContainer = document.querySelector('.stats-container');
  statsContainer.innerHTML = "";
  statsContainer.insertAdjacentHTML('beforeend', `
    <div class="stat">Weapon Skill: ${weaponSkill}</div>
    <div class="stat">Strength: ${strength}</div>
    <div class="stat">Toughness: ${toughness}</div>
    <div class="stat">Armour Save: ${armourSave}+</div>
    <div class="stat">Wounds: ${wounds}</div>
  `);
};

export {
  displayText,
  displayStats
}