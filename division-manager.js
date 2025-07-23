// Division Manager Module - Manages dynamic division configuration using DOM manipulation

// Configuration key
const DIVISION_CONFIG_KEY = 'banzukeDivisionConfig';

// Default configuration for divisions
const DEFAULT_CONFIG = {
  oldBanzuke: {
    sanyaku: {
      Y: 1,
      O: 1,
      S: 1,
      K: 1
    },
    maegashira: 17,
    juryo: 14,
    makushita: 0,
    sandanme: 0,
    jonidan: 0,
    jonokuchi: 0
  },
  newBanzuke: {
    sanyaku: {
      Y: 2,
      O: 3,
      S: 2,
      K: 2
    },
    maegashira: 18,
    juryo: 14,
    makushita: 0,
    sandanme: 0,
    jonidan: 0,
    jonokuchi: 0
  }
};

// Get division counts
export function getDivisionCounts(banzukeType) {
  const config = getConfig();
  const banzuke = config[banzukeType];

  // Flatten sanyaku and other divisions
  return {
    Y: banzuke.sanyaku.Y,
    O: banzuke.sanyaku.O,
    S: banzuke.sanyaku.S,
    K: banzuke.sanyaku.K,
    M: banzuke.maegashira,
    J: banzuke.juryo,
    Ms: banzuke.makushita,
    Sd: banzuke.sandanme,
    Jd: banzuke.jonidan,
    Jk: banzuke.jonokuchi
  };
}

// Reset to default configuration
export function resetToDefault() {
  saveConfig(DEFAULT_CONFIG);
  return DEFAULT_CONFIG;
}

// Get current configuration
export function getConfig() {
  const stored = localStorage.getItem(DIVISION_CONFIG_KEY);
  return stored ? JSON.parse(stored) : { ...DEFAULT_CONFIG };
}

// Save configuration to localStorage
export function saveConfig(config) {
  localStorage.setItem(DIVISION_CONFIG_KEY, JSON.stringify(config));
}

// Helper function to create a division row
function createDivisionRow(rank, number, isOldBanzuke = true, isSanyaku = false) {
  const tr = document.createElement('tr');
  if (isSanyaku) {
    tr.className = 'san';
  }

  if (isOldBanzuke) {
    // Old banzuke format: east | rank | west
    const tdEast = document.createElement('td');
    tdEast.className = `redips-only ${rank}${number}e`;
    tr.appendChild(tdEast);

    const th = document.createElement('th');
    th.textContent = `${rank}${number}`;
    tr.appendChild(th);

    const tdWest = document.createElement('td');
    tdWest.className = `redips-only ${rank}${number}w`;
    tr.appendChild(tdWest);
  } else {
    // New banzuke format: change | east | rank | west | change
    const tdChange1 = document.createElement('td');
    tdChange1.className = 'ch';
    tdChange1.textContent = ' ';
    tr.appendChild(tdChange1);

    const tdEast = document.createElement('td');
    tdEast.className = 'redips-only b2';
    tr.appendChild(tdEast);

    const th = document.createElement('th');
    th.textContent = `${rank}${number}`;
    tr.appendChild(th);

    const tdWest = document.createElement('td');
    tdWest.className = 'redips-only b2';
    tr.appendChild(tdWest);

    const tdChange2 = document.createElement('td');
    tdChange2.className = 'ch';
    tdChange2.textContent = ' ';
    tr.appendChild(tdChange2);
  }

  return tr;
}

// Create divider row
function createDividerRow(colspan) {
  const tr = document.createElement('tr');
  const th = document.createElement('th');
  th.className = 'divider';
  th.colSpan = colspan;
  tr.appendChild(th);
  return tr;
}

// Create empty row
function createEmptyRow() {
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  tr.appendChild(td);
  return tr;
}

