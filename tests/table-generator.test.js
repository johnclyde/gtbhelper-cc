import { generateNewBanzukeRows, generateOldBanzukeRows } from '../table-generator.js';

test('generateOldBanzukeRows includes all required ranks', () => {
  const html = generateOldBanzukeRows();

  // Check sanyaku ranks
  assert(html.includes('Y1e'), 'Should include Y1e');
  assert(html.includes('Y1w'), 'Should include Y1w');
  assert(html.includes('O1e'), 'Should include O1e');
  assert(html.includes('S1e'), 'Should include S1e');
  assert(html.includes('S2e'), 'Should include S2e');
  assert(html.includes('K1e'), 'Should include K1e');
  assert(html.includes('K2e'), 'Should include K2e');

  // Check maegashira ranks
  for (let i = 1; i <= 17; i++) {
    assert(html.includes(`M${i}e`), `Should include M${i}e`);
    assert(html.includes(`M${i}w`), `Should include M${i}w`);
  }

  // Check juryo ranks
  for (let i = 1; i <= 14; i++) {
    assert(html.includes(`J${i}e`), `Should include J${i}e`);
    assert(html.includes(`J${i}w`), `Should include J${i}w`);
  }

  // Check divider
  assert(html.includes('divider'), 'Should include divider between divisions');
});

test('generateOldBanzukeRows has correct structure', () => {
  const html = generateOldBanzukeRows();

  // Check for sanyaku class
  assert(html.includes('class="san"'), 'Should include sanyaku class');

  // Check for redips-only class
  assert(html.includes('class="redips-only'), 'Should include redips-only class');

  // Count table rows
  const rowCount = (html.match(/<tr/g) || []).length;
  assertEquals(
    rowCount,
    38,
    'Should have 38 rows (6 sanyaku + 17 maegashira + 1 divider + 14 juryo)'
  );
});

test('generateNewBanzukeRows includes extended ranks', () => {
  const html = generateNewBanzukeRows();

  // Check for Y2
  assert(html.includes('>Y2<'), 'Should include Y2');

  // Check for O2 and O3
  assert(html.includes('>O2<'), 'Should include O2');
  assert(html.includes('>O3<'), 'Should include O3');

  // Check for extended maegashira
  assert(html.includes('>M17<'), 'Should include M17');
  assert(html.includes('>M18<'), 'Should include M18');

  // Check for juryo ranks
  for (let i = 1; i <= 14; i++) {
    assert(html.includes(`>J${i}<`), `Should include J${i}`);
  }
});

test('generateNewBanzukeRows includes change columns', () => {
  const html = generateNewBanzukeRows();

  // Check for change cells
  assert(html.includes('class="ch"'), 'Should include change cells');

  // Count change cells - should be 2 per row
  const changeCount = (html.match(/class="ch"/g) || []).length;
  assert(changeCount > 50, 'Should have many change cells (2 per row)');

  // Check b2 class for new banzuke
  assert(html.includes('class="redips-only b2"'), 'Should include b2 class');
});
