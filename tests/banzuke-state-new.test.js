import './test-setup.js';
import {
  clearSavedState,
  extractBanzukeState,
  hasSavedState,
  restoreBanzukeState,
  saveBanzukeState
} from '../banzuke-state.js';

// Mock localStorage
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

// Set up DOM
function setupDOM() {
  document.body.innerHTML = `
    <div id="tableLiner">
      <table id="banzuke1">
        <tbody>
          <tr class="san">
            <td class="redips-only Y1e">
              <span style="display:none">Y1e Hoshoryu 0-0</span>
              <div id="Y1e" class="redips-drag se" data-rid="12451" title="Right-click to mark as retired">
                Y1e <a href="https://sumodb.sumogames.de/Rikishi.aspx?r=12451" target="_blank">Hoshoryu</a> <a href="https://sumodb.sumogames.de/Rikishi_basho.aspx?r=12451&b=202501" target="_blank">0-0</a>
              </div>
            </td>
            <th>Y1</th>
            <td class="redips-only Y1w"></td>
          </tr>
          <tr>
            <td class="redips-only M1e"></td>
            <th>M1</th>
            <td class="redips-only M1w"></td>
          </tr>
        </tbody>
      </table>
      <table id="banzuke2">
        <tbody>
          <tr class="san">
            <td class="ch"> </td>
            <td class="redips-only b2">
              <div id="Y1e" class="redips-drag se" data-rid="12451">
                Y1e <a href="https://sumodb.sumogames.de/Rikishi.aspx?r=12451" target="_blank">Hoshoryu</a> <a href="https://sumodb.sumogames.de/Rikishi_basho.aspx?r=12451&b=202501" target="_blank">8-7</a>
              </div>
            </td>
            <th>Y1</th>
            <td class="redips-only b2"></td>
            <td class="ch">
              <a href="https://sumodb.sumogames.de/Query.aspx?show_form=0&form1_rank=Y1e&form1_wins=8&form1_year=193905-194401,194905-now&form2_highlight=on&form2_rank=Y1e" target="_blank" title="Click to run a SumoDB query">⇄</a>
            </td>
          </tr>
        </tbody>
      </table>
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
  assert(state.timestamp);

  // Check old banzuke structure
  assert.equal(state.oldBanzuke.length, 2);
  assert.equal(state.oldBanzuke[0].className, 'san');
  assert.equal(state.oldBanzuke[0].cells.length, 3);

  // Check rikishi data
  const rikishiCell = state.oldBanzuke[0].cells[0];
  assert.equal(rikishiCell.className, 'redips-only Y1e');
  assert.equal(rikishiCell.rikishi.length, 1);
  assert.equal(rikishiCell.rikishi[0].id, 'Y1e');
  assert.equal(rikishiCell.rikishi[0].dataRid, '12451');
  assert.equal(rikishiCell.rikishi[0].links.length, 2);

  // Check new banzuke with change links
  const changeCell = state.newBanzuke[0].cells[4];
  assert.equal(changeCell.className, 'ch');
  assert.equal(changeCell.changeLinks.length, 1);
  assert(changeCell.changeLinks[0].href.includes('sumodb'));
});

test('saveBanzukeState stores state in localStorage', () => {
  saveBanzukeState();

  const saved = localStorage.getItem('banzukeState');
  assert(saved);

  const state = JSON.parse(saved);
  assert(state.oldBanzuke);
  assert(state.newBanzuke);
  assert(state.timestamp);
});

test('restoreBanzukeState recreates DOM from saved state', () => {
  // Save initial state
  saveBanzukeState();

  // Clear tables
  document.querySelector('#banzuke1 tbody').innerHTML = '';
  document.querySelector('#banzuke2 tbody').innerHTML = '';

  // Restore
  const result = restoreBanzukeState();
  assert(result === true);

  // Check restored structure
  const oldRows = document.querySelectorAll('#banzuke1 tbody tr');
  assert.equal(oldRows.length, 2);
  assert(oldRows[0].classList.contains('san'));

  // Check restored rikishi
  const rikishi = document.querySelector('#banzuke1 .redips-drag');
  assert(rikishi);
  assert.equal(rikishi.id, 'Y1e');
  assert.equal(rikishi.getAttribute('data-rid'), '12451');

  // Check restored links
  const links = rikishi.querySelectorAll('a');
  assert.equal(links.length, 2);
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
  const rikishi = document.querySelector('#banzuke1 .redips-drag');
  rikishi.className = 'redips-nodrag';
  rikishi.style.backgroundColor = '#dadada';
  rikishi.style.cursor = 'not-allowed';
  rikishi.style.color = '#3c3c3c';

  // Save and restore
  saveBanzukeState();
  document.querySelector('#banzuke1 tbody').innerHTML = '';
  restoreBanzukeState();

  // Check styling is preserved
  const restored = document.querySelector('#banzuke1 .redips-nodrag');
  assert(restored);
  assert.equal(restored.style.backgroundColor, '#dadada');
  assert.equal(restored.style.cursor, 'not-allowed');
  assert.equal(restored.style.color, '#3c3c3c');
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
  assert.equal(link.textContent, '⇄');
  assert(link.href.includes('Query.aspx'));
});

test('extractBanzukeState handles empty cells correctly', () => {
  const state = extractBanzukeState();

  // Find empty cell
  const emptyCell = state.oldBanzuke[0].cells[2]; // Y1w
  assert.equal(emptyCell.rikishi.length, 0);
  assert.equal(emptyCell.textContent, '');
});

test('restoreBanzukeState adds event handlers', () => {
  saveBanzukeState();
  document.querySelector('#banzuke1 tbody').innerHTML = '';
  restoreBanzukeState();

  const rikishi = document.querySelector('#banzuke1 .redips-drag');
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
