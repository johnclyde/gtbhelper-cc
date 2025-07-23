// Tests for DOM manipulation in division management

import {
  addDivision,
  removeDivision,
  updateDivisionCount,
  updateSanyakuCount
} from '../division-manager.js';

// Mock DOM environment for tests
function setupDOM() {
  document.body.innerHTML = `
    <table id="banzuke1">
      <tbody>
        <tr class="san"><td class="redips-only Y1e"></td><th>Y1</th><td class="redips-only Y1w"></td></tr>
        <tr class="san"><td class="redips-only O1e"></td><th>O1</th><td class="redips-only O1w"></td></tr>
        <tr class="san"><td class="redips-only S1e"></td><th>S1</th><td class="redips-only S1w"></td></tr>
        <tr class="san"><td class="redips-only S2e"></td><th>S2</th><td class="redips-only S2w"></td></tr>
        <tr><td class="redips-only M1e"></td><th>M1</th><td class="redips-only M1w"></td></tr>
        <tr><td class="redips-only M2e"></td><th>M2</th><td class="redips-only M2w"></td></tr>
      </tbody>
    </table>
    <table id="banzuke2">
      <tbody>
        <tr class="san"><td class="ch"> </td><td class="redips-only b2"></td><th>Y1</th><td class="redips-only b2"></td><td class="ch"> </td></tr>
      </tbody>
    </table>
  `;
}

test('updateDivisionCount adds rows to old banzuke', () => {
  setupDOM();
  const tbody = document.querySelector('#banzuke1 tbody');
  const initialRowCount = tbody.querySelectorAll('tr').length;

  // Add 2 more maegashira ranks (M3 and M4)
  updateDivisionCount('oldBanzuke', 'maegashira', 4);

  const newRowCount = tbody.querySelectorAll('tr').length;
  assertEquals(newRowCount, initialRowCount + 2, 'Should add 2 rows');

  // Check that M3 and M4 were added
  const m3Row = Array.from(tbody.querySelectorAll('th')).find((th) => th.textContent === 'M3');
  assert(m3Row, 'M3 should be added');
  assertEquals(m3Row.parentElement.querySelector('.redips-only').className, 'redips-only M3e');

  const m4Row = Array.from(tbody.querySelectorAll('th')).find((th) => th.textContent === 'M4');
  assert(m4Row, 'M4 should be added');
});

test('updateDivisionCount removes rows from old banzuke', () => {
  setupDOM();

  // Start with 2 maegashira, reduce to 1
  updateDivisionCount('oldBanzuke', 'maegashira', 1);

  const tbody = document.querySelector('#banzuke1 tbody');
  const m2Row = Array.from(tbody.querySelectorAll('th')).find((th) => th.textContent === 'M2');
  assert(!m2Row, 'M2 should be removed');

  const m1Row = Array.from(tbody.querySelectorAll('th')).find((th) => th.textContent === 'M1');
  assert(m1Row, 'M1 should still exist');
});

test('updateSanyakuCount adds sanyaku rows', () => {
  setupDOM();
  const tbody = document.querySelector('#banzuke1 tbody');

  // Add a second Yokozuna
  updateSanyakuCount('oldBanzuke', 'Y', 2);

  const y2Row = Array.from(tbody.querySelectorAll('th')).find((th) => th.textContent === 'Y2');
  assert(y2Row, 'Y2 should be added');
  assert(y2Row.parentElement.className.includes('san'), 'Y2 should have san class');
});

test('updateSanyakuCount on new banzuke has correct structure', () => {
  setupDOM();

  // Add Y2 to new banzuke
  updateSanyakuCount('newBanzuke', 'Y', 2);

  const tbody = document.querySelector('#banzuke2 tbody');
  const y2Row = Array.from(tbody.querySelectorAll('th')).find((th) => th.textContent === 'Y2');
  assert(y2Row, 'Y2 should be added');

  const row = y2Row.parentElement;
  assertEquals(row.children.length, 5, 'New banzuke row should have 5 cells');
  assertEquals(row.children[0].className, 'ch', 'First cell should be change column');
  assertEquals(row.children[1].className, 'redips-only b2', 'Second cell should be east');
  assertEquals(row.children[2].tagName, 'TH', 'Third cell should be rank header');
  assertEquals(row.children[3].className, 'redips-only b2', 'Fourth cell should be west');
  assertEquals(row.children[4].className, 'ch', 'Fifth cell should be change column');
});

