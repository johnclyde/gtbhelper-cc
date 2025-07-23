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
  const config = getConfig();

  assert(config.oldBanzuke, 'Should have oldBanzuke');
  assert(config.newBanzuke, 'Should have newBanzuke');

  // Check old banzuke defaults
  assertEquals(config.oldBanzuke.sanyaku.Y, 1);
  assertEquals(config.oldBanzuke.sanyaku.O, 1);
  assertEquals(config.oldBanzuke.sanyaku.S, 2);
  assertEquals(config.oldBanzuke.sanyaku.K, 2);
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
  const html = generateConfigurableOldBanzukeRows();

  // Check sanyaku
  assert(html.includes('Y1e'), 'Should include Y1e');
  assert(html.includes('O1w'), 'Should include O1w');
  assert(html.includes('S2e'), 'Should include S2e');
  assert(html.includes('K2w'), 'Should include K2w');

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
  const html = generateConfigurableNewBanzukeRows();

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

  // Makushita should be 0 by default
  let config = getConfig();
  assertEquals(config.oldBanzuke.makushita, 0);

  // Add makushita
  addDivision('oldBanzuke', 'makushita');

  config = getConfig();
  assert(config.oldBanzuke.makushita > 0, 'Makushita should have positive count');
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

  const counts = getDivisionCounts();

  // Check old banzuke counts
  assertEquals(counts.oldBanzuke.Y, 1);
  assertEquals(counts.oldBanzuke.O, 1);
  assertEquals(counts.oldBanzuke.S, 2);
  assertEquals(counts.oldBanzuke.K, 2);
  assertEquals(counts.oldBanzuke.M, 17);
  assertEquals(counts.oldBanzuke.J, 14);
  assertEquals(counts.oldBanzuke.Ms, 0);

  // Check new banzuke counts
  assertEquals(counts.newBanzuke.Y, 2);
  assertEquals(counts.newBanzuke.O, 3);
  assertEquals(counts.newBanzuke.M, 18);
});

test('negative counts are prevented', () => {
  resetToDefault();

  updateDivisionCount('oldBanzuke', 'maegashira', -5);
  const config = getConfig();
  assertEquals(config.oldBanzuke.maegashira, 0, 'Should not allow negative counts');
});

test('lower divisions can be added and removed', () => {
  resetToDefault();

  // Add all lower divisions
  addDivision('oldBanzuke', 'makushita');
  addDivision('oldBanzuke', 'sandanme');
  addDivision('oldBanzuke', 'jonidan');
  addDivision('oldBanzuke', 'jonokuchi');

  const html = generateConfigurableOldBanzukeRows();
  assert(html.includes('Ms'), 'Should include Makushita');
  assert(html.includes('Sd'), 'Should include Sandanme');
  assert(html.includes('Jd'), 'Should include Jonidan');
  assert(html.includes('Jk'), 'Should include Jonokuchi');

  // Count dividers
  const dividerCount = (html.match(/divider/g) || []).length;
  assert(dividerCount >= 4, 'Should have dividers between divisions');
});
