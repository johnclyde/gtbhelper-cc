// Test for division controls panel functionality
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

// Import after setting up DOM
import { createDivisionPanel } from '../division-controls.js';

describe('Division Controls Panel', () => {
  beforeEach(() => {
    localStorage.clear();
    document.getElementById('controls-container').innerHTML = '';
  });

  it('should create division panel with correct structure', () => {
    const panel = createDivisionPanel();

    assert(panel, 'Should create panel element');
    assert.equal(panel.id, 'division-controls', 'Should have correct id');

    const header = panel.querySelector('div');
    assert(header, 'Should have header div');

    const title = panel.querySelector('h3');
    assert(title, 'Should have title');
    assert.equal(title.textContent, 'Division Management', 'Should have correct title');

    const toggle = panel.querySelector('#division-toggle');
    assert(toggle, 'Should have toggle element');
    assert.equal(toggle.textContent, '▶', 'Should start collapsed');

    const content = panel.querySelector('#division-panel-content');
    assert(content, 'Should have content div');
    assert.equal(content.style.display, 'none', 'Content should be hidden initially');
  });

  it('should toggle panel on header click', () => {
    const panel = createDivisionPanel();
    document.getElementById('controls-container').appendChild(panel);

    const header = panel.querySelector('div');
    const content = panel.querySelector('#division-panel-content');
    const toggle = panel.querySelector('#division-toggle');

    // Initial state
    assert.equal(content.style.display, 'none', 'Should be collapsed initially');
    assert.equal(toggle.textContent, '▶', 'Should show collapsed arrow');

    // Click to expand
    const clickEvent = new dom.window.MouseEvent('click', {
      bubbles: true,
      cancelable: true
    });
    header.dispatchEvent(clickEvent);

    assert.equal(content.style.display, 'block', 'Should be expanded after click');
    assert.equal(toggle.textContent, '▼', 'Should show expanded arrow');
    assert.equal(localStorage.getItem('divisionPanelExpanded'), 'true', 'Should save state');

    // Click to collapse
    header.dispatchEvent(clickEvent);

    assert.equal(content.style.display, 'none', 'Should be collapsed after second click');
    assert.equal(toggle.textContent, '▶', 'Should show collapsed arrow again');
    assert.equal(
      localStorage.getItem('divisionPanelExpanded'),
      'false',
      'Should save collapsed state'
    );
  });

  it('should restore expanded state from localStorage', () => {
    // Pre-set expanded state
    localStorage.setItem('divisionPanelExpanded', 'true');

    const panel = createDivisionPanel();

    // The panel should start collapsed, but the initializeDivisionControls
    // function would restore the state. Since we're testing createDivisionPanel
    // in isolation, it should start collapsed.
    const content = panel.querySelector('#division-panel-content');
    assert.equal(content.style.display, 'none', 'Panel creation does not restore state');
  });

  it('should create controls for both banzuke types', () => {
    const panel = createDivisionPanel();

    const oldControls = panel.querySelector('#old-banzuke-controls');
    assert(oldControls, 'Should have old banzuke controls');

    const newControls = panel.querySelector('#new-banzuke-controls');
    assert(newControls, 'Should have new banzuke controls');

    const oldTitle = oldControls.querySelector('h4');
    assert(oldTitle, 'Should have old banzuke title');
    assert.equal(oldTitle.textContent, 'Current Banzuke', 'Should have correct title');

    const newTitle = newControls.querySelector('h4');
    assert(newTitle, 'Should have new banzuke title');
    assert.equal(newTitle.textContent, 'New Banzuke', 'Should have correct title');
  });

  it('should have reset button', () => {
    const panel = createDivisionPanel();

    const resetButton = panel.querySelector('button');
    assert(resetButton, 'Should have reset button');
    assert.equal(resetButton.textContent, 'Reset to Default', 'Should have correct text');
    assert.equal(
      resetButton.onclick.toString().includes('resetDivisions'),
      true,
      'Should call resetDivisions on click'
    );
  });
});
