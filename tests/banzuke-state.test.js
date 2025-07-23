import './test-setup.js';
import {
  clearSavedState,
  extractBanzukeState,
  hasSavedState,
  loadBanzukeState,
  restoreBanzukeState,
  saveBanzukeState
} from '../banzuke-state.js';

// Setup DOM
function setupDOM() {
  document.body.innerHTML = `
    <div id="tableLiner">
      <table id="banzuke1">
        <thead>
          <tr><th class="tableTitle">Hatsu 2025</th></tr>
        </thead>
        <tbody>
          <tr class="san">
            <td class="sortable-cell Y1e">
              <div id="Y1e" class="rikishi-drag se" data-rid="12345" style="display: none;">Terunofuji 15-0</div>
            </td>
            <th>Y1</th>
            <td class="sortable-cell Y1w"></td>
          </tr>
          <tr>
            <td class="sortable-cell M1e"></td>
            <th>M1</th>
            <td class="sortable-cell M1w"></td>
          </tr>
        </tbody>
      </table>
      
      <table id="banzuke2">
        <thead>
          <tr><th class="tableTitle">Haru 2025 Guess - 1 rikishi placed</th></tr>
        </thead>
        <tbody>
          <tr class="san">
            <td class="ch"> </td>
            <td class="sortable-cell b2">
              <div id="Y1e" class="rikishi-drag se" data-rid="12345">Terunofuji 15-0</div>
            </td>
            <th>Y1</th>
            <td class="sortable-cell b2"></td>
            <td class="ch"> </td>
          </tr>
        </tbody>
      </table>
      
      <span id="rikishiCounter">1</span>
    </div>
  `;
}

beforeEach(() => {
  setupDOM();
});

test('extractBanzukeState captures all table data', () => {
  const state = extractBanzukeState();

  // Check basic structure
  assert(state.oldBanzuke);
  assert(state.newBanzuke);
  assertEquals(state.rikishiCount, '1');
  assertEquals(state.tableTitles.length, 2);
  assertEquals(state.tableTitles[0], 'Hatsu 2025');

  // Check old banzuke data
  assertEquals(state.oldBanzuke.length, 2); // 2 rows
  assertEquals(state.oldBanzuke[0].className, 'san');
  assertEquals(state.oldBanzuke[0].cells.length, 3);
  assertEquals(state.oldBanzuke[0].cells[0].rikishi.length, 1);
  assertEquals(state.oldBanzuke[0].cells[0].rikishi[0].id, 'Y1e');
  assertEquals(state.oldBanzuke[0].cells[0].rikishi[0].textContent, 'Terunofuji 15-0');
  assertEquals(state.oldBanzuke[0].cells[0].rikishi[0].style.display, 'none');

  // Check new banzuke data
  assertEquals(state.newBanzuke.length, 1);
  assertEquals(state.newBanzuke[0].cells.length, 5);
  assertEquals(state.newBanzuke[0].cells[1].rikishi.length, 1);
  assertEquals(state.newBanzuke[0].cells[1].rikishi[0].id, 'Y1e');
});

test('restoreBanzukeState recreates DOM correctly', () => {
  const originalState = extractBanzukeState();

  // Clear the tables
  document.querySelector('#banzuke1 tbody').innerHTML = '';
  document.querySelector('#banzuke2 tbody').innerHTML = '';
  document.getElementById('makRik').textContent = '0';
  document.getElementsByClassName('tableTitle')[0].textContent = '';

  // Restore state
  restoreBanzukeState(originalState);

  // Check restoration
  const restoredState = extractBanzukeState();
  assertEquals(restoredState.rikishiCount, '1');
  assertEquals(restoredState.tableTitles[0], 'Hatsu 2025');

  // Check rikishi restoration
  const oldRikishi = document.querySelector('#banzuke1 .rikishi-drag');
  assertEquals(oldRikishi.id, 'Y1e');
  assertEquals(oldRikishi.textContent, 'Terunofuji 15-0');
  assertEquals(oldRikishi.style.display, 'none');

  const newRikishi = document.querySelector('#banzuke2 .rikishi-drag');
  assertEquals(newRikishi.id, 'Y1e');
  assertEquals(newRikishi.textContent, 'Terunofuji 15-0');
});

test('saveBanzukeState and loadBanzukeState work correctly', () => {
  saveBanzukeState();

  assert(localStorage.getItem('banzukeState'));

  const loadedState = loadBanzukeState();
  assert(loadedState);
  assertEquals(loadedState.rikishiCount, '1');
  assertEquals(loadedState.tableTitles[0], 'Hatsu 2025');
});

test('hasSavedState detects saved state', () => {
  assertEquals(hasSavedState(), false);

  saveBanzukeState();
  assertEquals(hasSavedState(), true);
});

test('clearSavedState removes state', () => {
  saveBanzukeState();
  assertEquals(hasSavedState(), true);

  clearSavedState();
  assertEquals(hasSavedState(), false);
});

test('handles change column links correctly', () => {
  // Add a change link
  document.querySelector('#banzuke2 .ch').innerHTML =
    '<a href="https://sumodb.sumogames.de/Query.aspx" target="_blank">↑</a>';

  const state = extractBanzukeState();

  // Clear and restore
  document.querySelector('#banzuke2 tbody').innerHTML = '';
  restoreBanzukeState(state);

  // Check link was preserved
  const changeCell = document.querySelector('#banzuke2 .ch');
  assert(changeCell.innerHTML.includes('href'));
  assert(changeCell.innerHTML.includes('sumodb'));
});

test('handles divider rows correctly', () => {
  // Add a divider row
  const tbody = document.querySelector('#banzuke1 tbody');
  const dividerRow = document.createElement('tr');
  const dividerCell = document.createElement('th');
  dividerCell.className = 'divider';
  dividerCell.colSpan = 3;
  dividerRow.appendChild(dividerCell);
  tbody.appendChild(dividerRow);

  const state = extractBanzukeState();
  assertEquals(state.oldBanzuke.length, 3); // Now has 3 rows

  // Clear and restore
  tbody.innerHTML = '';
  restoreBanzukeState(state);

  // Check divider was restored
  const restoredDivider = tbody.querySelector('.divider');
  assert(restoredDivider);
  assertEquals(restoredDivider.colSpan, 3);
});

test('handles multiple rikishi in same cell', () => {
  // Add another rikishi to the same cell
  const cell = document.querySelector('#banzuke2 .b2');
  const newRikishi = document.createElement('div');
  newRikishi.id = 'O1e';
  newRikishi.className = 'rikishi-drag se';
  newRikishi.dataset.rid = '54321';
  newRikishi.textContent = 'Takakeisho 10-5';
  cell.appendChild(newRikishi);

  const state = extractBanzukeState();
  assertEquals(state.newBanzuke[0].cells[1].rikishi.length, 2);

  // Clear and restore
  document.querySelector('#banzuke2 tbody').innerHTML = '';
  restoreBanzukeState(state);

  // Check both rikishi restored
  const restoredCell = document.querySelector('#banzuke2 .b2');
  assertEquals(restoredCell.children.length, 2);
  assertEquals(restoredCell.children[0].id, 'Y1e');
  assertEquals(restoredCell.children[1].id, 'O1e');
});
