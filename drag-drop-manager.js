// Drag and Drop Manager - Clean abstraction over REDIPS library

// Private variables
let rd = null;
let config = {
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
    rd.animation = "off";
    rd.hover.colorTd = "yellow";
    rd.dropMode = "multiple";
    rd.only.divClass.se = config.newBanzukeClass;
    
    // Set up rank restrictions
    setupRankRestrictions();
    
    // Set up event handlers
    setupEventHandlers();
    
    // Initialize editable rikishi names
    window.rikishiNames.makeEditable();
  }
  
// Set up rank-based movement restrictions
function setupRankRestrictions() {
    for (var i = 0; i < theSekitori.length; i++) {
      if (theSekitori[i] !== "") {
        var rank = theSekitori[i].split(' ')[0];
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
    var draggedElement = rd.obj;
    var currentCell = rd.findParent('TD', draggedElement);
    var radioButtons = document.getElementsByTagName("input");
    
    if (radioButtons[0].checked) {
      // Open rikishi information page
      var rikishiURL = "https://sumodb.sumogames.de/Rikishi.aspx?r=" + draggedElement.dataset.rid;
      window.open(rikishiURL, "_blank").focus();
    } else if (currentCell.classList.contains(config.newBanzukeClass)) {
      // Return rikishi to old banzuke
      returnToOldBanzuke(draggedElement, currentCell);
    }
  }
  
// Return rikishi to old banzuke position
function returnToOldBanzuke(draggedElement, currentCell) {
    var rank = draggedElement.id;
    var oldBanzukeCells = document.getElementsByTagName(config.oldBanzukeSelector);
    
    for (var i = 0; i <= theSekitori.length; i++) {
      if (oldBanzukeCells[i] && oldBanzukeCells[i].classList.contains(rank)) {
        updateChangeColumn(currentCell, draggedElement);
        
        rd.moveObject({
          obj: draggedElement,
          target: oldBanzukeCells[i],
          callback: function() {
            updateRikishiCount(-1);
            oldBanzukeCells[i].children[0].style.display = "none";
            oldBanzukeCells[i].style.removeProperty("border");
            saveBanzukeState();
          }
        });
        break;
      }
    }
  }
  
// Handle click on element
function handleClick(currentCell) {
    currentCell.style.backgroundColor = "lightblue";
  }
  
// Handle when element is clicked but not moved
function handleNotMoved() {
    var currentCell = rd.findParent('TD', rd.obj);
    currentCell.style.removeProperty("background-color");
  }
  
// Handle before drop event
function handleDroppedBefore(targetCell) {
    var draggedElement = rd.obj;
    var currentCell = rd.findParent('TD', draggedElement);
    
    currentCell.style.removeProperty("background-color");
    
    // Update visual state based on movement direction
    updateCellVisualState(currentCell, targetCell);
    
    // Update change column if moving from new banzuke
    if (currentCell.classList.contains(config.newBanzukeClass)) {
      updateChangeColumn(currentCell, draggedElement);
    }
  }
  
// Update cell visual state based on movement
function updateCellVisualState(currentCell, targetCell) {
    var isFromNew = currentCell.classList.contains(config.newBanzukeClass);
    var isToNew = targetCell.classList.contains(config.newBanzukeClass);
    
    if (!isFromNew && isToNew) {
      // Moving to new banzuke
      currentCell.children[0].style.display = "block";
      currentCell.style.border = "1px dashed dimgray";
      updateRikishiCount(1);
    } else if (isFromNew && !isToNew) {
      // Moving from new banzuke
      targetCell.children[0].style.display = "none";
      targetCell.style.removeProperty("border");
      updateRikishiCount(-1);
    }
  }
  
// Handle dropped event
function handleDropped(targetCell) {
    if (!targetCell.classList.contains(config.newBanzukeClass)) {
      return;
    }
    
    var draggedElement = rd.obj;
    var changeInfo = calculateRankChange(draggedElement, targetCell);
    updateChangeDisplay(targetCell, changeInfo);
  }
  
// Calculate rank change information
function calculateRankChange(draggedElement, targetCell) {
    var currentRank = draggedElement.id;
    var wins = draggedElement.innerText.split(' ')[2].split('-')[0];
    var targetRank = getTargetRank(targetCell);
    var changeSymbol = getChangeSymbol(currentRank, targetRank);
    
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
      return targetCell.nextSibling.innerHTML + 'e';
    } else if (targetCell.nextSibling.className === config.changeColumnClass) {
      return targetCell.previousSibling.innerHTML + 'w';
    }
    return '';
  }
  
// Get rank change symbol
function getChangeSymbol(currentRank, targetRank) {
    var currentType = currentRank.charAt(0);
    var targetType = targetRank.charAt(0);
    
    // Handle Maegashira ranks
    if (targetType === 'M') {
      if (currentType === 'M') {
        return calculateMaegashiraChange(currentRank, targetRank);
      } else if (currentType === 'J') {
        return " ↑ ";
      } else {
        return " ↓ ";
      }
    }
    // Handle Juryo ranks
    else if (targetType === 'J') {
      if (currentType === 'M') {
        return " ↓ ";
      } else if (currentType === 'J') {
        return "⇄";
      } else {
        return "!!!";
      }
    }
    // Handle Sanyaku ranks
    else {
      if (currentType === 'M') {
        return " ↑ ";
      } else if (currentType === 'J') {
        return "!!!";
      } else {
        return "⇄";
      }
    }
  }
  
// Calculate change between Maegashira ranks
function calculateMaegashiraChange(currentRank, targetRank) {
    var currentNum = parseInt(currentRank.slice(1, -1));
    var targetNum = parseInt(targetRank.slice(1, -1));
    
    // Add 0.5 for west ranks
    if (currentRank.slice(-1) === 'w') currentNum += 0.5;
    if (targetRank.slice(-1) === 'w') targetNum += 0.5;
    
    var change = currentNum - targetNum;
    
    if (change > 0) return "+" + change;
    else if (change === 0) return "─";
    else return change.toString();
  }
  
// Update change display in the change column
function updateChangeDisplay(targetCell, changeInfo) {
    var changeCell = getChangeCell(targetCell);
    if (!changeCell) return;
    
    var changeLink = createChangeLink(changeInfo);
    
    if (changeCell.innerHTML === " ") {
      changeCell.innerHTML = changeLink;
      targetCell.style.border = "none";
    } else {
      changeCell.innerHTML += "<br>" + changeLink;
    }
  }
  
// Get the change cell for a target cell
function getChangeCell(targetCell) {
    if (targetCell.previousSibling.className === config.changeColumnClass) {
      return targetCell.previousSibling;
    } else if (targetCell.nextSibling.className === config.changeColumnClass) {
      return targetCell.nextSibling;
    }
    return null;
  }
  
// Create SumoDB query link for rank change
function createChangeLink(changeInfo) {
    var url = 'https://sumodb.sumogames.de/Query.aspx?show_form=0' +
              '&form1_rank=' + changeInfo.currentRank +
              '&form1_wins=' + changeInfo.wins +
              '&form1_year=193905-194401,194905-now' +
              '&form2_highlight=on' +
              '&form2_rank=' + changeInfo.targetRank;
    
    return '<a href="' + url + '" target="_blank" title="Click to run a SumoDB query">' + 
           changeInfo.symbol + '</a>';
  }
  
// Update change column when removing rikishi
function updateChangeColumn(cell, draggedElement) {
    var changeCell = getChangeCell(cell);
    if (!changeCell) return;
    
    if (cell.children.length > 1) {
      // Multiple rikishi in cell - remove this one's change
      var changes = changeCell.innerHTML.split("<br>");
      for (var i = 0; i < cell.children.length; i++) {
        if (cell.children[i] === draggedElement) {
          changes.splice(i, 1);
          changeCell.innerHTML = changes.join("<br>");
          break;
        }
      }
    } else {
      // Last rikishi in cell - clear change column
      changeCell.innerHTML = " ";
      cell.style.border = "1px dashed dimgray";
    }
  }
  
// Update rikishi count display
function updateRikishiCount(delta) {
    var counter = document.getElementById(config.rikishiCounterId);
    if (counter) {
      counter.innerHTML = parseInt(counter.innerHTML) + delta;
    }
  }
  
// Save banzuke state to localStorage
export function saveState() {
  var tableLiner = document.getElementById(config.tableLinerId);
  if (tableLiner) {
    window.localStorage.setItem("banzuke", tableLiner.innerHTML);
  }
}

// Internal save function for event handlers
function saveBanzukeState() {
  saveState();
}
  
// Handle finish event
function handleFinish() {
    saveBanzukeState();
  }
  
// Reset banzuke to initial state
export function reset() {
    if (!confirm("Reset the banzuke?")) {
      return;
    }
    
    var oldCells = document.getElementsByTagName(config.oldBanzukeSelector);
    var newCells = document.querySelectorAll('.' + config.newBanzukeClass);
    var changeCells = document.getElementsByClassName(config.changeColumnClass);
    
    // Clear localStorage and counter
    window.localStorage.removeItem("banzuke");
    updateRikishiCount(-parseInt(document.getElementById(config.rikishiCounterId).innerHTML));
    
    // Move all rikishi back to old banzuke
    for (var i = 0; i < newCells.length; i++) {
      if (newCells[i].children.length > 0) {
        newCells[i].style.border = "1px dashed dimgray";
        changeCells[i].innerHTML = ' ';
        
        // Move each rikishi in this cell
        for (var j = newCells[i].children.length - 1; j >= 0; j--) {
          var rikishi = newCells[i].children[j];
          var rank = rikishi.id;
          
          // Find original position
          for (var k = 0; k <= theSekitori.length; k++) {
            if (oldCells[k] && oldCells[k].classList.contains(rank)) {
              rd.moveObject({
                obj: rikishi,
                target: oldCells[k]
              });
              oldCells[k].children[0].style.display = "none";
              oldCells[k].style.removeProperty("border");
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
  
// Also maintain backward compatibility with window.dragDropManager
window.dragDropManager = {
  init,
  reset,
  saveState,
  reinitializeCard
};