// Division Manager Module - Manages dynamic addition/removal of divisions and ranks

// Division definitions with default ranks
const DIVISIONS = {
  makuuchi: {
    name: 'Makuuchi',
    subDivisions: {
      sanyaku: [
        { rank: 'Y', name: 'Yokozuna', defaultCount: 1 },
        { rank: 'O', name: 'Ozeki', defaultCount: 1 },
        { rank: 'S', name: 'Sekiwake', defaultCount: 2 },
        { rank: 'K', name: 'Komusubi', defaultCount: 2 }
      ],
      maegashira: { rank: 'M', name: 'Maegashira', defaultCount: 17 }
    }
  },
  juryo: {
    name: 'Juryo',
    rank: 'J',
    defaultCount: 14
  },
  makushita: {
    name: 'Makushita',
    rank: 'Ms',
    defaultCount: 0  // Not shown by default
  },
  sandanme: {
    name: 'Sandanme',
    rank: 'Sd',
    defaultCount: 0  // Not shown by default
  },
  jonidan: {
    name: 'Jonidan',
    rank: 'Jd',
    defaultCount: 0  // Not shown by default
  },
  jonokuchi: {
    name: 'Jonokuchi',
    rank: 'Jk',
    defaultCount: 0  // Not shown by default
  }
};

// Storage key for division configuration
const DIVISION_CONFIG_KEY = 'divisionConfig';

// Default configuration
const DEFAULT_CONFIG = {
  oldBanzuke: {
    sanyaku: { Y: 1, O: 1, S: 2, K: 2 },
    maegashira: 17,
    juryo: 14,
    makushita: 0,
    sandanme: 0,
    jonidan: 0,
    jonokuchi: 0
  },
  newBanzuke: {
    sanyaku: { Y: 2, O: 3, S: 2, K: 2 },
    maegashira: 18,
    juryo: 14,
    makushita: 0,
    sandanme: 0,
    jonidan: 0,
    jonokuchi: 0
  }
};

// Get configuration from localStorage or use default
export function getConfig() {
  const stored = localStorage.getItem(DIVISION_CONFIG_KEY);
  return stored ? JSON.parse(stored) : { ...DEFAULT_CONFIG };
}

// Save configuration to localStorage
export function saveConfig(config) {
  localStorage.setItem(DIVISION_CONFIG_KEY, JSON.stringify(config));
}

// Generate rows for a division
function generateDivisionRows(rank, count, isOldBanzuke = true, isSanyaku = false) {
  const rows = [];
  
  if (count === 0) return rows;
  
  for (let i = 1; i <= count; i++) {
    if (isOldBanzuke) {
      const className = isSanyaku ? 'class="san"' : '';
      rows.push(`<tr ${className}><td class="redips-only ${rank}${i}e"></td><th>${rank}${i}</th><td class="redips-only ${rank}${i}w"></td></tr>`);
    } else {
      const className = isSanyaku ? 'class="san"' : '';
      rows.push(`<tr ${className}><td class="ch"> </td><td class="redips-only b2"></td><th>${rank}${i}</th><td class="redips-only b2"></td><td class="ch"> </td></tr>`);
    }
  }
  
  return rows;
}

// Generate old banzuke rows with configuration
export function generateConfigurableOldBanzukeRows() {
  const config = getConfig();
  const tbody = [];
  
  // Sanyaku ranks
  Object.entries(config.oldBanzuke.sanyaku).forEach(([rank, count]) => {
    tbody.push(...generateDivisionRows(rank, count, true, true));
  });
  
  // Maegashira
  if (config.oldBanzuke.maegashira > 0) {
    tbody.push(''); // Empty line for spacing
    tbody.push(...generateDivisionRows('M', config.oldBanzuke.maegashira, true, false));
  }
  
  // Divider before Juryo
  tbody.push('<tr><th class="divider" colspan="3"></th></tr>');
  
  // Lower divisions
  const lowerDivisions = ['juryo', 'makushita', 'sandanme', 'jonidan', 'jonokuchi'];
  const divisionRanks = { juryo: 'J', makushita: 'Ms', sandanme: 'Sd', jonidan: 'Jd', jonokuchi: 'Jk' };
  
  lowerDivisions.forEach((division, index) => {
    const count = config.oldBanzuke[division];
    if (count > 0) {
      if (index > 0 && config.oldBanzuke[lowerDivisions[index - 1]] > 0) {
        tbody.push('<tr><th class="divider" colspan="3"></th></tr>');
      }
      tbody.push(...generateDivisionRows(divisionRanks[division], count, true, false));
    }
  });
  
  return tbody.join('\n              ');
}

