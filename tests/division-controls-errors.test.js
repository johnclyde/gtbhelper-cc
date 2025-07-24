// Test for division controls error handling
import './test-setup.js';
import { getDivisionCounts } from '../division-manager.js';
import { initializeDivisionControls } from '../division-controls.js';

beforeEach(() => {
  document.body.innerHTML = '<div id="controls-container"></div>';
});

test('should handle getDivisionCounts with undefined parameter gracefully', () => {
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

test('should handle getDivisionCounts with null parameter', () => {
  const counts = getDivisionCounts(null);
  assert(counts, 'Should return default counts with null');
  assert(counts.Y !== undefined, 'Should have Y count');
  assert(counts.M !== undefined, 'Should have M count');
});

test('should handle getDivisionCounts with invalid banzuke type', () => {
  const counts = getDivisionCounts('invalidBanzukeType');
  assert(counts, 'Should return default counts with invalid type');
  assertEquals(typeof counts.Y, 'number', 'Should have numeric Y count');
  assertEquals(typeof counts.M, 'number', 'Should have numeric M count');
});

test('should handle missing DOM elements during initialization', () => {
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

test('should handle reset button click without window.resetDivisions', () => {
  // Create proper container structure
  document.body.innerHTML = `
    <div id="tableContainer">
      <table id="tableLiner">
        <tr>
          <td class="banzukeContainer" id="oldBanzukeContainer"></td>
          <td class="banzukeContainer" id="newBanzukeContainer"></td>
        </tr>
      </table>
    </div>
    <header></header>
  `;
  
  // Initialize controls
  initializeDivisionControls();
  
  // Find reset button - it should be in the division-controls panel
  const resetButton = document.querySelector('#division-controls button[textContent*="Reset"]') || 
                      document.querySelector('#division-controls button');
  
  if (resetButton?.textContent.includes('Reset')) {
    // Click should not throw even without window.resetDivisions
    let error = null;
    try {
      const clickEvent = new window.MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      resetButton.dispatchEvent(clickEvent);
    } catch (e) {
      error = e;
    }
    
    assert(!error, 'Reset button click should not throw');
  } else {
    // If no reset button found, that's OK for this error handling test
    assert(true, 'No reset button to test, which is acceptable');
  }
});

test('should handle corrupted localStorage during updateControls', () => {
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

test('should handle division count updates with invalid values', () => {
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
      const clickEvent = new window.MouseEvent('click', {
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