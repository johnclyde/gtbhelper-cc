// Test for rikishi card creation functionality
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
    <body></body>
  </html>
`);
global.document = dom.window.document;
global.window = dom.window;

// Import after setting up DOM
import { createCard } from '../rikishi-card-manager.js';

describe('Rikishi Card Creation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create a card with default name', () => {
    const card = createCard('M1e Tobizaru 0-0', 12203, '202501');

    assert(card, 'Should create a card element');
    assert.equal(card.id, 'M1e', 'Should set correct id');
    assert.equal(card.getAttribute('data-rid'), '12203', 'Should set correct rikishi id');

    const nameLink = card.querySelector('a[href*="Rikishi.aspx"]');
    assert(nameLink, 'Should have a name link');
    assert.equal(nameLink.textContent, 'Tobizaru', 'Should show default name');

    const recordLink = card.querySelector('a[href*="Rikishi_basho.aspx"]');
    assert(recordLink, 'Should have a record link');
    assert.equal(recordLink.textContent, '0-0', 'Should show record');
  });

  it('should create a card with custom name', () => {
    // Pre-save a custom name
    localStorage.setItem(
      'customRikishiNames',
      JSON.stringify({
        12203: 'CustomTobizaru'
      })
    );

    const card = createCard('M1e Tobizaru 0-0', 12203, '202501');

    const nameLink = card.querySelector('a[href*="Rikishi.aspx"]');
    assert.equal(nameLink.textContent, 'CustomTobizaru', 'Should show custom name');
  });

  it('should handle retired rikishi styling', () => {
    // Mark rikishi as retired
    localStorage.setItem(
      'retiredRikishi',
      JSON.stringify({
        12203: true
      })
    );

    const card = createCard('M1e Tobizaru 0-0', 12203, '202501');

    assert.equal(card.className, 'rikishi-nodrag', 'Should have non-draggable class');
    assert.equal(
      card.style.backgroundColor,
      'rgb(218, 218, 218)',
      'Should have retired background color'
    );
    assert.equal(card.style.cursor, 'not-allowed', 'Should have not-allowed cursor');
    assert(card.getAttribute('title').includes('Retired'), 'Should have retired title');
  });

  it('should handle active rikishi styling', () => {
    const card = createCard('M1e Tobizaru 0-0', 12203, '202501');

    assert.equal(card.className, 'rikishi-drag se', 'Should have draggable class');
    assert.equal(card.style.cursor, 'grab', 'Should have grab cursor');
    assert(card.getAttribute('title').includes('Right-click'), 'Should have right-click hint');
  });

  it('should create correct links', () => {
    const card = createCard('M1e Tobizaru 8-7', 12203, '202501');

    const nameLink = card.querySelector('a[href*="Rikishi.aspx"]');
    assert.equal(
      nameLink.href,
      'https://sumodb.sumogames.de/Rikishi.aspx?r=12203',
      'Should have correct rikishi link'
    );

    const recordLink = card.querySelector('a[href*="Rikishi_basho.aspx"]');
    assert.equal(
      recordLink.href,
      'https://sumodb.sumogames.de/Rikishi_basho.aspx?r=12203&b=202501',
      'Should have correct basho link'
    );
    assert.equal(recordLink.textContent, '8-7', 'Should show correct record');
  });

  it('should handle rikishi with special characters in record', () => {
    const card = createCard('Y1e Hoshoryu 15-0 Y', 12451, '202501');

    const nameLink = card.querySelector('a[href*="Rikishi.aspx"]');
    assert.equal(nameLink.textContent, 'Hoshoryu', 'Should show name correctly');

    const recordLink = card.querySelector('a[href*="Rikishi_basho.aspx"]');
    assert.equal(recordLink.textContent, '15-0', 'Should show record without special character');
  });
});