// Generate new banzuke rows with configuration
export function generateConfigurableNewBanzukeRows() {
  const config = getConfig();
  const tbody = [];
  
  // Sanyaku ranks
  Object.entries(config.newBanzuke.sanyaku).forEach(([rank, count]) => {
    tbody.push(...generateDivisionRows(rank, count, false, true));
  });
  
  // Maegashira
  if (config.newBanzuke.maegashira > 0) {
    tbody.push(''); // Empty line for spacing
    tbody.push(...generateDivisionRows('M', config.newBanzuke.maegashira, false, false));
  }
  
  // Divider before Juryo
  tbody.push('<tr><th class="divider" colspan="5"></th></tr>');
  
  // Lower divisions
  const lowerDivisions = ['juryo', 'makushita', 'sandanme', 'jonidan', 'jonokuchi'];
  const divisionRanks = { juryo: 'J', makushita: 'Ms', sandanme: 'Sd', jonidan: 'Jd', jonokuchi: 'Jk' };
  
  lowerDivisions.forEach((division, index) => {
    const count = config.newBanzuke[division];
    if (count > 0) {
      if (index > 0 && config.newBanzuke[lowerDivisions[index - 1]] > 0) {
        tbody.push('<tr><th class="divider" colspan="5"></th></tr>');
      }
      tbody.push(...generateDivisionRows(divisionRanks[division], count, false, false));
    }
  });
  
  return tbody.join('\n              ');
}

// Add or remove rows from a division
export function updateDivisionCount(banzukeType, division, newCount) {
  const config = getConfig();
  const oldCount = config[banzukeType][division];
  
  if (division === 'sanyaku') {
    // Special handling for sanyaku sub-ranks
    return; // Handled by updateSanyakuCount
  }
  
  newCount = Math.max(0, newCount);
  config[banzukeType][division] = newCount;
  saveConfig(config);
  
  // Update the specific division rows
  const tbody = document.querySelector(banzukeType === 'oldBanzuke' ? '#banzuke1 tbody' : '#banzuke2 tbody');
  if (tbody) {
    const rankMap = { 
      maegashira: 'M', 
      juryo: 'J', 
      makushita: 'Ms', 
      sandanme: 'Sd', 
      jonidan: 'Jd', 
      jonokuchi: 'Jk' 
    };
    const rank = rankMap[division];
    if (rank) {
      updateDivisionRows(tbody, rank, oldCount, newCount, banzukeType === 'oldBanzuke', false);
    }
  }
}

// Update specific sanyaku rank count
export function updateSanyakuCount(banzukeType, rank, newCount) {
  const config = getConfig();
  const oldCount = config[banzukeType].sanyaku[rank];
  
  newCount = Math.max(0, newCount);
  config[banzukeType].sanyaku[rank] = newCount;
  saveConfig(config);
  
  // Update the specific sanyaku rows
  const tbody = document.querySelector(banzukeType === 'oldBanzuke' ? '#banzuke1 tbody' : '#banzuke2 tbody');
  if (tbody) {
    updateDivisionRows(tbody, rank, oldCount, newCount, banzukeType === 'oldBanzuke', true);
  }
}

// Add a division (set its count to default if it was 0)
export function addDivision(banzukeType, division) {
  const config = getConfig();
  
  if (config[banzukeType][division] === 0) {
    // Use default count from DIVISIONS
    const defaultCount = division === 'makushita' ? 15 :
                        division === 'sandanme' ? 20 :
                        division === 'jonidan' ? 20 :
                        division === 'jonokuchi' ? 10 : 10;
    
    updateDivisionCount(banzukeType, division, defaultCount);
  }
}

// Remove a division (set its count to 0)
export function removeDivision(banzukeType, division) {
  updateDivisionCount(banzukeType, division, 0);
}

// Reset to default configuration
export function resetToDefault() {
  localStorage.removeItem(DIVISION_CONFIG_KEY);
  // For reset, we do need to regenerate everything
  window.location.reload();
}

