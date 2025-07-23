// SortableJS Drag and Drop Manager - Modern replacement for REDIPS

import { clearSavedState, saveBanzukeState } from './banzuke-state.js';
import { makeEditable, theSekitori } from './rikishi-names.js';

// Configuration
const config = {
  oldBanzukeSelector: 'td',
  newBanzukeClass: 'b2',
  changeColumnClass: 'ch',
  rikishiCounterId: 'makRik',
  dragClass: 'rikishi-drag',
  nodragClass: 'rikishi-nodrag',
  cellClass: 'sortable-cell'
};

// Store Sortable instances
const sortableInstances = new Map();

// Initialize drag and drop functionality
export function init() {
  // Mark all cells as sortable containers
  initializeCells();
  
  // Set up Sortable for each cell
  initializeSortable();
  
  // Set up event handlers
  setupEventHandlers();
  
  // Initialize editable rikishi names
  makeEditable();
}

// Initialize cells for sorting
function initializeCells() {
  // Old banzuke cells
  const oldCells = document.querySelectorAll('#banzuke1 tbody td');
  oldCells.forEach(cell => {
    if (!cell.classList.contains('ch')) {
      cell.classList.add(config.cellClass);
    }
  });
  
  // New banzuke cells
  const newCells = document.querySelectorAll('#banzuke2 tbody td');
  newCells.forEach(cell => {
    if (!cell.classList.contains('ch')) {
      cell.classList.add(config.cellClass);
    }
  });
}

// Initialize Sortable for each cell
function initializeSortable() {
  const cells = document.querySelectorAll(`.${config.cellClass}`);
  
  cells.forEach(cell => {
    const sortable = new Sortable(cell, {
      group: getSortableGroup(cell),
      animation: 150,
      draggable: `.${config.dragClass}`,
      filter: `.${config.nodragClass}`,
      preventOnFilter: false,
      
      onStart: function(evt) {
        evt.item.style.opacity = '0.5';
      },
      
      onEnd: function(evt) {
        evt.item.style.opacity = '';
        
        // Handle the drop
        handleDrop(evt.item, evt.from, evt.to);
      },
      
      onMove: function(evt) {
        // Check if move is allowed based on rank restrictions
        return checkMoveAllowed(evt.dragged, evt.to);
      }
    });
    
    sortableInstances.set(cell, sortable);
  });
}

// Get sortable group based on cell type and rank
function getSortableGroup(cell) {
  // For new banzuke cells (b2), allow all ranks
  if (cell.classList.contains(config.newBanzukeClass)) {
    return 'banzuke';
  }
  
  // For old banzuke cells, restrict by rank
  const rankClass = Array.from(cell.classList).find(c => c.match(/^[A-Z]+\d+[ew]$/));
  if (rankClass) {
    const rank = rankClass.match(/^[A-Z]+/)[0];
    return {
      name: rank,
      pull: true,
      put: [rank] // Only allow same rank back
    };
  }
  
  return 'banzuke';
}

// Check if move is allowed based on rank restrictions
function checkMoveAllowed(draggedElement, targetCell) {
  // Always allow moves to new banzuke
  if (targetCell.classList.contains(config.newBanzukeClass)) {
    return true;
  }
  
  // Check rank restrictions for old banzuke
  const draggedRank = draggedElement.id.match(/^[A-Z]+/)?.[0];
  const targetRankClass = Array.from(targetCell.classList).find(c => c.match(/^[A-Z]+\d+[ew]$/));
  
  if (draggedRank && targetRankClass) {
    const targetRank = targetRankClass.match(/^[A-Z]+/)[0];
    return draggedRank === targetRank;
  }
  
  return true;
}

// Handle drop event
function handleDrop(draggedElement, fromCell, toCell) {
  const isFromNew = fromCell.classList.contains(config.newBanzukeClass);
  const isToNew = toCell.classList.contains(config.newBanzukeClass);
  
  // Update visual states
  updateCellVisualState(fromCell, toCell, isFromNew, isToNew);
  
  // Update change column if needed
  if (isFromNew && fromCell.children.length === 0) {
    updateChangeColumn(fromCell, null);
  }
  
  if (isToNew) {
    const changeInfo = calculateRankChange(draggedElement, toCell);
    updateChangeDisplay(toCell, changeInfo);
  }
  
  // Save state
  saveBanzukeState();
}

