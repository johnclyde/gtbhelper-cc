// Test for rikishi card manager custom names functionality
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
      <div id="banzuke1">
        <div class="rikishi-drag" id="M1e" data-rid="12203">
          <a href="https://sumodb.sumogames.de/Rikishi.aspx?r=12203">Tobizaru</a>
          <a href="https://sumodb.sumogames.de/Rikishi_basho.aspx?r=12203&b=202501">0-0</a>
        </div>
      </div>
    </body>
  </html>
`);
global.document = dom.window.document;
global.window = dom.window;

// Import after setting up DOM
import { makeEditable } from '../rikishi-card-manager.js';

describe('Rikishi Custom Names', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should save and load custom names', () => {
    // Initialize the editable functionality
    makeEditable();

    // Find the name link
    const nameLink = document.querySelector('a[href*="Rikishi.aspx?r="]');
    assert(nameLink, 'Should find rikishi name link');
    assert.equal(nameLink.textContent, 'Tobizaru', 'Should have original name');

    // Simulate click to edit
    const clickEvent = new dom.window.MouseEvent('click', {
      bubbles: true,
      cancelable: true
    });
    nameLink.dispatchEvent(clickEvent);

    // Check that input was created
    const input = nameLink.parentNode.querySelector('input');
    assert(input, 'Should create input field');
    assert.equal(input.value, 'Tobizaru', 'Input should have original name');

    // Change the name
    input.value = 'CustomName';

    // Simulate Enter key to save
    const enterEvent = new dom.window.KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true
    });
    input.dispatchEvent(enterEvent);

    // Check that name was updated
    assert.equal(nameLink.textContent, 'CustomName', 'Name should be updated');

    // Check localStorage
    const savedData = JSON.parse(localStorage.getItem('customRikishiNames'));
    assert(savedData, 'Should save to localStorage');
    assert.equal(savedData['12203'], 'CustomName', 'Should save custom name');
  });

  it('should apply custom names on page load', () => {
    // Pre-save a custom name
    localStorage.setItem(
      'customRikishiNames',
      JSON.stringify({
        12203: 'PreloadedName'
      })
    );

    // Initialize
    makeEditable();

    // Check that custom name was applied
    const nameLink = document.querySelector('a[href*="Rikishi.aspx?r="]');
    assert.equal(nameLink.textContent, 'PreloadedName', 'Should apply custom name on load');
  });

  it('should revert to original name when cleared', () => {
    makeEditable();

    const nameLink = document.querySelector('a[href*="Rikishi.aspx?r="]');

    // Click to edit
    const clickEvent = new dom.window.MouseEvent('click', {
      bubbles: true,
      cancelable: true
    });
    nameLink.dispatchEvent(clickEvent);

    const input = nameLink.parentNode.querySelector('input');

    // Clear the input
    input.value = '';

    // Save
    const enterEvent = new dom.window.KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true
    });
    input.dispatchEvent(enterEvent);

    // Should revert to original
    assert.equal(nameLink.textContent, 'Tobizaru', 'Should revert to original name');

    // Should remove from localStorage
    const savedData = JSON.parse(localStorage.getItem('customRikishiNames') || '{}');
    assert(!savedData['12203'], 'Should remove custom name from storage');
  });
});
