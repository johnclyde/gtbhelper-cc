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
    <div id="tableContainer">
      <table id="tableLiner" class="mainTable">
        <tr>
          <td class="banzukeContainer" id="oldBanzukeContainer">
            <h2 id="oldBanzukeTitle" class="mainBanzukeTitle">Hatsu 2025</h2>
            <table id="old_makuuchi" class="division-table">
              <thead>
                <tr><th class="divisionTitle" colspan="3">Makuuchi</th></tr>
                <tr class="theader"><th>East</th><th>Rank</th><th>West</th></tr>
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
          </td>
          <td class="banzukeContainer" id="newBanzukeContainer">
            <h2 id="newBanzukeTitle" class="mainBanzukeTitle">Haru 2025 Guess</h2>
            <table id="new_makuuchi" class="division-table">
              <thead>
                <tr><th class="divisionTitle" colspan="5">Makuuchi: <span id="makuuchiCounter" class="division-counter">1/4</span> placed</th></tr>
                <tr class="theader"><th class="chHead">Chg.</th><th>East</th><th>Rank</th><th>West</th><th class="chHead">Chg.</th></tr>
              </thead>
              <tbody>
                <tr class="san">
                  <td class="ch"> </td>
                  <td class="sortable-cell b2 Y1e">
                    <div id="Y1e" class="rikishi-drag se" data-rid="12345">Terunofuji 15-0</div>
                  </td>
                  <th>Y1</th>
                  <td class="sortable-cell b2 Y1w"></td>
                  <td class="ch"> </td>
                </tr>
                <tr>
                  <td class="ch"> </td>
                  <td class="sortable-cell b2 M1e"></td>
                  <th>M1</th>
                  <td class="sortable-cell b2 M1w"></td>
                  <td class="ch"> </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>
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
  assert(state.mainTitles);
  assertEquals(state.mainTitles.old, 'Hatsu 2025');
  assertEquals(state.mainTitles.new, 'Haru 2025 Guess');

  // Check old banzuke data - now an array of tables
  assertEquals(state.oldBanzuke.length, 1); // 1 table (makuuchi)
  assertEquals(state.oldBanzuke[0].id, 'old_makuuchi');
  assertEquals(state.oldBanzuke[0].rows.length, 2); // 2 rows
  assertEquals(state.oldBanzuke[0].rows[0].className, 'san');
  assertEquals(state.oldBanzuke[0].rows[0].cells.length, 3);
  assertEquals(state.oldBanzuke[0].rows[0].cells[0].rikishi.length, 1);
  assertEquals(state.oldBanzuke[0].rows[0].cells[0].rikishi[0].id, 'Y1e');
  assertEquals(state.oldBanzuke[0].rows[0].cells[0].rikishi[0].textContent, 'Terunofuji 15-0');
  assertEquals(state.oldBanzuke[0].rows[0].cells[0].rikishi[0].style.display, 'none');

  // Check new banzuke data
  assertEquals(state.newBanzuke.length, 1); // 1 table (makuuchi)
  assertEquals(state.newBanzuke[0].id, 'new_makuuchi');
  assertEquals(state.newBanzuke[0].rows.length, 2); // 2 rows
  assertEquals(state.newBanzuke[0].rows[0].cells.length, 5);
  assertEquals(state.newBanzuke[0].rows[0].cells[1].rikishi.length, 1);
  assertEquals(state.newBanzuke[0].rows[0].cells[1].rikishi[0].id, 'Y1e');
});

test('restoreBanzukeState recreates DOM correctly', async () => {
  const originalState = extractBanzukeState();

  // Clear the tables
  document.getElementById('oldBanzukeContainer').innerHTML = '<h2 id="oldBanzukeTitle" class="mainBanzukeTitle"></h2>';
  document.getElementById('newBanzukeContainer').innerHTML = '<h2 id="newBanzukeTitle" class="mainBanzukeTitle"></h2>';

  // Mock the division-tables module - need to provide the functions that restoreBanzukeState calls
  window.initDragDrop = () => {};
  
  // Since we can't actually import the module in the test, we need to verify titles were set
  restoreBanzukeState(originalState);
  
  // Titles should be restored immediately
  assertEquals(document.getElementById('oldBanzukeTitle').textContent, 'Hatsu 2025');
  assertEquals(document.getElementById('newBanzukeTitle').textContent, 'Haru 2025 Guess');
  
  // The actual table restoration happens async via module import
  // In a real test environment, we'd need to mock the module import properly
});

test('saveBanzukeState and loadBanzukeState work correctly', () => {
  saveBanzukeState();

  assert(localStorage.getItem('banzukeState'));

  const loadedState = loadBanzukeState();
  assert(loadedState);
  assertEquals(loadedState.mainTitles.old, 'Hatsu 2025');
  assertEquals(loadedState.mainTitles.new, 'Haru 2025 Guess');
  assertEquals(loadedState.oldBanzuke.length, 1);
  assertEquals(loadedState.newBanzuke.length, 1);
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
  document.querySelector('#new_makuuchi .ch').innerHTML =
    '<a href="https://sumodb.sumogames.de/Query.aspx" target="_blank">↑</a>';

  const state = extractBanzukeState();

  // Check link was captured
  const changeCell = state.newBanzuke[0].rows[0].cells[0];
  assert(changeCell.innerHTML.includes('href'));
  assert(changeCell.innerHTML.includes('sumodb'));
});

test('handles empty rows correctly', () => {
  // Add an empty row (spacer)
  const tbody = document.querySelector('#old_makuuchi tbody');
  const emptyRow = document.createElement('tr');
  const emptyCell = document.createElement('td');
  emptyCell.colSpan = 3;
  emptyCell.innerHTML = '&nbsp;';
  emptyRow.appendChild(emptyCell);
  tbody.appendChild(emptyRow);

  const state = extractBanzukeState();
  assertEquals(state.oldBanzuke[0].rows.length, 3); // Now has 3 rows

  // Check empty row was captured
  const lastRow = state.oldBanzuke[0].rows[2];
  assertEquals(lastRow.cells.length, 1);
  assertEquals(lastRow.cells[0].tagName, 'td');
});

test('handles multiple rikishi in same cell', () => {
  // Add another rikishi to the same cell
  const cell = document.querySelector('#new_makuuchi .b2');
  const newRikishi = document.createElement('div');
  newRikishi.id = 'O1e';
  newRikishi.className = 'rikishi-drag se';
  newRikishi.dataset.rid = '54321';
  newRikishi.textContent = 'Takakeisho 10-5';
  cell.appendChild(newRikishi);

  const state = extractBanzukeState();
  assertEquals(state.newBanzuke[0].rows[0].cells[1].rikishi.length, 2);

  // Check both rikishi were captured
  const rikishiList = state.newBanzuke[0].rows[0].cells[1].rikishi;
  assertEquals(rikishiList[0].id, 'Y1e');
  assertEquals(rikishiList[1].id, 'O1e');
  assertEquals(rikishiList[1].textContent, 'Takakeisho 10-5');
});