// Update cell visual state based on movement
function updateCellVisualState(fromCell, toCell, isFromNew, isToNew) {
  if (!isFromNew && isToNew) {
    // Moving to new banzuke
    if (fromCell.children.length === 0) {
      fromCell.style.border = '1px dashed dimgray';
    }
    updateRikishiCount(1);
  } else if (isFromNew && !isToNew) {
    // Moving from new banzuke
    if (fromCell.children.length === 0) {
      fromCell.style.border = '1px dashed dimgray';
    }
    toCell.style.removeProperty('border');
    updateRikishiCount(-1);
  }
}

// Setup event handlers
function setupEventHandlers() {
  // Double-click handler
  document.addEventListener('dblclick', (e) => {
    const card = e.target.closest(`.${config.dragClass}`);
    if (!card) return;
    
    handleDoubleClick(card);
  });
  
  // Click handler for highlighting
  document.addEventListener('click', (e) => {
    const card = e.target.closest(`.${config.dragClass}`);
    if (!card) return;
    
    const cell = card.parentElement;
    if (cell) {
      cell.style.backgroundColor = 'lightblue';
      setTimeout(() => {
        cell.style.removeProperty('background-color');
      }, 500);
    }
  });
}

// Handle double-click on rikishi
function handleDoubleClick(draggedElement) {
  const currentCell = draggedElement.parentElement;
  const radioButtons = document.getElementsByTagName('input');
  
  if (radioButtons[0].checked) {
    // Open rikishi information page
    const rikishiURL = `https://sumodb.sumogames.de/Rikishi.aspx?r=${draggedElement.dataset.rid}`;
    window.open(rikishiURL, '_blank').focus();
  } else if (currentCell.classList.contains(config.newBanzukeClass)) {
    // Return rikishi to old banzuke
    returnToOldBanzuke(draggedElement, currentCell);
  }
}

// Return rikishi to old banzuke position
function returnToOldBanzuke(draggedElement, currentCell) {
  const rank = draggedElement.id;
  const oldBanzukeCells = document.querySelectorAll(`#banzuke1 tbody td.${rank}`);
  
  if (oldBanzukeCells.length > 0) {
    const targetCell = oldBanzukeCells[0];
    
    // Update change column before moving
    updateChangeColumn(currentCell, draggedElement);
    
    // Move the element
    targetCell.appendChild(draggedElement);
    
    // Update visual states
    if (currentCell.children.length === 0) {
      currentCell.style.border = '1px dashed dimgray';
    }
    targetCell.style.removeProperty('border');
    
    // Update counter
    updateRikishiCount(-1);
    
    // Save state
    saveBanzukeState();
  }
}

// Calculate rank change information
function calculateRankChange(draggedElement, targetCell) {
  const currentRank = draggedElement.id;
  const wins = draggedElement.innerText.split(' ')[2].split('-')[0];
  const targetRank = getTargetRank(targetCell);
  const changeSymbol = getChangeSymbol(currentRank, targetRank);
  
  return {
    currentRank: currentRank,
    targetRank: targetRank,
    wins: wins,
    symbol: changeSymbol
  };
}

// Get target rank from cell position
function getTargetRank(targetCell) {
  if (targetCell.previousSibling?.className === config.changeColumnClass) {
    return `${targetCell.nextSibling.textContent}e`;
  }
  if (targetCell.nextSibling?.className === config.changeColumnClass) {
    return `${targetCell.previousSibling.textContent}w`;
  }
  return '';
}

// Get rank change symbol
function getChangeSymbol(currentRank, targetRank) {
  const currentType = currentRank.charAt(0);
  const targetType = targetRank.charAt(0);
  
  // Handle Maegashira ranks
  if (targetType === 'M') {
    if (currentType === 'M') {
      return calculateMaegashiraChange(currentRank, targetRank);
    }
    if (currentType === 'J') {
      return ' ↑ ';
    }
    return ' ↓ ';
  }
  // Handle Juryo ranks
  if (targetType === 'J') {
    if (currentType === 'M') {
      return ' ↓ ';
    }
    if (currentType === 'J') {
      return '⇄';
    }
    return '!!!';
  }
  // Handle Sanyaku ranks
  if (currentType === 'M') {
    return ' ↑ ';
  }
  if (currentType === 'J') {
    return '!!!';
  }
  return '⇄';
}

