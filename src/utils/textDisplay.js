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
}) => {
  const statsContainer = document.querySelector('.stats-container');
  statsContainer.innerHTML = '';
  statsContainer.insertAdjacentHTML(
    'beforeend',
    `
    <div
      class="stats-wrapper"
    >
      <table style="border-collapse: collapse; width: 100%; font-family: inherit;">
        <tr>
          <td colspan="2" style="border: 1px dashed #33ff33; padding: 0.25em; text-align: center; font-size: 1.25em;">STATS</td>
        </tr>
        <tr>
          <td class="stats-table-cell">Weapon Skill</td>
          <td class="stats-table-cell">${weaponSkill}</td>
        </tr>
        <tr>
          <td class="stats-table-cell">Strength</td>
          <td class="stats-table-cell">${strength}</td>
        </tr>
        <tr>
          <td class="stats-table-cell">Toughness</td>
          <td class="stats-table-cell">${toughness}</td>
        </tr>
        <tr>
          <td class="stats-table-cell">Armour Save</td>
          <td class="stats-table-cell">${armourSave}+</td>
        </tr>
        <tr>
          <td class="stats-table-cell">Wounds</td>
          <td class="stats-table-cell">${wounds}</td>
        </tr>
        <tr>
          <td class="stats-table-cell">XP</td>
          <td class="stats-table-cell">${xp}</td>
        </tr>
      </table>
      <button
        id="level-up-button"
        style="
          display: block;
          width: 100%;
          margin: 0.5em auto 0 auto;
          font-family: inherit;
          font-size: 1em;
          background: #222;
          color: #33ff33;
          border: 2px solid #888;
          border-radius: 2px;
          padding: 0.25em 0;
          cursor: pointer;
          letter-spacing: 1px;
          box-shadow: 0 0 4px #222;
          transition: background 0.2s, color 0.2s;
        "
        onmouseover="this.style.background='#333';this.style.color='#fff';"
        onmouseout="this.style.background='#222';this.style.color='#33ff33';"
      >
        Spend XP
      </button>
    </div>
    `,
  );
};
