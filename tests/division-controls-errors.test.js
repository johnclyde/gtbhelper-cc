// Test for division controls error handling
import { strict as assert } from 'node:assert';
import { JSDOM } from 'jsdom';

// Mock localStorage
global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
  clear() {
    this.data = {};
  }
};

// Create a test DOM
const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <head></head>
    <body>
      <div id="controls-container"></div>
    </body>
  </html>
`);
global.document = dom.window.document;
global.window = dom.window;
global.confirm = () => true; // Mock confirm to always return true

// Import modules after setting up DOM
import { getDivisionCounts } from '../division-manager.js';
import { initializeDivisionControls } from '../division-controls.js';

describe('Division Controls Error Handling', () => {
  beforeEach(() => {
    localStorage.clear();
    document.getElementById('controls-container').innerHTML = '';
  });

  it('should handle getDivisionCounts with undefined parameter gracefully', () => {
    // This should not throw
    let error = null;
    try {
      const counts = getDivisionCounts(undefined);
      assert(counts, 'Should return some counts even with undefined');
    } catch (e) {
      error = e;
    }
    
    // While it logs an error, it should not throw
    assert(!error, 'Should not throw with undefined parameter');
  });

  it('should handle getDivisionCounts with null parameter', () => {
    const counts = getDivisionCounts(null);
    assert(counts, 'Should return default counts with null');
    assert(counts.Y !== undefined, 'Should have Y count');
    assert(counts.M !== undefined, 'Should have M count');
  });

  it('should handle getDivisionCounts with invalid banzuke type', () => {
    const counts = getDivisionCounts('invalidBanzukeType');
    assert(counts, 'Should return default counts with invalid type');
    assert.equal(typeof counts.Y, 'number', 'Should have numeric Y count');
    assert.equal(typeof counts.M, 'number', 'Should have numeric M count');
  });

  it('should handle missing DOM elements during initialization', () => {
    // Remove the controls container
    const container = document.getElementById('controls-container');
    container.remove();
    
    // This should not throw
    let error = null;
    try {
      initializeDivisionControls();
    } catch (e) {
      error = e;
    }
    
    assert(!error, 'Should not throw when container is missing');
  });

  it('should handle reset button click without window.resetDivisions', () => {
    // Create container
    const container = document.createElement('div');
    container.id = 'controls-container';
    document.body.appendChild(container);
    
    // Initialize controls
    initializeDivisionControls();
    
    // Find reset button
    const resetButton = document.querySelector('button');
    assert(resetButton, 'Should have reset button');
    
    // Click should not throw even without window.resetDivisions
    let error = null;
    try {
      const clickEvent = new dom.window.MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      resetButton.dispatchEvent(clickEvent);
    } catch (e) {
      error = e;
    }
    
    assert(!error, 'Reset button click should not throw');
  });

  it('should handle corrupted localStorage during updateControls', () => {
    // Save corrupted config
    localStorage.setItem('banzukeDivisionConfig', '{invalid json}');
    
    // Create container
    const container = document.createElement('div');
    container.id = 'controls-container';
    document.body.appendChild(container);
    
    // This should not throw
    let error = null;
    try {
      initializeDivisionControls();
    } catch (e) {
      error = e;
    }
    
    assert(!error, 'Should handle corrupted localStorage gracefully');
  });

  it('should handle division count updates with invalid values', () => {
    // Create container
    const container = document.createElement('div');
    container.id = 'controls-container';
    document.body.appendChild(container);
    
    initializeDivisionControls();
    
    // Try to find + button for Yokozuna
    const buttons = document.querySelectorAll('button');
    let yokozunaPlus = null;
    
    for (const button of buttons) {
      if (button.textContent === '+' && button.onclick && 
          button.onclick.toString().includes('Y')) {
        yokozunaPlus = button;
        break;
      }
    }
    
    if (yokozunaPlus) {
      // Multiple clicks should be handled gracefully
      for (let i = 0; i < 10; i++) {
        const clickEvent = new dom.window.MouseEvent('click', {
          bubbles: true,
          cancelable: true
        });
        yokozunaPlus.dispatchEvent(clickEvent);
      }
      
      // Should not exceed reasonable limits
      const counts = getDivisionCounts('oldBanzuke');
      assert(counts.Y <= 10, 'Should have reasonable limit on Y count');
    }
  });
});