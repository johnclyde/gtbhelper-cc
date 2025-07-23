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
  
  if (division === 'sanyaku') {
    // Special handling for sanyaku sub-ranks
    return; // Handled by updateSanyakuCount
  }
  
  config[banzukeType][division] = Math.max(0, newCount);
  saveConfig(config);
  
  // Regenerate tables
  regenerateTables();
}

// Update specific sanyaku rank count
export function updateSanyakuCount(banzukeType, rank, newCount) {
  const config = getConfig();
  config[banzukeType].sanyaku[rank] = Math.max(0, newCount);
  saveConfig(config);
  
  // Regenerate tables
  regenerateTables();
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
    
    config[banzukeType][division] = defaultCount;
    saveConfig(config);
    regenerateTables();
  }
}

// Remove a division (set its count to 0)
export function removeDivision(banzukeType, division) {
  const config = getConfig();
  config[banzukeType][division] = 0;
  saveConfig(config);
  regenerateTables();
}

// Reset to default configuration
export function resetToDefault() {
  localStorage.removeItem(DIVISION_CONFIG_KEY);
  regenerateTables();
}

// Regenerate both tables
function regenerateTables() {
  const oldBanzukeTbody = document.querySelector('#banzuke1 tbody');
  const newBanzukeTbody = document.querySelector('#banzuke2 tbody');
  
  if (oldBanzukeTbody) {
    oldBanzukeTbody.innerHTML = generateConfigurableOldBanzukeRows();
  }
  
  if (newBanzukeTbody) {
    newBanzukeTbody.innerHTML = generateConfigurableNewBanzukeRows();
  }
  
  // Note: Drag-drop needs to be reinitialized after table regeneration
  // This should be handled by the calling code
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

