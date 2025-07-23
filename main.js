// GTB Helper - Main Application

import { 
  CURRENT_BASHO, 
  getSavedBanzuke, 
  hasSavedBanzuke, 
  initializeRadioButtons,
  saveRadioPreference
} from './app-state.js';
import { hasSavedState, migrateFromInnerHTML, restoreBanzukeState } from './banzuke-state.js';
import { writeTableTitles } from './basho-utils.js';
import { initializeDivisionControls } from './division-controls.js';
import { initializeConfigurableTables } from './division-manager.js';
import { init as initDragDrop, reset as resetDragDrop } from './drag-drop-manager.js';
import { init as initRikishiCards, populateAllSlots } from './rikishi-card-manager.js';
import { makeEditable } from './rikishi-names.js';

// Initialize application
function initializeApp() {
  // Initialize modules
  initRikishiCards();
  
  // Handle saved state
  if (hasSavedState()) {
    // Load from new state format
    writeTableTitles(CURRENT_BASHO);
    initializeConfigurableTables();
    restoreBanzukeState();
  } else if (hasSavedBanzuke()) {
    // Migrate from old innerHTML format
    writeTableTitles(CURRENT_BASHO);
    initializeConfigurableTables();
    populateAllSlots(CURRENT_BASHO);
    // Then restore the old saved state
    const tableLiner = document.getElementById("tableLiner");
    tableLiner.innerHTML = getSavedBanzuke();
    migrateFromInnerHTML();
  } else {
    // Fresh start
    writeTableTitles(CURRENT_BASHO);
    initializeConfigurableTables();
    populateAllSlots(CURRENT_BASHO);
  }
  
  // Set up UI preferences
  initializeRadioButtons();
  
  // Initialize interactions
  initDragDrop();
  makeEditable();
  
  // Initialize division controls
  initializeDivisionControls();
}

// Exposed functions for HTML onclick handlers
window.saveRadio = (radioButton) => saveRadioPreference(radioButton.value);
window.resetBanzuke = () => {
  if (confirm("Reset the banzuke?")) {
    resetDragDrop();
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}