test('addDivision creates multiple rows for lower division', () => {
  setupDOM();
  const tbody = document.querySelector('#banzuke1 tbody');

  // Add makushita division (should create 15 rows by default)
  addDivision('oldBanzuke', 'makushita');

  const msRows = Array.from(tbody.querySelectorAll('th')).filter((th) =>
    th.textContent.startsWith('Ms')
  );
  assertEquals(msRows.length, 15, 'Should create 15 makushita rows');

  // Check first and last
  assert(
    msRows.some((th) => th.textContent === 'Ms1'),
    'Should have Ms1'
  );
  assert(
    msRows.some((th) => th.textContent === 'Ms15'),
    'Should have Ms15'
  );
});

test('removeDivision removes all rows for a division', () => {
  setupDOM();

  // First add makushita
  addDivision('oldBanzuke', 'makushita');

  const tbody = document.querySelector('#banzuke1 tbody');
  let msRows = Array.from(tbody.querySelectorAll('th')).filter((th) =>
    th.textContent.startsWith('Ms')
  );
  assert(msRows.length > 0, 'Makushita rows should exist');

  // Now remove it
  removeDivision('oldBanzuke', 'makushita');

  msRows = Array.from(tbody.querySelectorAll('th')).filter((th) => th.textContent.startsWith('Ms'));
  assertEquals(msRows.length, 0, 'All makushita rows should be removed');
});

test('rows are inserted in correct order', () => {
  setupDOM();

  // Add M3 and M4
  updateDivisionCount('oldBanzuke', 'maegashira', 4);

  const tbody = document.querySelector('#banzuke1 tbody');
  const ranks = Array.from(tbody.querySelectorAll('th')).map((th) => th.textContent);

  // Check order
  const m1Index = ranks.indexOf('M1');
  const m2Index = ranks.indexOf('M2');
  const m3Index = ranks.indexOf('M3');
  const m4Index = ranks.indexOf('M4');

  assert(m1Index < m2Index, 'M1 should come before M2');
  assert(m2Index < m3Index, 'M2 should come before M3');
  assert(m3Index < m4Index, 'M3 should come before M4');
});

test('preserves existing content when adding rows', () => {
  setupDOM();
  const tbody = document.querySelector('#banzuke1 tbody');

  // Add some content to M1e cell
  const m1eCell = tbody.querySelector('.M1e');
  const testDiv = document.createElement('div');
  testDiv.className = 'test-rikishi';
  testDiv.textContent = 'Test Rikishi';
  m1eCell.appendChild(testDiv);

  // Add more maegashira ranks
  updateDivisionCount('oldBanzuke', 'maegashira', 3);

  // Check that our test content is still there
  const preservedDiv = tbody.querySelector('.test-rikishi');
  assert(preservedDiv, 'Test content should be preserved');
  assertEquals(preservedDiv.textContent, 'Test Rikishi', 'Content should be unchanged');
});

test('handles division count of 0', () => {
  setupDOM();

  // Remove all maegashira
  updateDivisionCount('oldBanzuke', 'maegashira', 0);

  const tbody = document.querySelector('#banzuke1 tbody');
  const mRows = Array.from(tbody.querySelectorAll('th')).filter((th) =>
    th.textContent.startsWith('M')
  );
  assertEquals(mRows.length, 0, 'All maegashira rows should be removed');
});

test('negative counts are prevented at DOM level', () => {
  setupDOM();
  const tbody = document.querySelector('#banzuke1 tbody');
  const initialRowCount = tbody.querySelectorAll('tr').length;

  // Try to set negative count
  updateDivisionCount('oldBanzuke', 'maegashira', -5);

  const newRowCount = tbody.querySelectorAll('tr').length;
  assertEquals(newRowCount, initialRowCount - 2, 'Should remove all M rows but not go negative');

  const mRows = Array.from(tbody.querySelectorAll('th')).filter((th) =>
    th.textContent.startsWith('M')
  );
  assertEquals(mRows.length, 0, 'No M rows should exist');
});
