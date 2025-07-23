// Tests for division controls UI

import { createControlPanel, initializeDivisionControls } from '../division-controls.js';

test('createControlPanel creates proper DOM structure', () => {
  const panel = createControlPanel();
  
  assertEquals(panel.id, 'division-controls', 'Panel should have correct id');
  assert(panel.querySelector('h3'), 'Should have a title');
  assertEquals(panel.querySelector('h3').textContent, 'Division Management', 'Title should be correct');
  
  const toggle = panel.querySelector('#division-toggle');
  assert(toggle, 'Should have toggle element');
  assertEquals(toggle.textContent, '▶', 'Should start with collapsed arrow');
  
  const content = panel.querySelector('#division-panel-content');
  assert(content, 'Should have content panel');
  assertEquals(content.style.display, 'none', 'Content should start hidden');
});

test('toggle functionality works', () => {
  const panel = createControlPanel();
  document.body.appendChild(panel);
  
  // Initialize controls to set up global functions
  initializeDivisionControls();
  
  const content = document.getElementById('division-panel-content');
  const toggle = document.getElementById('division-toggle');
  
  // Initially collapsed
  assertEquals(content.style.display, 'none', 'Should start collapsed');
  assertEquals(toggle.textContent, '▶', 'Should show right arrow');
  
  // Click to expand
  window.toggleDivisionPanel();
  assertEquals(content.style.display, 'block', 'Should be expanded');
  assertEquals(toggle.textContent, '▼', 'Should show down arrow');
  
  // Click to collapse
  window.toggleDivisionPanel();
  assertEquals(content.style.display, 'none', 'Should be collapsed again');
  assertEquals(toggle.textContent, '▶', 'Should show right arrow again');
});

test('control panel has correct sections', () => {
  const panel = createControlPanel();
  
  const oldControls = panel.querySelector('#old-banzuke-controls');
  assert(oldControls, 'Should have old banzuke controls');
  
  const newControls = panel.querySelector('#new-banzuke-controls');
  assert(newControls, 'Should have new banzuke controls');
  
  const resetBtn = panel.querySelector('button');
  assert(resetBtn, 'Should have reset button');
  assertEquals(resetBtn.textContent, 'Reset to Default', 'Reset button text should be correct');
});

test('toggle state is saved to localStorage', () => {
  localStorage.clear();
  const panel = createControlPanel();
  document.body.appendChild(panel);
  initializeDivisionControls();
  
  // Expand panel
  window.toggleDivisionPanel();
  assertEquals(localStorage.getItem('divisionPanelExpanded'), 'true', 'Expanded state should be saved');
  
  // Collapse panel
  window.toggleDivisionPanel();
  assertEquals(localStorage.getItem('divisionPanelExpanded'), 'false', 'Collapsed state should be saved');
});

test('panel state is restored from localStorage', () => {
  // Set expanded state in localStorage
  localStorage.setItem('divisionPanelExpanded', 'true');
  
  // Create new panel
  document.body.innerHTML = '<header></header>';
  initializeDivisionControls();
  
  const content = document.getElementById('division-panel-content');
  const toggle = document.getElementById('division-toggle');
  
  // Should be expanded based on localStorage
  assertEquals(content.style.display, 'block', 'Should restore expanded state');
  assertEquals(toggle.textContent, '▼', 'Should show down arrow');
});

test('rank control creates proper elements', () => {
  // This would need the createRankControl function to be exported
  // For now, we test the overall structure after initialization
  document.body.innerHTML = '<header></header>';
  initializeDivisionControls();
  
  const oldControls = document.getElementById('old-banzuke-controls');
  assert(oldControls.querySelector('strong'), 'Should have section labels');
  
  // Check for buttons
  const buttons = oldControls.querySelectorAll('button');
  assert(buttons.length > 0, 'Should have control buttons');
  
  // Check for count displays
  const spans = oldControls.querySelectorAll('span');
  assert(spans.length > 0, 'Should have count displays');
});

test('clicking header toggles panel', () => {
  const panel = createControlPanel();
  document.body.appendChild(panel);
  initializeDivisionControls();
  
  const header = panel.querySelector('div');
  const content = document.getElementById('division-panel-content');
  
  // Simulate click on header
  header.click();
  assertEquals(content.style.display, 'block', 'Should expand on header click');
  
  header.click();
  assertEquals(content.style.display, 'none', 'Should collapse on header click');
});

test('reset button has click handler', () => {
  const panel = createControlPanel();
  document.body.appendChild(panel);
  initializeDivisionControls();
  
  // Mock confirm to prevent actual dialog
  const originalConfirm = window.confirm;
  let confirmCalled = false;
  window.confirm = () => {
    confirmCalled = true;
    return false; // Don't actually reset
  };
  
  const resetBtn = panel.querySelector('button');
  resetBtn.click();
  
  assert(confirmCalled, 'Reset should ask for confirmation');
  
  // Restore original confirm
  window.confirm = originalConfirm;
});

test('controls are inserted after header', () => {
  document.body.innerHTML = '<header id="test-header"></header><div id="other-content"></div>';
  
  initializeDivisionControls();
  
  const header = document.getElementById('test-header');
  const panel = document.getElementById('division-controls');
  const otherContent = document.getElementById('other-content');
  
  assert(panel, 'Panel should be created');
  assert(header.nextSibling === panel, 'Panel should be right after header');
  assert(panel.nextSibling === otherContent, 'Panel should be before other content');
});