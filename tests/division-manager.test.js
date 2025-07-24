import {
  addDivision,
  generateConfigurableNewBanzukeRows,
  generateConfigurableOldBanzukeRows,
  getConfig,
  getDivisionCounts,
  removeDivision,
  resetToDefault,
  saveConfig,
  updateDivisionCount,
  updateSanyakuCount
} from '../division-manager.js';

test('getConfig returns default configuration when nothing saved', () => {
  localStorage.clear();
  resetToDefault(); // Ensure we're at defaults
  const config = getConfig();

  assert(config.oldBanzuke, 'Should have oldBanzuke');
  assert(config.newBanzuke, 'Should have newBanzuke');

  // Check old banzuke defaults
  assertEquals(config.oldBanzuke.sanyaku.Y, 1);
  assertEquals(config.oldBanzuke.sanyaku.O, 1);
  assertEquals(config.oldBanzuke.sanyaku.S, 1);
  assertEquals(config.oldBanzuke.sanyaku.K, 1);
  assertEquals(config.oldBanzuke.maegashira, 17);
  assertEquals(config.oldBanzuke.juryo, 14);
  assertEquals(config.oldBanzuke.makushita, 0);

  // Check new banzuke defaults
  assertEquals(config.newBanzuke.sanyaku.Y, 2);
  assertEquals(config.newBanzuke.sanyaku.O, 3);
  assertEquals(config.newBanzuke.maegashira, 18);
});

test('saveConfig and getConfig work together', () => {
  localStorage.clear();

  const testConfig = {
    oldBanzuke: {
      sanyaku: { Y: 2, O: 2, S: 3, K: 3 },
      maegashira: 16,
      juryo: 12,
      makushita: 5,
      sandanme: 0,
      jonidan: 0,
      jonokuchi: 0
    },
    newBanzuke: {
      sanyaku: { Y: 3, O: 4, S: 3, K: 3 },
      maegashira: 20,
      juryo: 14,
      makushita: 0,
      sandanme: 0,
      jonidan: 0,
      jonokuchi: 0
    }
  };

  saveConfig(testConfig);
  const loaded = getConfig();

  assertEquals(loaded.oldBanzuke.sanyaku.Y, 2);
  assertEquals(loaded.oldBanzuke.maegashira, 16);
  assertEquals(loaded.newBanzuke.sanyaku.O, 4);
  assertEquals(loaded.newBanzuke.maegashira, 20);
});

test('generateConfigurableOldBanzukeRows generates correct HTML', () => {
  resetToDefault();
  const fragment = generateConfigurableOldBanzukeRows();
  
  // Convert fragment to string for testing
  const div = document.createElement('div');
  div.appendChild(fragment);
  const html = div.innerHTML;

  // Check sanyaku
  assert(html.includes('Y1e'), 'Should include Y1e');
  assert(html.includes('O1w'), 'Should include O1w');
  assert(html.includes('S1e'), 'Should include S1e');
  assert(html.includes('K1w'), 'Should include K1w');

  // Check maegashira
  assert(html.includes('M1e'), 'Should include M1e');
  assert(html.includes('M17w'), 'Should include M17w');

  // Check juryo
  assert(html.includes('J1e'), 'Should include J1e');
  assert(html.includes('J14w'), 'Should include J14w');

  // Should not include lower divisions by default
  assert(!html.includes('Ms'), 'Should not include Makushita');
  assert(!html.includes('Sd'), 'Should not include Sandanme');
});

test('generateConfigurableNewBanzukeRows generates correct HTML', () => {
  resetToDefault();
  const fragment = generateConfigurableNewBanzukeRows();
  
  // Convert fragment to string for testing
  const div = document.createElement('div');
  div.appendChild(fragment);
  const html = div.innerHTML;

  // Check extended sanyaku
  assert(html.includes('>Y1<'), 'Should include Y1');
  assert(html.includes('>Y2<'), 'Should include Y2');
  assert(html.includes('>O1<'), 'Should include O1');
  assert(html.includes('>O2<'), 'Should include O2');
  assert(html.includes('>O3<'), 'Should include O3');

  // Check change columns
  assert(html.includes('class="ch"'), 'Should include change columns');
  assert(html.includes('class="sortable-cell b2"'), 'Should include b2 class');

  // Check extended maegashira
  assert(html.includes('>M18<'), 'Should include M18');
});

