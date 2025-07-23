// Division Tables Module - Creates separate tables for each division

import { getConfig } from './division-manager.js';

// Create a single rank row
function createRankRow(rank, number, isOldBanzuke, isSanyaku) {
  const tr = document.createElement('tr');
  if (isSanyaku) {
    tr.className = 'san';
  }

  if (isOldBanzuke) {
    tr.innerHTML = `
      <td class="sortable-cell ${rank}${number}e"></td>
      <th>${rank}${number}</th>
      <td class="sortable-cell ${rank}${number}w"></td>
    `;
  } else {
    tr.innerHTML = `
      <td class="ch"> </td>
      <td class="sortable-cell b2 ${rank}${number}e"></td>
      <th>${rank}${number}</th>
      <td class="sortable-cell b2 ${rank}${number}w"></td>
      <td class="ch"> </td>
    `;
  }
  
  return tr;
}

// Create a division table
function createDivisionTable(divisionName, divisionId, rows, isOldBanzuke, totalSlots = 0) {
  const table = document.createElement('table');
  table.className = 'division-table';
  table.id = `${isOldBanzuke ? 'old' : 'new'}_${divisionId}`;
  
  // Create header
  const thead = document.createElement('thead');
  
  // Title row
  const titleRow = document.createElement('tr');
  const titleCell = document.createElement('th');
  titleCell.className = 'divisionTitle';
  titleCell.colSpan = isOldBanzuke ? 3 : 5;
  
  if (isOldBanzuke) {
    titleCell.textContent = divisionName;
  } else {
    titleCell.innerHTML = `${divisionName}: <span id="${divisionId}Counter" class="division-counter">0/${totalSlots}</span> placed`;
  }
  
  titleRow.appendChild(titleCell);
  thead.appendChild(titleRow);
  
  // Column headers
  const headerRow = document.createElement('tr');
  headerRow.className = 'theader';
  
  if (isOldBanzuke) {
    headerRow.innerHTML = '<th>East</th><th>Rank</th><th>West</th>';
  } else {
    headerRow.innerHTML = '<th class="chHead">Chg.</th><th>East</th><th>Rank</th><th>West</th><th class="chHead">Chg.</th>';
  }
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Create tbody with rows
  const tbody = document.createElement('tbody');
  rows.forEach(row => tbody.appendChild(row));
  table.appendChild(tbody);
  
  return table;
}

// Generate all tables for a banzuke side
export function generateDivisionTables(isOldBanzuke) {
  const config = getConfig();
  const banzukeConfig = isOldBanzuke ? config.oldBanzuke : config.newBanzuke;
  const tables = [];
  
  // Makuuchi section (Sanyaku + Maegashira)
  const makuuchiRows = [];
  let makuuchiSlots = 0;
  
  // Sanyaku
  const sanyakuOrder = ['Y', 'O', 'S', 'K'];
  for (const rank of sanyakuOrder) {
    const count = banzukeConfig.sanyaku[rank];
    for (let i = 1; i <= count; i++) {
      makuuchiRows.push(createRankRow(rank, i, isOldBanzuke, true));
      makuuchiSlots += 2; // East and West
    }
  }
  
  // Add empty row between sanyaku and maegashira if both exist
  if (makuuchiRows.length > 0 && banzukeConfig.maegashira > 0) {
    const emptyRow = document.createElement('tr');
    const emptyCell = document.createElement('td');
    emptyCell.colSpan = isOldBanzuke ? 3 : 5;
    emptyCell.innerHTML = '&nbsp;';
    emptyRow.appendChild(emptyCell);
    makuuchiRows.push(emptyRow);
  }
  
  // Maegashira
  for (let i = 1; i <= banzukeConfig.maegashira; i++) {
    makuuchiRows.push(createRankRow('M', i, isOldBanzuke, false));
    makuuchiSlots += 2;
  }
  
  // Create Makuuchi table if it has content
  if (makuuchiRows.length > 0) {
    const makuuchiTable = createDivisionTable('Makuuchi', 'makuuchi', makuuchiRows, isOldBanzuke, makuuchiSlots);
    tables.push(makuuchiTable);
  }
  
  // Lower divisions
  const lowerDivisions = [
    { key: 'juryo', name: 'Juryo', rank: 'J' },
    { key: 'makushita', name: 'Makushita', rank: 'Ms' },
    { key: 'sandanme', name: 'Sandanme', rank: 'Sd' },
    { key: 'jonidan', name: 'Jonidan', rank: 'Jd' },
    { key: 'jonokuchi', name: 'Jonokuchi', rank: 'Jk' }
  ];
  
  for (const division of lowerDivisions) {
    const count = banzukeConfig[division.key];
    if (count > 0) {
      const rows = [];
      for (let i = 1; i <= count; i++) {
        rows.push(createRankRow(division.rank, i, isOldBanzuke, false));
      }
      const table = createDivisionTable(division.name, division.key, rows, isOldBanzuke, count * 2);
      tables.push(table);
    }
  }
  
  return tables;
}

// Initialize division tables
export function initializeDivisionTables() {
  const oldContainer = document.getElementById('oldBanzukeContainer');
  const newContainer = document.getElementById('newBanzukeContainer');
  
  if (!oldContainer || !newContainer) {
    console.error('Banzuke containers not found');
    return;
  }
  
  // Clear existing content
  oldContainer.innerHTML = '';
  newContainer.innerHTML = '';
  
  // Generate and add tables
  const oldTables = generateDivisionTables(true);
  const newTables = generateDivisionTables(false);
  
  oldTables.forEach(table => oldContainer.appendChild(table));
  newTables.forEach(table => newContainer.appendChild(table));
}

// Update counter for a specific division
export function updateDivisionCounter(divisionId) {
  const counter = document.getElementById(`${divisionId}Counter`);
  if (!counter) return;
  
  const table = document.getElementById(`new_${divisionId}`);
  if (!table) return;
  
  const rikishiCount = table.querySelectorAll('.rikishi-drag').length;
  const match = counter.textContent.match(/(\d+)\/(\d+)/);
  if (match) {
    counter.textContent = `${rikishiCount}/${match[2]}`;
  }
}

// Update all division counters
export function updateAllDivisionCounters() {
  const divisions = ['makuuchi', 'juryo', 'makushita', 'sandanme', 'jonidan', 'jonokuchi'];
  
  divisions.forEach(division => {
    updateDivisionCounter(division);
  });
}