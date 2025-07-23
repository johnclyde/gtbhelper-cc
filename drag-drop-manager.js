// Drag and Drop Manager - Clean abstraction over REDIPS library

import { clearSavedState, saveBanzukeState } from './banzuke-state.js';
import { makeEditable, theSekitori } from './rikishi-names.js';

// Private variables
let rd = null;
const config = {
  oldBanzukeSelector: 'td',
  newBanzukeClass: 'b2',
  changeColumnClass: 'ch',
  rikishiCounterId: 'makRik',
  tableLinerId: 'tableLiner'
};

// Initialize drag and drop functionality
export function init() {
  rd = REDIPS.drag;
  rd.init();

  // Configure REDIPS settings
  rd.animation = 'off';
  rd.hover.colorTd = 'yellow';
  rd.dropMode = 'multiple';
  rd.only.divClass.se = config.newBanzukeClass;

  // Set up rank restrictions
  setupRankRestrictions();

  // Set up event handlers
  setupEventHandlers();

  // Initialize editable rikishi names
  makeEditable();
}

// Set up rank-based movement restrictions
function setupRankRestrictions() {
  for (let i = 0; i < theSekitori.length; i++) {
    if (theSekitori[i] !== '') {
      const rank = theSekitori[i].split(' ')[0];
      rd.only.div[rank] = rank;
    }
  }
}

// Set up all event handlers
function setupEventHandlers() {
  rd.event.dblClicked = handleDoubleClick;
  rd.event.clicked = handleClick;
  rd.event.notMoved = handleNotMoved;
  rd.event.droppedBefore = handleDroppedBefore;
  rd.event.dropped = handleDropped;
  rd.event.finish = handleFinish;
}

// Handle double-click on rikishi
function handleDoubleClick() {
  const draggedElement = rd.obj;
  const currentCell = rd.findParent('TD', draggedElement);
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
  const oldBanzukeCells = document.getElementsByTagName(config.oldBanzukeSelector);

  for (let i = 0; i <= theSekitori.length; i++) {
    if (oldBanzukeCells[i]?.classList.contains(rank)) {
      updateChangeColumn(currentCell, draggedElement);

      rd.moveObject({
        obj: draggedElement,
        target: oldBanzukeCells[i],
        callback: () => {
          updateRikishiCount(-1);
          oldBanzukeCells[i].children[0].style.display = 'none';
          oldBanzukeCells[i].style.removeProperty('border');
          saveBanzukeState();
        }
      });
      break;
    }
  }
}

// Handle click on element
function handleClick(currentCell) {
  currentCell.style.backgroundColor = 'lightblue';
}

// Handle when element is clicked but not moved
function handleNotMoved() {
  const currentCell = rd.findParent('TD', rd.obj);
  currentCell.style.removeProperty('background-color');
}

// Handle before drop event
function handleDroppedBefore(targetCell) {
  const draggedElement = rd.obj;
  const currentCell = rd.findParent('TD', draggedElement);

  currentCell.style.removeProperty('background-color');

  // Update visual state based on movement direction
  updateCellVisualState(currentCell, targetCell);

  // Update change column if moving from new banzuke
  if (currentCell.classList.contains(config.newBanzukeClass)) {
    updateChangeColumn(currentCell, draggedElement);
  }
}

// Update cell visual state based on movement
function updateCellVisualState(currentCell, targetCell) {
  const isFromNew = currentCell.classList.contains(config.newBanzukeClass);
  const isToNew = targetCell.classList.contains(config.newBanzukeClass);

  if (!isFromNew && isToNew) {
    // Moving to new banzuke
    currentCell.children[0].style.display = 'block';
    currentCell.style.border = '1px dashed dimgray';
    updateRikishiCount(1);
  } else if (isFromNew && !isToNew) {
    // Moving from new banzuke
    targetCell.children[0].style.display = 'none';
    targetCell.style.removeProperty('border');
    updateRikishiCount(-1);
  }
}

