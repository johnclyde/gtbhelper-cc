// GTB Helper - Main Application

import { 
  CURRENT_BASHO, 
  getSavedBanzuke, 
  hasSavedBanzuke, 
  initializeRadioButtons,
  saveRadioPreference
} from './app-state.js';
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
  
  // Use configurable tables instead of hardcoded ones
  if (!hasSavedBanzuke()) {
    writeTableTitles(CURRENT_BASHO);
    initializeConfigurableTables();
    populateAllSlots(CURRENT_BASHO);
  } else {
    document.getElementById("tableLiner").innerHTML = getSavedBanzuke();
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