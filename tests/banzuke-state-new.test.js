import './test-setup.js';
import {
  clearSavedState,
  extractBanzukeState,
  hasSavedState,
  loadBanzukeState,
  restoreBanzukeState,
  saveBanzukeState
} from '../banzuke-state.js';

// Set up DOM
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
              <div id="Y1e" class="rikishi-drag se" data-rid="12451">
                Y1e <a href="https://sumodb.sumogames.de/Rikishi.aspx?r=12451" target="_blank">Hoshoryu</a> <a href="https://sumodb.sumogames.de/Rikishi_basho.aspx?r=12451&b=202501" target="_blank">0-0</a>
              </div>
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
          <tr><th class="tableTitle">Haru 2025</th></tr>
        </thead>
        <tbody>
          <tr class="san">
            <td class="ch"> </td>
            <td class="sortable-cell b2">
              <div id="Y1e" class="rikishi-drag se" data-rid="12451">
                Y1e <a href="https://sumodb.sumogames.de/Rikishi.aspx?r=12451" target="_blank">Hoshoryu</a> <a href="https://sumodb.sumogames.de/Rikishi_basho.aspx?r=12451&b=202501" target="_blank">8-7</a>
              </div>
            </td>
            <th>Y1</th>
            <td class="sortable-cell b2"></td>
            <td class="ch">
              <a href="https://sumodb.sumogames.de/Query.aspx?show_form=0&form1_rank=Y1e&form1_wins=8&form1_year=193905-194401,194905-now&form2_highlight=on&form2_rank=Y1e" target="_blank" title="Click to run a SumoDB query">⇄</a>
            </td>
          </tr>
        </tbody>
      </table>
      <span id="rikishiCounter">1</span>
    </div>
  `;
}

beforeEach(() => {
  setupDOM();
  localStorage.clear();
});

test('extractBanzukeState captures complete table structure', () => {
  const state = extractBanzukeState();

  console.log('State:', JSON.stringify(state, null, 2));
  assert(state.oldBanzuke);
  assert(state.newBanzuke);

  // Check old banzuke structure
  assertEquals(state.oldBanzuke.length, 2);
  assertEquals(state.oldBanzuke[0].className, 'san');
  assertEquals(state.oldBanzuke[0].cells.length, 3);

  // Check rikishi data
  const rikishiCell = state.oldBanzuke[0].cells[0];
  assertEquals(rikishiCell.className, 'sortable-cell Y1e');
  assertEquals(rikishiCell.rikishi.length, 1);
  assertEquals(rikishiCell.rikishi[0].id, 'Y1e');
  assertEquals(rikishiCell.rikishi[0].dataset.rid, '12451');
  assertEquals(rikishiCell.rikishi[0].className, 'rikishi-drag se');

  // Check new banzuke with change links
  const changeCell = state.newBanzuke[0].cells[4];
  assertEquals(changeCell.className, 'ch');
  assert(changeCell.innerHTML.includes('sumodb'));
});

test('saveBanzukeState stores state in localStorage', () => {
  saveBanzukeState();

  const saved = localStorage.getItem('banzukeState');
  assert(saved);

  const state = JSON.parse(saved);
  assert(state.oldBanzuke);
  assert(state.newBanzuke);
  assertEquals(state.rikishiCount, '0');
});

test('restoreBanzukeState recreates DOM from saved state', () => {
  // Save initial state
  saveBanzukeState();

  // Clear tables
  document.querySelector('#banzuke1 tbody').innerHTML = '';
  document.querySelector('#banzuke2 tbody').innerHTML = '';

  // Restore from localStorage
  const savedState = loadBanzukeState();
  console.log('Saved state:', savedState);
  restoreBanzukeState(savedState);

  // Check restored structure
  const oldRows = document.querySelectorAll('#banzuke1 tbody tr');
  console.log('Old rows found:', oldRows.length);
  assertEquals(oldRows.length, 2);
  assert(oldRows[0].classList.contains('san'));

  // Check restored rikishi
  const rikishi = document.querySelector('#banzuke1 .rikishi-drag');
  assert(rikishi);
  assertEquals(rikishi.id, 'Y1e');
  assertEquals(rikishi.getAttribute('data-rid'), '12451');

  // Check restored links
  const links = rikishi.querySelectorAll('a');
  assertEquals(links.length, 2);
  assert(links[0].href.includes('Rikishi.aspx'));
  assert(links[1].href.includes('Rikishi_basho.aspx'));
});

test('hasSavedState correctly detects saved state', () => {
  assert(!hasSavedState());

  saveBanzukeState();
  assert(hasSavedState());

  clearSavedState();
  assert(!hasSavedState());
});

test('clearSavedState removes all saved data', () => {
  saveBanzukeState();
  localStorage.setItem('banzuke', 'old-format-data');

  clearSavedState();

  assert(!localStorage.getItem('banzukeState'));
  assert(!localStorage.getItem('banzuke'));
});

test('restoreBanzukeState handles retired rikishi styling', () => {
  // Create a retired rikishi
  const rikishi = document.querySelector('#banzuke1 .rikishi-drag');
  rikishi.className = 'rikishi-nodrag';
  rikishi.style.backgroundColor = '#dadada';
  rikishi.style.cursor = 'not-allowed';
  rikishi.style.color = '#3c3c3c';

  // Save and restore
  saveBanzukeState();
  document.querySelector('#banzuke1 tbody').innerHTML = '';
  restoreBanzukeState();

  // Check styling is preserved
  const restored = document.querySelector('#banzuke1 .rikishi-nodrag');
  assert(restored);
  assertEquals(restored.style.backgroundColor, '#dadada');
  assertEquals(restored.style.cursor, 'not-allowed');
  assertEquals(restored.style.color, '#3c3c3c');
});

test('restoreBanzukeState preserves change column links', () => {
  saveBanzukeState();

  // Clear and restore
  document.querySelector('#banzuke2 tbody').innerHTML = '';
  restoreBanzukeState();

  // Check change links are restored
  const changeCell = document.querySelector('#banzuke2 .ch:last-child');
  assert(changeCell);
  const link = changeCell.querySelector('a');
  assert(link);
  assertEquals(link.textContent, '⇄');
  assert(link.href.includes('Query.aspx'));
});

test('extractBanzukeState handles empty cells correctly', () => {
  const state = extractBanzukeState();

  // Find empty cell
  const emptyCell = state.oldBanzuke[0].cells[2]; // Y1w
  assertEquals(emptyCell.rikishi.length, 0);
  assertEquals(emptyCell.textContent, '');
});

test('restoreBanzukeState adds event handlers', () => {
  saveBanzukeState();
  document.querySelector('#banzuke1 tbody').innerHTML = '';
  restoreBanzukeState();

  const rikishi = document.querySelector('#banzuke1 .rikishi-drag');
  assert(rikishi);

  // Check that contextmenu event is handled
  let prevented = false;
  const event = new window.Event('contextmenu');
  event.preventDefault = () => {
    prevented = true;
  };
  rikishi.dispatchEvent(event);
  assert(prevented);
});
