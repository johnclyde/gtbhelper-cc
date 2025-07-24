// Test for rikishi card creation functionality
import './test-setup.js';
import { createCard } from '../rikishi-card-manager.js';

test('should create a card with default name', () => {
  const card = createCard('M1e Tobizaru 0-0', 12203, '202501');

  assert(card, 'Should create a card element');
  assertEquals(card.id, 'M1e', 'Should set correct id');
  assertEquals(card.getAttribute('data-rid'), '12203', 'Should set correct rikishi id');

  const html = card.innerHTML;
  assert(html.includes('href="https://sumodb.sumogames.de/Rikishi.aspx?r=12203"'), 'Should have a name link');
  assert(html.includes('>Tobizaru<'), 'Should show default name');

  assert(html.includes('href="https://sumodb.sumogames.de/Rikishi_basho.aspx?r=12203&amp;b=202501"'), 'Should have a record link');
  assert(html.includes('>0-0<'), 'Should show record');
});

test('should create a card with custom name', () => {
  // Pre-save a custom name
  localStorage.setItem(
    'customRikishiNames',
    JSON.stringify({
      12203: 'CustomTobizaru'
    })
  );

  const card = createCard('M1e Tobizaru 0-0', 12203, '202501');

  const html = card.innerHTML;
  assert(html.includes('>CustomTobizaru<'), 'Should show custom name');
});

test('should handle retired rikishi styling', () => {
  // Mark rikishi as retired
  localStorage.setItem(
    'retiredRikishi',
    JSON.stringify({
      12203: true
    })
  );

  const card = createCard('M1e Tobizaru 0-0', 12203, '202501');

  assertEquals(card.className, 'rikishi-nodrag', 'Should have non-draggable class');
  assertEquals(
    card.style.backgroundColor,
    'rgb(218, 218, 218)',
    'Should have retired background color'
  );
  assertEquals(card.style.cursor, 'not-allowed', 'Should have not-allowed cursor');
  assert(card.getAttribute('title').includes('Retired'), 'Should have retired title');
});

test('should handle active rikishi styling', () => {
  const card = createCard('M1e Tobizaru 0-0', 12203, '202501');

  assertEquals(card.className, 'rikishi-drag se', 'Should have draggable class');
  assertEquals(card.style.cursor, 'grab', 'Should have grab cursor');
  assert(card.getAttribute('title').includes('Right-click'), 'Should have right-click hint');
});

test('should create correct links', () => {
  const card = createCard('M1e Tobizaru 8-7', 12203, '202501');

  const html = card.innerHTML;
  assert(
    html.includes('href="https://sumodb.sumogames.de/Rikishi.aspx?r=12203"'),
    'Should have correct rikishi link'
  );

  assert(
    html.includes('href="https://sumodb.sumogames.de/Rikishi_basho.aspx?r=12203&amp;b=202501"'),
    'Should have correct basho link'
  );
  assert(html.includes('>8-7<'), 'Should show correct record');
});

test('should handle rikishi with special characters in record', () => {
  const card = createCard('Y1e Hoshoryu 15-0 Y', 12451, '202501');

  const html = card.innerHTML;
  assert(html.includes('>Hoshoryu<'), 'Should show name correctly');
  assert(html.includes('>15-0<'), 'Should show record without special character');
});