// Handle dropped event
function handleDropped(targetCell) {
  if (!targetCell.classList.contains(config.newBanzukeClass)) {
    return;
  }

  const draggedElement = rd.obj;
  const changeInfo = calculateRankChange(draggedElement, targetCell);
  updateChangeDisplay(targetCell, changeInfo);
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
  if (targetCell.previousSibling.className === config.changeColumnClass) {
    return `${targetCell.nextSibling.textContent}e`;
  }
  if (targetCell.nextSibling.className === config.changeColumnClass) {
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
    const linkElement = createLinkElement(changeLink);
    changeCell.appendChild(linkElement);
    targetCell.style.border = 'none';
  } else {
    changeCell.appendChild(document.createElement('br'));
    const linkElement = createLinkElement(changeLink);
    changeCell.appendChild(linkElement);
  }
}

// Get the change cell for a target cell
function getChangeCell(targetCell) {
  if (targetCell.previousSibling.className === config.changeColumnClass) {
    return targetCell.previousSibling;
  }
  if (targetCell.nextSibling.className === config.changeColumnClass) {
    return targetCell.nextSibling;
  }
  return null;
}

// Create SumoDB query link for rank change
function createChangeLink(changeInfo) {
  const url = `https://sumodb.sumogames.de/Query.aspx?show_form=0&form1_rank=${changeInfo.currentRank}&form1_wins=${changeInfo.wins}&form1_year=193905-194401,194905-now&form2_highlight=on&form2_rank=${changeInfo.targetRank}`;

  return `<a href="${url}" target="_blank" title="Click to run a SumoDB query">${changeInfo.symbol}</a>`;
}

// Create link element from HTML string
function createLinkElement(linkHTML) {
  const temp = document.createElement('div');
  temp.innerHTML = linkHTML;
  return temp.firstChild;
}

// Update change column when removing rikishi
function updateChangeColumn(cell, draggedElement) {
  const changeCell = getChangeCell(cell);
  if (!changeCell) return;

  if (cell.children.length > 1) {
    // Multiple rikishi in cell - remove this one's change
    // Find and remove the specific change link
    const allLinks = changeCell.querySelectorAll('a');
    const brElements = changeCell.querySelectorAll('br');
    for (let i = 0; i < cell.children.length; i++) {
      if (cell.children[i] === draggedElement && i < allLinks.length) {
        allLinks[i].remove();
        // Remove associated br if exists
        if (i < brElements.length) {
          brElements[i].remove();
        }
        break;
      }
    }
  } else {
    // Last rikishi in cell - clear change column
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

// Save banzuke state to localStorage
export function saveState() {
  saveBanzukeState();
}

// Handle finish event
function handleFinish() {
  saveBanzukeState();
}

// Reset banzuke to initial state
export function reset() {
  if (!confirm('Reset the banzuke?')) {
    return;
  }

  const oldCells = document.getElementsByTagName(config.oldBanzukeSelector);
  const newCells = document.querySelectorAll(`.${config.newBanzukeClass}`);
  const changeCells = document.getElementsByClassName(config.changeColumnClass);

  // Clear localStorage and counter
  clearSavedState();
  window.localStorage.removeItem('banzuke'); // Clean up old format
  updateRikishiCount(
    -Number.parseInt(document.getElementById(config.rikishiCounterId).textContent)
  );

  // Move all rikishi back to old banzuke
  for (let i = 0; i < newCells.length; i++) {
    if (newCells[i].children.length > 0) {
      newCells[i].style.border = '1px dashed dimgray';
      changeCells[i].textContent = ' ';

      // Move each rikishi in this cell
      for (let j = newCells[i].children.length - 1; j >= 0; j--) {
        const rikishi = newCells[i].children[j];
        const rank = rikishi.id;

        // Find original position
        for (let k = 0; k <= theSekitori.length; k++) {
          if (oldCells[k]?.classList.contains(rank)) {
            rd.moveObject({
              obj: rikishi,
              target: oldCells[k]
            });
            oldCells[k].children[0].style.display = 'none';
            oldCells[k].style.removeProperty('border');
            break;
          }
        }
      }
    }
  }
}

// Reinitialize a specific card for drag functionality
export function reinitializeCard(card) {
  if (rd && card.className.includes('redips-drag')) {
    rd.enableDrag(true, card);
  }
}