// Generate rows for a division
function generateDivisionRows(rank, count, isOldBanzuke = true, isSanyaku = false) {
  const rows = [];

  if (count === 0) return rows;

  for (let i = 1; i <= count; i++) {
    rows.push(createDivisionRow(rank, i, isOldBanzuke, isSanyaku));
  }

  return rows;
}

// Generate old banzuke rows with configuration
export function generateConfigurableOldBanzukeRows() {
  const config = getConfig();
  const fragment = document.createDocumentFragment();

  // Sanyaku ranks
  for (const [rank, count] of Object.entries(config.oldBanzuke.sanyaku)) {
    const rows = generateDivisionRows(rank, count, true, true);
    for (const row of rows) {
      fragment.appendChild(row);
    }
  }

  // Maegashira
  if (config.oldBanzuke.maegashira > 0) {
    fragment.appendChild(createEmptyRow()); // Empty line for spacing
    const rows = generateDivisionRows('M', config.oldBanzuke.maegashira, true, false);
    for (const row of rows) {
      fragment.appendChild(row);
    }
  }

  // Divider before Juryo
  fragment.appendChild(createDividerRow(3));

  // Lower divisions
  const lowerDivisions = ['juryo', 'makushita', 'sandanme', 'jonidan', 'jonokuchi'];
  const divisionRanks = {
    juryo: 'J',
    makushita: 'Ms',
    sandanme: 'Sd',
    jonidan: 'Jd',
    jonokuchi: 'Jk'
  };

  for (const [index, division] of lowerDivisions.entries()) {
    const count = config.oldBanzuke[division];
    if (count > 0) {
      if (index > 0 && config.oldBanzuke[lowerDivisions[index - 1]] > 0) {
        fragment.appendChild(createDividerRow(3));
      }
      const rows = generateDivisionRows(divisionRanks[division], count, true, false);
      for (const row of rows) {
        fragment.appendChild(row);
      }
    }
  }

  return fragment;
}

// Generate new banzuke rows with configuration
export function generateConfigurableNewBanzukeRows() {
  const config = getConfig();
  const fragment = document.createDocumentFragment();

  // Sanyaku ranks
  for (const [rank, count] of Object.entries(config.newBanzuke.sanyaku)) {
    const rows = generateDivisionRows(rank, count, false, true);
    for (const row of rows) {
      fragment.appendChild(row);
    }
  }

  // Maegashira
  if (config.newBanzuke.maegashira > 0) {
    fragment.appendChild(createEmptyRow()); // Empty line for spacing
    const rows = generateDivisionRows('M', config.newBanzuke.maegashira, false, false);
    for (const row of rows) {
      fragment.appendChild(row);
    }
  }

  // Divider before Juryo
  fragment.appendChild(createDividerRow(5));

  // Lower divisions
  const lowerDivisions = ['juryo', 'makushita', 'sandanme', 'jonidan', 'jonokuchi'];
  const divisionRanks = {
    juryo: 'J',
    makushita: 'Ms',
    sandanme: 'Sd',
    jonidan: 'Jd',
    jonokuchi: 'Jk'
  };

  for (const [index, division] of lowerDivisions.entries()) {
    const count = config.newBanzuke[division];
    if (count > 0) {
      if (index > 0 && config.newBanzuke[lowerDivisions[index - 1]] > 0) {
        fragment.appendChild(createDividerRow(5));
      }
      const rows = generateDivisionRows(divisionRanks[division], count, false, false);
      for (const row of rows) {
        fragment.appendChild(row);
      }
    }
  }

  return fragment;
}

// Add or remove rows from a division
export function updateDivisionCount(banzukeType, division, newCount) {
  const config = getConfig();
  const oldCount = config[banzukeType][division];

  if (division === 'sanyaku') {
    // Special handling for sanyaku sub-ranks
    return; // Handled by updateSanyakuCount
  }

  const validatedCount = Math.max(0, newCount);
  config[banzukeType][division] = validatedCount;
  saveConfig(config);

  // Update the specific division rows
  const tbody = document.querySelector(
    banzukeType === 'oldBanzuke' ? '#banzuke1 tbody' : '#banzuke2 tbody'
  );
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
    updateDivisionRows(tbody, rank, oldCount, validatedCount, banzukeType === 'oldBanzuke', false);
  }
}

