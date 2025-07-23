// Division Controls Module - UI for managing divisions and ranks

import { 
  getDivisionCounts, 
  updateDivisionCount, 
  updateSanyakuCount,
  addDivision,
  removeDivision,
  resetToDefault
} from './division-manager.js';

// Create control panel HTML
export function createControlPanel() {
  const panel = document.createElement('div');
  panel.id = 'division-controls';
  panel.style.cssText = 'margin: 20px; padding: 10px; border: 1px solid #ccc; background: #f5f5f5;';
  
  panel.innerHTML = `
    <h3>Division Management</h3>
    <div style="display: flex; gap: 20px;">
      <div>
        <h4>Old Banzuke (Left)</h4>
        <div id="old-banzuke-controls"></div>
      </div>
      <div>
        <h4>New Banzuke (Right)</h4>
        <div id="new-banzuke-controls"></div>
      </div>
    </div>
    <button onclick="window.resetDivisions()" style="margin-top: 10px;">Reset to Default</button>
  `;
  
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
      const divisionMap = { J: 'juryo', Ms: 'makushita', Sd: 'sandanme', Jd: 'jonidan', Jk: 'jonokuchi' };
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
      const divisionMap = { J: 'juryo', Ms: 'makushita', Sd: 'sandanme', Jd: 'jonidan', Jk: 'jonokuchi' };
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
  
  // Update old banzuke controls
  const oldContainer = document.getElementById('old-banzuke-controls');
  if (oldContainer) {
    oldContainer.innerHTML = '';
    
    // Sanyaku
    const sanyakuDiv = document.createElement('div');
    sanyakuDiv.innerHTML = '<strong>Sanyaku:</strong>';
    ['Y', 'O', 'S', 'K'].forEach(rank => {
      sanyakuDiv.appendChild(createRankControl('oldBanzuke', rank, counts.oldBanzuke[rank], true));
    });
    oldContainer.appendChild(sanyakuDiv);
    
    // Maegashira
    oldContainer.appendChild(createRankControl('oldBanzuke', 'M', counts.oldBanzuke.M));
    
    // Lower divisions
    const lowerDiv = document.createElement('div');
    lowerDiv.innerHTML = '<strong>Lower Divisions:</strong>';
    ['J', 'Ms', 'Sd', 'Jd', 'Jk'].forEach(rank => {
      lowerDiv.appendChild(createRankControl('oldBanzuke', rank, counts.oldBanzuke[rank]));
    });
    oldContainer.appendChild(lowerDiv);
  }
  
  // Update new banzuke controls
  const newContainer = document.getElementById('new-banzuke-controls');
  if (newContainer) {
    newContainer.innerHTML = '';
    
    // Sanyaku
    const sanyakuDiv = document.createElement('div');
    sanyakuDiv.innerHTML = '<strong>Sanyaku:</strong>';
    ['Y', 'O', 'S', 'K'].forEach(rank => {
      sanyakuDiv.appendChild(createRankControl('newBanzuke', rank, counts.newBanzuke[rank], true));
    });
    newContainer.appendChild(sanyakuDiv);
    
    // Maegashira
    newContainer.appendChild(createRankControl('newBanzuke', 'M', counts.newBanzuke.M));
    
    // Lower divisions
    const lowerDiv = document.createElement('div');
    lowerDiv.innerHTML = '<strong>Lower Divisions:</strong>';
    ['J', 'Ms', 'Sd', 'Jd', 'Jk'].forEach(rank => {
      lowerDiv.appendChild(createRankControl('newBanzuke', rank, counts.newBanzuke[rank]));
    });
    newContainer.appendChild(lowerDiv);
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
  
  // Make reset function available globally
  window.resetDivisions = () => {
    if (confirm('Reset all divisions to default?')) {
      resetToDefault();
      updateControls();
    }
  };
}