// Add a single row to a table
function addRowToTable(tbody, rank, number, isOldBanzuke = true, isSanyaku = false) {
  const tr = document.createElement('tr');
  if (isSanyaku) tr.className = 'san';
  
  if (isOldBanzuke) {
    // Old banzuke: east cell, rank header, west cell
    const eastTd = document.createElement('td');
    eastTd.className = `redips-only ${rank}${number}e`;
    
    const rankTh = document.createElement('th');
    rankTh.textContent = `${rank}${number}`;
    
    const westTd = document.createElement('td');
    westTd.className = `redips-only ${rank}${number}w`;
    
    tr.appendChild(eastTd);
    tr.appendChild(rankTh);
    tr.appendChild(westTd);
  } else {
    // New banzuke: change, east, rank, west, change
    const ch1 = document.createElement('td');
    ch1.className = 'ch';
    ch1.innerHTML = ' ';
    
    const eastTd = document.createElement('td');
    eastTd.className = 'redips-only b2';
    
    const rankTh = document.createElement('th');
    rankTh.textContent = `${rank}${number}`;
    
    const westTd = document.createElement('td');
    westTd.className = 'redips-only b2';
    
    const ch2 = document.createElement('td');
    ch2.className = 'ch';
    ch2.innerHTML = ' ';
    
    tr.appendChild(ch1);
    tr.appendChild(eastTd);
    tr.appendChild(rankTh);
    tr.appendChild(westTd);
    tr.appendChild(ch2);
  }
  
  return tr;
}

// Update a specific division's rows
function updateDivisionRows(tbody, rank, oldCount, newCount, isOldBanzuke = true, isSanyaku = false) {
  if (newCount > oldCount) {
    // Add rows
    for (let i = oldCount + 1; i <= newCount; i++) {
      const row = addRowToTable(tbody, rank, i, isOldBanzuke, isSanyaku);
      // Find where to insert this row
      const rows = tbody.querySelectorAll('tr');
      let inserted = false;
      
      // Find the right position to insert
      for (let j = 0; j < rows.length; j++) {
        const th = rows[j].querySelector('th');
        if (th && th.textContent.startsWith(rank)) {
          // Keep going until we find the last row of this rank
          continue;
        } else if (th) {
          // Found a different rank, insert before it
          tbody.insertBefore(row, rows[j]);
          inserted = true;
          break;
        }
      }
      
      if (!inserted) {
        tbody.appendChild(row);
      }
    }
  } else if (newCount < oldCount) {
    // Remove rows
    for (let i = oldCount; i > newCount; i--) {
      const rowToRemove = tbody.querySelector(`th:contains("${rank}${i}")`)?.parentElement ||
                          Array.from(tbody.querySelectorAll('th')).find(th => th.textContent === `${rank}${i}`)?.parentElement;
      if (rowToRemove) {
        tbody.removeChild(rowToRemove);
      }
    }
  }
}

// Regenerate tables incrementally
function regenerateTables() {
  // This is now called on initial load only
  const oldBanzukeTbody = document.querySelector('#banzuke1 tbody');
  const newBanzukeTbody = document.querySelector('#banzuke2 tbody');
  
  if (oldBanzukeTbody) {
    oldBanzukeTbody.innerHTML = generateConfigurableOldBanzukeRows();
  }
  
  if (newBanzukeTbody) {
    newBanzukeTbody.innerHTML = generateConfigurableNewBanzukeRows();
  }
}

// Initialize with configurable tables
export function initializeConfigurableTables() {
  regenerateTables();
}

// Get current division counts for UI
export function getDivisionCounts() {
  const config = getConfig();
  return {
    oldBanzuke: {
      ...config.oldBanzuke.sanyaku,
      M: config.oldBanzuke.maegashira,
      J: config.oldBanzuke.juryo,
      Ms: config.oldBanzuke.makushita,
      Sd: config.oldBanzuke.sandanme,
      Jd: config.oldBanzuke.jonidan,
      Jk: config.oldBanzuke.jonokuchi
    },
    newBanzuke: {
      ...config.newBanzuke.sanyaku,
      M: config.newBanzuke.maegashira,
      J: config.newBanzuke.juryo,
      Ms: config.newBanzuke.makushita,
      Sd: config.newBanzuke.sandanme,
      Jd: config.newBanzuke.jonidan,
      Jk: config.newBanzuke.jonokuchi
    }
  };
}

