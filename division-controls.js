// Division Controls Module - UI for managing divisions and ranks

import {
  addDivision,
  getDivisionCounts,
  removeDivision,
  resetToDefault,
  updateDivisionCount,
  updateSanyakuCount
} from './division-manager.js';

// Create control panel DOM
export function createControlPanel() {
  const panel = document.createElement('div');
  panel.id = 'division-controls';
  panel.style.cssText = 'margin: 20px; padding: 10px; border: 1px solid #ccc; background: #f5f5f5;';

  // Header with toggle
  const header = document.createElement('div');
  header.style.cssText =
    'display: flex; justify-content: space-between; align-items: center; cursor: pointer;';
  header.addEventListener('click', () => {
    const content = document.getElementById('division-panel-content');
    const toggle = document.getElementById('division-toggle');
    if (content) {
      if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▼';
        localStorage.setItem('divisionPanelExpanded', 'true');
      } else {
        content.style.display = 'none';
        toggle.textContent = '▶';
        localStorage.setItem('divisionPanelExpanded', 'false');
      }
    }
  });

  const title = document.createElement('h3');
  title.style.margin = '0';
  title.textContent = 'Division Management';

  const toggle = document.createElement('span');
  toggle.id = 'division-toggle';
  toggle.style.fontSize = '18px';
  toggle.textContent = '▶';

  header.appendChild(title);
  header.appendChild(toggle);

  // Content panel
  const content = document.createElement('div');
  content.id = 'division-panel-content';
  content.style.cssText = 'display: none; margin-top: 10px;';

  // Controls container
  const controlsContainer = document.createElement('div');
  controlsContainer.style.cssText = 'display: flex; gap: 20px;';

  // Old banzuke section
  const oldSection = document.createElement('div');
  const oldTitle = document.createElement('h4');
  oldTitle.textContent = 'Old Banzuke (Left)';
  const oldControls = document.createElement('div');
  oldControls.id = 'old-banzuke-controls';
  oldSection.appendChild(oldTitle);
  oldSection.appendChild(oldControls);

  // New banzuke section
  const newSection = document.createElement('div');
  const newTitle = document.createElement('h4');
  newTitle.textContent = 'New Banzuke (Right)';
  const newControls = document.createElement('div');
  newControls.id = 'new-banzuke-controls';
  newSection.appendChild(newTitle);
  newSection.appendChild(newControls);

  controlsContainer.appendChild(oldSection);
  controlsContainer.appendChild(newSection);

  // Reset button
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset to Default';
  resetBtn.style.marginTop = '10px';
  resetBtn.addEventListener('click', () => window.resetDivisions());

  content.appendChild(controlsContainer);
  content.appendChild(resetBtn);

  panel.appendChild(header);
  panel.appendChild(content);

  return panel;
}

