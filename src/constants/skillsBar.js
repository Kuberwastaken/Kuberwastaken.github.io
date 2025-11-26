import profileData from '../data/profile.json';

const generateSkillsHTML = () => {
  const categories = Object.entries(profileData.skills).map(([category, skills]) => `
    <div class="skill-category" data-category="${category}">
      <div class="skill-list">
        ${skills.map(skill => `
          <div class="skill-item" data-tooltip="${skill.desc}">${skill.name}</div>
        `).join('')}
      </div>
    </div>
  `).join('');

  return `
<div class="skills-container">
  <div class="skills-grid">
    ${categories}
  </div>
</div>

<style>
.skills-container {
  --primary-color: #56b494;
  --bg-color: #1e1e1e;
  --text-color: #56b494;
  
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.skill-category {
  background: rgba(30, 30, 30, 0.6);
  border-radius: 10px;
  padding: 20px;
  position: relative;
  overflow: visible;
  border: 1px solid rgba(86, 180, 148, 0.2);
  transition: all 0.3s ease;
}

.skill-category:hover {
  box-shadow: 0 0 15px rgba(86, 180, 148, 0.2);
  border-color: rgba(86, 180, 148, 0.4);
}

.skill-category::after {
  content: attr(data-category);
  position: absolute;
  bottom: 10px;
  right: 15px;
  color: rgba(86, 180, 148, 0.3);
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-item {
  color: var(--text-color);
  padding: 8px 12px;
  border-radius: 5px;
  position: relative;
  cursor: default;
  transition: all 0.3s ease;
  z-index: 1;
}

.skill-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(86, 180, 148, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.skill-item:hover::before {
  opacity: 1;
}

.skill-item:hover {
  transform: translateX(10px);
  color: white;
  z-index: 20;
}

/* Tooltip */
.skill-item {
  position: relative;
}

.skill-item::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 0;
  transform: translateY(-10px);
  opacity: 0;
  background: var(--bg-color);
  color: var(--primary-color);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.7em;
  white-space: nowrap;
  pointer-events: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(86, 180, 148, 0.2);
  z-index: 10;
  min-width: 200px;
}

.skill-item:hover::after {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 600px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
  
  .skill-item::after {
    display: none; /* Completely removes tooltips on mobile */
  }
}
</style>`;
};

const skillsBar = generateSkillsHTML();

export default skillsBar;