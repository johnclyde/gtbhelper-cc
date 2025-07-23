// GTB Helper - Main Application

import { CURRENT_BASHO, initializeRadioButtons, saveRadioPreference } from './app-state.js';
import { hasSavedState, restoreBanzukeState } from './banzuke-state.js';
import { writeTableTitles } from './basho-utils.js';
import { initializeDivisionControls } from './division-controls.js';
import { initializeDivisionManager } from './division-manager.js';
import { init as initRikishiCards, populateAllSlots } from './rikishi-card-manager.js';
import { makeEditable } from './rikishi-card-manager.js';
import { init as initDragDrop, reset as resetDragDrop } from './sortable-drag-drop.js';

// Initialize application
function initializeApp() {
  // Initialize modules
  initRikishiCards();

  // Handle saved state
  if (hasSavedState()) {
    // Load from saved state
    writeTableTitles(CURRENT_BASHO);
    initializeDivisionManager();
    restoreBanzukeState();
  } else {
    // Fresh start
    writeTableTitles(CURRENT_BASHO);
    initializeDivisionManager();
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
  if (confirm('Reset the banzuke?')) {
    resetDragDrop();
  }
};
window.initDragDrop = initDragDrop;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
