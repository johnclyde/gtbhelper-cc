// Module initialization - ensures all modules are loaded in correct order

// Import all modules
import './rikishi-names.js';
import './basho-utils.js';
import './rikishi-card-manager.js';
import './drag-drop-manager.js';
import { initializeTables } from './table-generator.js';

// Initialize tables before other modules
initializeTables();

// Signal that modules are ready
window.modulesReady = true;

// If script.js already loaded and waiting, initialize now
if (window.pendingInit) {
  window.pendingInit();
}