// Update specific sanyaku rank count
export function updateSanyakuCount(banzukeType, rank, newCount) {
  const config = getConfig();
  const oldCount = config[banzukeType].sanyaku[rank];

  const validatedCount = Math.max(0, newCount);
  config[banzukeType].sanyaku[rank] = validatedCount;
  saveConfig(config);

  // Update the specific sanyaku rows
  const tbody = document.querySelector(
    banzukeType === 'oldBanzuke' ? '#banzuke1 tbody' : '#banzuke2 tbody'
  );
  if (tbody) {
    updateDivisionRows(tbody, rank, oldCount, validatedCount, banzukeType === 'oldBanzuke', true);
  }
}

// Add a division (set its count to default if it was 0)
export function addDivision(banzukeType, division) {
  const config = getConfig();
  const defaultCount = DEFAULT_CONFIG[banzukeType][division];

  if (config[banzukeType][division] === 0 && defaultCount > 0) {
    updateDivisionCount(banzukeType, division, defaultCount);
  }
}

// Remove a division (set its count to 0)
export function removeDivision(banzukeType, division) {
  updateDivisionCount(banzukeType, division, 0);
}

// Initialize division configuration
export function initializeDivisionManager() {
  // Load existing config or use default
  const config = getConfig();

  // Apply configuration to both tables
  const oldBanzukeTbody = document.querySelector('#banzuke1 tbody');
  const newBanzukeTbody = document.querySelector('#banzuke2 tbody');

  if (oldBanzukeTbody) {
    // Clear and rebuild old banzuke
    while (oldBanzukeTbody.firstChild) {
      oldBanzukeTbody.removeChild(oldBanzukeTbody.firstChild);
    }
    oldBanzukeTbody.appendChild(generateConfigurableOldBanzukeRows());
  }

  if (newBanzukeTbody) {
    // Clear and rebuild new banzuke
    while (newBanzukeTbody.firstChild) {
      newBanzukeTbody.removeChild(newBanzukeTbody.firstChild);
    }
    newBanzukeTbody.appendChild(generateConfigurableNewBanzukeRows());
  }

  return config;
}

// Update division rows in the DOM
function updateDivisionRows(tbody, rank, oldCount, newCount, isOldBanzuke, isSanyaku) {
  const rows = tbody.querySelectorAll('tr');

  if (newCount > oldCount) {
    // Adding rows
    let lastRowIndex = -1;
    let insertBefore = null;

    // Find where to insert new rows
    for (let i = 0; i < rows.length; i++) {
      const th = rows[i].querySelector('th');
      if (th?.textContent.startsWith(rank)) {
        // Keep going until we find the last row of this rank
        lastRowIndex = i;
      } else if (lastRowIndex !== -1) {
        // We've passed all rows of this rank
        insertBefore = rows[i];
        break;
      }
    }

    // Generate and insert new rows
    const startNum = oldCount + 1;
    for (let i = startNum; i <= newCount; i++) {
      const newRow = createDivisionRow(rank, i, isOldBanzuke, isSanyaku);
      if (insertBefore) {
        tbody.insertBefore(newRow, insertBefore);
      } else {
        tbody.appendChild(newRow);
      }
    }
  } else if (newCount < oldCount) {
    // Removing rows
    let removedCount = 0;
    const toRemove = oldCount - newCount;

    // Remove rows from the end of this rank
    for (let i = rows.length - 1; i >= 0 && removedCount < toRemove; i--) {
      const th = rows[i].querySelector('th');
      if (th?.textContent.startsWith(rank)) {
        const num = Number.parseInt(th.textContent.slice(rank.length));
        if (num > newCount) {
          rows[i].remove();
          removedCount++;
        }
      }
    }
  }
}