test('updateDivisionCount updates configuration', () => {
  resetToDefault();

  updateDivisionCount('oldBanzuke', 'maegashira', 20);
  const config = getConfig();
  assertEquals(config.oldBanzuke.maegashira, 20);

  updateDivisionCount('newBanzuke', 'juryo', 16);
  const config2 = getConfig();
  assertEquals(config2.newBanzuke.juryo, 16);
});

test('updateSanyakuCount updates sanyaku ranks', () => {
  resetToDefault();

  updateSanyakuCount('oldBanzuke', 'Y', 3);
  updateSanyakuCount('oldBanzuke', 'O', 4);

  const config = getConfig();
  assertEquals(config.oldBanzuke.sanyaku.Y, 3);
  assertEquals(config.oldBanzuke.sanyaku.O, 4);
});

test('addDivision sets default count for division', () => {
  resetToDefault();

  // First remove juryo completely
  updateDivisionCount('oldBanzuke', 'juryo', 0);
  let config = getConfig();
  assertEquals(config.oldBanzuke.juryo, 0);

  // Add juryo back - should restore to default (14)
  addDivision('oldBanzuke', 'juryo');

  config = getConfig();
  assertEquals(config.oldBanzuke.juryo, 14, 'Juryo should be restored to default count');
});

test('removeDivision sets count to 0', () => {
  resetToDefault();

  // First set juryo to a value
  updateDivisionCount('oldBanzuke', 'juryo', 14);
  let config = getConfig();
  assertEquals(config.oldBanzuke.juryo, 14);

  // Remove juryo
  removeDivision('oldBanzuke', 'juryo');

  config = getConfig();
  assertEquals(config.oldBanzuke.juryo, 0);
});

test('getDivisionCounts returns flat structure', () => {
  resetToDefault();

  const oldCounts = getDivisionCounts('oldBanzuke');

  // Check old banzuke counts
  assertEquals(oldCounts.Y, 1);
  assertEquals(oldCounts.O, 1);
  assertEquals(oldCounts.S, 1);
  assertEquals(oldCounts.K, 1);
  assertEquals(oldCounts.M, 17);
  assertEquals(oldCounts.J, 14);
  assertEquals(oldCounts.Ms, 0);

  const newCounts = getDivisionCounts('newBanzuke');
  
  // Check new banzuke counts
  assertEquals(newCounts.Y, 2);
  assertEquals(newCounts.O, 3);
  assertEquals(newCounts.M, 18);
});

test('negative counts are prevented', () => {
  resetToDefault();

  updateDivisionCount('oldBanzuke', 'maegashira', -5);
  const config = getConfig();
  assertEquals(config.oldBanzuke.maegashira, 0, 'Should not allow negative counts');
});

test('lower divisions can be added and removed', () => {
  resetToDefault();

  // First need to set non-zero defaults for lower divisions since they're 0 by default
  updateDivisionCount('oldBanzuke', 'makushita', 60);
  updateDivisionCount('oldBanzuke', 'sandanme', 90);
  updateDivisionCount('oldBanzuke', 'jonidan', 100);
  updateDivisionCount('oldBanzuke', 'jonokuchi', 50);

  const fragment = generateConfigurableOldBanzukeRows();
  
  // Convert fragment to string for testing
  const div = document.createElement('div');
  div.appendChild(fragment);
  const html = div.innerHTML;
  
  assert(html.includes('Ms'), 'Should include Makushita');
  assert(html.includes('Sd'), 'Should include Sandanme');
  assert(html.includes('Jd'), 'Should include Jonidan');
  assert(html.includes('Jk'), 'Should include Jonokuchi');

  // Count dividers
  const dividerCount = (html.match(/divider/g) || []).length;
  assert(dividerCount >= 4, 'Should have dividers between divisions');
});
