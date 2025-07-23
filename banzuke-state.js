// Banzuke State Management - Proper state serialization without innerHTML

// Extract state from the banzuke tables
export function extractBanzukeState() {
  const state = {
    oldBanzuke: extractTableState('#banzuke1'),
    newBanzuke: extractTableState('#banzuke2'),
    rikishiCount: document.getElementById('makRik')?.textContent || '0',
    tableTitles: Array.from(document.getElementsByClassName('tableTitle')).map(
      (el) => el.textContent
    )
  };
  return state;
}

// Extract state from a single table
function extractTableState(selector) {
  const table = document.querySelector(selector);
  if (!table) return null;

  const tbody = table.querySelector('tbody');
  if (!tbody) return null;

  const rows = [];
  for (const tr of tbody.querySelectorAll('tr')) {
    const row = {
      className: tr.className,
      cells: []
    };

    for (const cell of tr.querySelectorAll('td, th')) {
      const cellData = {
        tagName: cell.tagName.toLowerCase(),
        className: cell.className,
        textContent: cell.textContent,
        innerHTML: cell.innerHTML, // For change column links only
        rikishi: []
      };

      // Extract rikishi data
      for (const rikishi of cell.querySelectorAll('.rikishi-drag')) {
        cellData.rikishi.push({
          id: rikishi.id,
          dataset: { ...rikishi.dataset },
          textContent: rikishi.textContent,
          className: rikishi.className,
          style: {
            display: rikishi.style.display
          }
        });
      }

      row.cells.push(cellData);
    }

    rows.push(row);
  }

  return rows;
}

// Restore state to the banzuke tables
export function restoreBanzukeState(state) {
  if (!state) return;

  // Restore table titles
  if (state.tableTitles) {
    const titles = document.getElementsByClassName('tableTitle');
    state.tableTitles.forEach((title, index) => {
      if (titles[index]) {
        titles[index].textContent = title;
      }
    });
  }

  // Restore rikishi count
  const counter = document.getElementById('makRik');
  if (counter && state.rikishiCount) {
    counter.textContent = state.rikishiCount;
  }

  // Restore tables
  restoreTableState('#banzuke1', state.oldBanzuke);
  restoreTableState('#banzuke2', state.newBanzuke);

  // Re-enable REDIPS functionality on restored elements
  if (window.REDIPS?.drag) {
    window.REDIPS.drag.init();
  }
}

// Restore state to a single table
function restoreTableState(selector, tableState) {
  if (!tableState) return;

  const table = document.querySelector(selector);
  if (!table) return;

  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  // Clear existing tbody
  tbody.innerHTML = '';

  // Rebuild table from state
  for (const rowData of tableState) {
    const tr = document.createElement('tr');
    tr.className = rowData.className;

    for (const cellData of rowData.cells) {
      const cell = document.createElement(cellData.tagName);
      cell.className = cellData.className;

      // Handle change column cells specially (they contain links)
      if (cellData.className === 'ch' && cellData.innerHTML !== ' ') {
        cell.innerHTML = cellData.innerHTML;
      } else if (cellData.tagName === 'th' && !cellData.className.includes('divider')) {
        // Regular header cells
        cell.textContent = cellData.textContent;
      } else if (cellData.tagName === 'th' && cellData.className.includes('divider')) {
        // Divider cells
        if (cellData.className.includes('colspan')) {
          const colspan = cellData.className.match(/colspan-(\d+)/);
          if (colspan) {
            cell.colSpan = Number.parseInt(colspan[1]);
          }
        } else {
          // Default colspan based on table type
          cell.colSpan = selector === '#banzuke1' ? 3 : 5;
        }
      }

      // Restore rikishi in this cell
      for (const rikishiData of cellData.rikishi) {
        const rikishi = createRikishiElement(rikishiData);
        cell.appendChild(rikishi);
      }

      // Apply any special styles
      if (cellData.className.includes('redips-only') && cellData.rikishi.length > 0) {
        cell.style.border = 'none';
      } else if (cellData.className.includes('b2') && cellData.rikishi.length === 0) {
        cell.style.border = '1px dashed dimgray';
      }

      tr.appendChild(cell);
    }

    tbody.appendChild(tr);
  }
}

// Create a rikishi element from saved data
function createRikishiElement(rikishiData) {
  const div = document.createElement('div');
  div.id = rikishiData.id;
  div.className = rikishiData.className;
  div.textContent = rikishiData.textContent;

  // Restore dataset
  for (const [key, value] of Object.entries(rikishiData.dataset)) {
    div.dataset[key] = value;
  }

  // Restore styles
  if (rikishiData.style.display) {
    div.style.display = rikishiData.style.display;
  }

  return div;
}

// Save state to localStorage
export function saveBanzukeState() {
  const state = extractBanzukeState();
  localStorage.setItem('banzukeState', JSON.stringify(state));
}

// Load state from localStorage
export function loadBanzukeState() {
  const stateJson = localStorage.getItem('banzukeState');
  if (!stateJson) return null;

  try {
    return JSON.parse(stateJson);
  } catch (e) {
    console.error('Failed to parse saved state:', e);
    return null;
  }
}

// Check if saved state exists
export function hasSavedState() {
  return localStorage.getItem('banzukeState') !== null;
}

// Clear saved state
export function clearSavedState() {
  localStorage.removeItem('banzukeState');
}

// Migrate from old innerHTML-based storage
export function migrateFromInnerHTML() {
  const oldBanzuke = localStorage.getItem('banzuke');
  if (!oldBanzuke) return false;

  // Create a temporary container to parse the HTML
  const temp = document.createElement('div');
  temp.innerHTML = oldBanzuke;

  // Extract state from the parsed HTML
  const state = {
    oldBanzuke: extractTableStateFromElement(temp.querySelector('#banzuke1')),
    newBanzuke: extractTableStateFromElement(temp.querySelector('#banzuke2')),
    rikishiCount: temp.querySelector('#makRik')?.textContent || '0',
    tableTitles: Array.from(temp.getElementsByClassName('tableTitle')).map((el) => el.textContent)
  };

  // Save in new format
  localStorage.setItem('banzukeState', JSON.stringify(state));

  // Remove old format
  localStorage.removeItem('banzuke');

  return true;
}

// Helper to extract state from an element (for migration)
function extractTableStateFromElement(table) {
  if (!table) return null;

  const tbody = table.querySelector('tbody');
  if (!tbody) return null;

  const rows = [];
  for (const tr of tbody.querySelectorAll('tr')) {
    const row = {
      className: tr.className,
      cells: []
    };

    for (const cell of tr.querySelectorAll('td, th')) {
      const cellData = {
        tagName: cell.tagName.toLowerCase(),
        className: cell.className,
        textContent: cell.textContent,
        innerHTML: cell.innerHTML,
        rikishi: []
      };

      // Extract rikishi data
      for (const rikishi of cell.querySelectorAll('.rikishi-drag')) {
        cellData.rikishi.push({
          id: rikishi.id,
          dataset: { ...rikishi.dataset },
          textContent: rikishi.textContent,
          className: rikishi.className,
          style: {
            display: rikishi.style.display
          }
        });
      }

      row.cells.push(cellData);
    }

    rows.push(row);
  }

  return rows;
}
