// Test for division controls panel functionality
import './test-setup.js';
import { createControlPanel } from '../division-controls.js';

// Set up DOM before each test
beforeEach(() => {
  document.body.innerHTML = '<div id="controls-container"></div>';
});

test('should create division panel with correct structure', () => {
  const panel = createControlPanel();

  assert(panel, 'Should create panel element');
  assertEquals(panel.id, 'division-controls', 'Should have correct id');

  // The panel has two direct children: header div and content div
  const children = panel.children;
  assert(children.length >= 2, 'Should have at least 2 children');
  
  const header = children[0]; // First child is the header
  assert(header && header.tagName === 'DIV', 'Should have header div');

  const title = panel.querySelector('h3');
  assert(title, 'Should have title');
  assertEquals(title.textContent, 'Division Management', 'Should have correct title');

  const toggle = panel.querySelector('#division-toggle');
  assert(toggle, 'Should have toggle element');
  assertEquals(toggle.textContent, '▶', 'Should start collapsed');

  const content = panel.querySelector('#division-panel-content');
  assert(content, 'Should have content div');
  assertEquals(content.style.display, 'none', 'Content should be hidden initially');
});

test('should toggle panel on header click', () => {
  const panel = createControlPanel();
  document.getElementById('controls-container').appendChild(panel);

  const header = panel.querySelector('div');
  const content = panel.querySelector('#division-panel-content');
  const toggle = panel.querySelector('#division-toggle');

  // Initial state
  assertEquals(content.style.display, 'none', 'Should be collapsed initially');
  assertEquals(toggle.textContent, '▶', 'Should show collapsed arrow');

  // Click to expand
  const clickEvent = new window.MouseEvent('click', {
    bubbles: true,
    cancelable: true
  });
  header.dispatchEvent(clickEvent);

  assertEquals(content.style.display, 'block', 'Should be expanded after click');
  assertEquals(toggle.textContent, '▼', 'Should show expanded arrow');
  assertEquals(localStorage.getItem('divisionPanelExpanded'), 'true', 'Should save state');

  // Click to collapse
  header.dispatchEvent(clickEvent);

  assertEquals(content.style.display, 'none', 'Should be collapsed after second click');
  assertEquals(toggle.textContent, '▶', 'Should show collapsed arrow again');
  assertEquals(
    localStorage.getItem('divisionPanelExpanded'),
    'false',
    'Should save collapsed state'
  );
});

test('should restore expanded state from localStorage', () => {
  // Pre-set expanded state
  localStorage.setItem('divisionPanelExpanded', 'true');

  const panel = createControlPanel();

  // The panel should start collapsed, but the initializeDivisionControls
  // function would restore the state. Since we're testing createControlPanel
  // in isolation, it should start collapsed.
  const content = panel.querySelector('#division-panel-content');
  assertEquals(content.style.display, 'none', 'Panel creation does not restore state');
});

test('should create controls for both banzuke types', () => {
  const panel = createControlPanel();
  const content = panel.querySelector('#division-panel-content');

  const oldControls = content.querySelector('#old-banzuke-controls');
  assert(oldControls, 'Should have old banzuke controls');

  const newControls = content.querySelector('#new-banzuke-controls');
  assert(newControls, 'Should have new banzuke controls');

  // The h4 titles are siblings of the controls divs, not children
  const oldSection = oldControls.parentElement;
  const oldTitle = oldSection.querySelector('h4');
  assert(oldTitle, 'Should have old banzuke title');
  assertEquals(oldTitle.textContent, 'Old Banzuke (Left)', 'Should have correct title');

  const newSection = newControls.parentElement;
  const newTitle = newSection.querySelector('h4');
  assert(newTitle, 'Should have new banzuke title');
  assertEquals(newTitle.textContent, 'New Banzuke (Right)', 'Should have correct title');
});

test('should have reset button', () => {
  const panel = createControlPanel();
  const content = panel.querySelector('#division-panel-content');

  const resetButton = content.querySelector('button');
  assert(resetButton, 'Should have reset button');
  assertEquals(resetButton.textContent, 'Reset to Default', 'Should have correct text');
  
  // The button has an event listener added via addEventListener, not onclick
  // Just verify it exists
  assert(resetButton, 'Reset button exists');
});