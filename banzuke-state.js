// Banzuke State Management - Proper state serialization without innerHTML

// Extract state from the banzuke tables
export function extractBanzukeState() {
  const state = {
    oldBanzuke: extractAllTablesState('#oldBanzukeContainer'),
    newBanzuke: extractAllTablesState('#newBanzukeContainer'),
    mainTitles: {
      old: document.getElementById('oldBanzukeTitle')?.textContent || '',
      new: document.getElementById('newBanzukeTitle')?.textContent || ''
    }
  };
  return state;
}

// Extract state from all tables in a container
function extractAllTablesState(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;
  
  const tablesState = [];
  const tables = container.querySelectorAll('.division-table');
  
  for (const table of tables) {
    const tableState = {
      id: table.id,
      className: table.className,
      rows: extractTableRows(table)
    };
    tablesState.push(tableState);
  }
  
  return tablesState;
}

// Extract rows from a single table
function extractTableRows(table) {
  const tbody = table.querySelector('tbody');
  if (!tbody) return [];
  
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

  // Restore main titles
  if (state.mainTitles) {
    const oldTitle = document.getElementById('oldBanzukeTitle');
    const newTitle = document.getElementById('newBanzukeTitle');
    if (oldTitle) oldTitle.textContent = state.mainTitles.old;
    if (newTitle) newTitle.textContent = state.mainTitles.new;
  }

  // Restore tables - need to regenerate tables first
  import('./division-tables.js').then(module => {
    module.initializeDivisionTables();
    
    // Then restore state to the tables
    if (state.oldBanzuke) {
      restoreAllTablesState('#oldBanzukeContainer', state.oldBanzuke);
    }
    if (state.newBanzuke) {
      restoreAllTablesState('#newBanzukeContainer', state.newBanzuke);
    }
    
    // Update counters
    module.updateAllDivisionCounters();
    
    // Re-enable SortableJS functionality on restored elements
    if (window.initDragDrop) {
      window.initDragDrop();
    }
  });
}

// Restore state to all tables in a container
function restoreAllTablesState(containerSelector, tablesState) {
  if (!tablesState) return;
  
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  // For each saved table, find the matching table and restore its state
  for (const savedTable of tablesState) {
    const table = container.querySelector(`#${savedTable.id}`);
    if (table) {
      restoreTableRows(table, savedTable.rows);
    }
  }
}

// Restore rows to a single table
function restoreTableRows(table, rows) {
  if (!rows) return;
  
  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  // Rebuild rows from state
  for (const rowData of rows) {
    const tr = document.createElement('tr');
    tr.className = rowData.className;

    for (const cellData of rowData.cells) {
      const cell = document.createElement(cellData.tagName);
      cell.className = cellData.className;

      // Handle change column cells specially (they contain links)
      if (cellData.className.includes('ch') && cellData.innerHTML !== ' ') {
        cell.innerHTML = cellData.innerHTML;
      } else if (cellData.tagName === 'th') {
        // Regular header cells
        cell.textContent = cellData.textContent;
      } else if (cellData.colSpan) {
        cell.colSpan = cellData.colSpan;
      }

      // Restore rikishi in this cell
      for (const rikishiData of cellData.rikishi) {
        const rikishi = createRikishiElement(rikishiData);
        cell.appendChild(rikishi);
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
