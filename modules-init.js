// Module initialization - ensures all modules are loaded in correct order

// Import all modules
import './rikishi-names.js';
import './basho-utils.js';
import './rikishi-card-manager.js';
import './drag-drop-manager.js';

// Signal that modules are ready
window.modulesReady = true;

// If script.js already loaded and waiting, initialize now
if (window.pendingInit) {
  window.pendingInit();
}