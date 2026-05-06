export const displayText = (text, color) => {
  const textContainer = document.querySelector('.text-container');
  textContainer.insertAdjacentHTML(
    'beforeend',
    `
      <p class="text" style="color: ${color}">${text}</p>
    `,
  );
  textContainer.scrollTo({
    top: textContainer.scrollHeight,
    behavior: 'smooth',
  });
};

export const displayStats = ({
  armourSave,
  strength,
  toughness,
  wounds,
  weaponSkill,
  xp,
  xpMax = 100,
}) => {
  const statsContainer = document.querySelector('.stats-container');
  statsContainer.innerHTML = '';
  statsContainer.insertAdjacentHTML(
    'beforeend',
    `
    <div class="stat">Weapon Skill: ${weaponSkill}</div>
    <div class="stat">Strength: ${strength}</div>
    <div class="stat">Toughness: ${toughness}</div>
    <div class="stat">Armour Save: ${armourSave}+</div>
    <div class="stat">Wounds: ${wounds}</div>
    <div class="stat" style="margin-bottom: 0.5em;">XP:
      <div style="background: #222; border-radius: 4px; width: 100%; height: 18px; margin-top: 4px; overflow: hidden;">
        <div style="background: linear-gradient(90deg, #ffe066, #ffd700); height: 100%; width: ${Math.min(100, Math.round((xp / xpMax) * 100))}%; transition: width 0.3s; border-radius: 4px;"></div>
      </div>
      <span style="font-size: 0.9em;">${xp} / ${xpMax}</span>
    </div>
  `,
  );
};