// Calculate change between Maegashira ranks
function calculateMaegashiraChange(currentRank, targetRank) {
  let currentNum = Number.parseInt(currentRank.slice(1, -1));
  let targetNum = Number.parseInt(targetRank.slice(1, -1));
  
  // Add 0.5 for west ranks
  if (currentRank.slice(-1) === 'w') currentNum += 0.5;
  if (targetRank.slice(-1) === 'w') targetNum += 0.5;
  
  const change = currentNum - targetNum;
  
  if (change > 0) return `+${change}`;
  if (change === 0) return '─';
  return change.toString();
}

// Update change display in the change column
function updateChangeDisplay(targetCell, changeInfo) {
  const changeCell = getChangeCell(targetCell);
  if (!changeCell) return;
  
  const changeLink = createChangeLink(changeInfo);
  
  if (changeCell.textContent.trim() === '') {
    changeCell.innerHTML = changeLink;
    targetCell.style.border = 'none';
  } else {
    changeCell.innerHTML += '<br>' + changeLink;
  }
}

// Get the change cell for a target cell
function getChangeCell(targetCell) {
  if (targetCell.previousSibling?.className === config.changeColumnClass) {
    return targetCell.previousSibling;
  }
  if (targetCell.nextSibling?.className === config.changeColumnClass) {
    return targetCell.nextSibling;
  }
  return null;
}

// Create SumoDB query link for rank change
function createChangeLink(changeInfo) {
  const url = `https://sumodb.sumogames.de/Query.aspx?show_form=0&form1_rank=${changeInfo.currentRank}&form1_wins=${changeInfo.wins}&form1_year=193905-194401,194905-now&form2_highlight=on&form2_rank=${changeInfo.targetRank}`;
  
  return `<a href="${url}" target="_blank" title="Click to run a SumoDB query">${changeInfo.symbol}</a>`;
}

// Update change column when removing rikishi
function updateChangeColumn(cell, draggedElement) {
  const changeCell = getChangeCell(cell);
  if (!changeCell) return;
  
  if (!draggedElement || cell.children.length === 0) {
    // Clear change column
    changeCell.textContent = ' ';
    cell.style.border = '1px dashed dimgray';
  }
}

// Update rikishi count display
function updateRikishiCount(delta) {
  const counter = document.getElementById(config.rikishiCounterId);
  if (counter) {
    counter.textContent = Number.parseInt(counter.textContent) + delta;
  }
}

// Reset banzuke to initial state
export function reset() {
  if (!confirm('Reset the banzuke?')) {
    return;
  }
  
  const oldCells = document.querySelectorAll('#banzuke1 tbody td');
  const newCells = document.querySelectorAll(`.${config.newBanzukeClass}`);
  const changeCells = document.getElementsByClassName(config.changeColumnClass);
  
  // Clear localStorage and counter
  clearSavedState();
  window.localStorage.removeItem('banzuke'); // Clean up old format
  const counter = document.getElementById(config.rikishiCounterId);
  if (counter) counter.textContent = '0';
  
  // Move all rikishi back to old banzuke
  newCells.forEach((newCell, i) => {
    if (newCell.children.length > 0) {
      newCell.style.border = '1px dashed dimgray';
      if (changeCells[i]) {
        changeCells[i].textContent = ' ';
      }
      
      // Move each rikishi in this cell
      while (newCell.children.length > 0) {
        const rikishi = newCell.children[0];
        const rank = rikishi.id;
        
        // Find original position
        const targetCell = document.querySelector(`#banzuke1 tbody td.${rank}`);
        if (targetCell) {
          targetCell.appendChild(rikishi);
          targetCell.style.removeProperty('border');
        }
      }
    }
  });
}

// Reinitialize a specific card for drag functionality
export function reinitializeCard(card) {
  // With SortableJS, we just need to ensure the card has the right class
  if (card.classList.contains(config.nodragClass)) {
    card.classList.remove(config.nodragClass);
    card.classList.add(config.dragClass);
  }
}