// Create controls for a single rank
function createRankControl(banzukeType, rank, count, isSanyaku = false) {
  const div = document.createElement('div');
  div.style.cssText = 'margin: 5px 0; display: flex; align-items: center; gap: 5px;';

  const label = document.createElement('span');
  label.style.width = '40px';
  label.textContent = `${rank}:`;

  const decreaseBtn = document.createElement('button');
  decreaseBtn.textContent = '-';
  decreaseBtn.onclick = () => {
    const newCount = Math.max(0, count - 1);
    if (isSanyaku) {
      updateSanyakuCount(banzukeType, rank, newCount);
    } else if (rank === 'M') {
      updateDivisionCount(banzukeType, 'maegashira', newCount);
    } else {
      const divisionMap = {
        J: 'juryo',
        Ms: 'makushita',
        Sd: 'sandanme',
        Jd: 'jonidan',
        Jk: 'jonokuchi'
      };
      updateDivisionCount(banzukeType, divisionMap[rank], newCount);
    }
    updateControls();
  };

  const countSpan = document.createElement('span');
  countSpan.style.cssText = 'width: 30px; text-align: center;';
  countSpan.textContent = count;

  const increaseBtn = document.createElement('button');
  increaseBtn.textContent = '+';
  increaseBtn.onclick = () => {
    const newCount = count + 1;
    if (isSanyaku) {
      updateSanyakuCount(banzukeType, rank, newCount);
    } else if (rank === 'M') {
      updateDivisionCount(banzukeType, 'maegashira', newCount);
    } else {
      const divisionMap = {
        J: 'juryo',
        Ms: 'makushita',
        Sd: 'sandanme',
        Jd: 'jonidan',
        Jk: 'jonokuchi'
      };
      updateDivisionCount(banzukeType, divisionMap[rank], newCount);
    }
    updateControls();
  };

  div.appendChild(label);
  div.appendChild(decreaseBtn);
  div.appendChild(countSpan);
  div.appendChild(increaseBtn);

  // Add toggle button for lower divisions
  if (['Ms', 'Sd', 'Jd', 'Jk'].includes(rank)) {
    const divisionMap = { Ms: 'makushita', Sd: 'sandanme', Jd: 'jonidan', Jk: 'jonokuchi' };
    const toggleBtn = document.createElement('button');
    toggleBtn.style.marginLeft = '10px';
    toggleBtn.textContent = count === 0 ? 'Add' : 'Remove';
    toggleBtn.onclick = () => {
      if (count === 0) {
        addDivision(banzukeType, divisionMap[rank]);
      } else {
        removeDivision(banzukeType, divisionMap[rank]);
      }
      updateControls();
    };
    div.appendChild(toggleBtn);
  }

  return div;
}

// Update control panel with current counts
function updateControls() {
  const counts = getDivisionCounts();

  // Helper to create section
  function createSection(container, banzukeType, counts) {
    // Clear existing content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Sanyaku section
    const sanyakuDiv = document.createElement('div');
    const sanyakuLabel = document.createElement('strong');
    sanyakuLabel.textContent = 'Sanyaku:';
    sanyakuDiv.appendChild(sanyakuLabel);

    for (const rank of ['Y', 'O', 'S', 'K']) {
      sanyakuDiv.appendChild(createRankControl(banzukeType, rank, counts[rank], true));
    }
    container.appendChild(sanyakuDiv);

    // Maegashira
    container.appendChild(createRankControl(banzukeType, 'M', counts.M));

    // Lower divisions section
    const lowerDiv = document.createElement('div');
    const lowerLabel = document.createElement('strong');
    lowerLabel.textContent = 'Lower Divisions:';
    lowerDiv.appendChild(lowerLabel);

    for (const rank of ['J', 'Ms', 'Sd', 'Jd', 'Jk']) {
      lowerDiv.appendChild(createRankControl(banzukeType, rank, counts[rank]));
    }
    container.appendChild(lowerDiv);
  }

  // Update both containers
  const oldContainer = document.getElementById('old-banzuke-controls');
  if (oldContainer) {
    createSection(oldContainer, 'oldBanzuke', counts.oldBanzuke);
  }

  const newContainer = document.getElementById('new-banzuke-controls');
  if (newContainer) {
    createSection(newContainer, 'newBanzuke', counts.newBanzuke);
  }
}

// Initialize controls
export function initializeDivisionControls() {
  // Add control panel after header
  const header = document.querySelector('header');
  if (header) {
    const panel = createControlPanel();
    header.parentNode.insertBefore(panel, header.nextSibling);
    updateControls();
  }

  // Make functions available globally
  window.resetDivisions = () => {
    if (confirm('Reset all divisions to default?')) {
      resetToDefault();
      updateControls();
    }
  };

  window.toggleDivisionPanel = () => {
    const content = document.getElementById('division-panel-content');
    const toggle = document.getElementById('division-toggle');
    if (content) {
      if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▼';
        localStorage.setItem('divisionPanelExpanded', 'true');
      } else {
        content.style.display = 'none';
        toggle.textContent = '▶';
        localStorage.setItem('divisionPanelExpanded', 'false');
      }
    }
  };

  // Restore panel state
  if (localStorage.getItem('divisionPanelExpanded') === 'true') {
    const content = document.getElementById('division-panel-content');
    const toggle = document.getElementById('division-toggle');
    if (content && toggle) {
      content.style.display = 'block';
      toggle.textContent = '▼';
    }
  }
}
