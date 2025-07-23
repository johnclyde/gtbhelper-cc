// Test for division manager configuration handling
import './test-setup.js';
import { getConfig, getDivisionCounts, resetToDefault, saveConfig } from '../division-manager.js';

beforeEach(() => {
  // localStorage is cleared automatically by test-setup.js
});

test('should return default config when localStorage is empty', () => {
  const config = getConfig();

  assert(config.oldBanzuke, 'Should have oldBanzuke');
  assert(config.newBanzuke, 'Should have newBanzuke');
  assert(config.oldBanzuke.sanyaku, 'Should have sanyaku in oldBanzuke');
  assert(config.newBanzuke.sanyaku, 'Should have sanyaku in newBanzuke');

  // Check default values
  assertEquals(config.oldBanzuke.sanyaku.Y, 1, 'Default Y count should be 1');
  assertEquals(config.oldBanzuke.maegashira, 17, 'Default M count should be 17');
  assertEquals(config.newBanzuke.sanyaku.Y, 2, 'New banzuke Y count should be 2');
});

test('should handle invalid config in localStorage', () => {
  // Store invalid config
  localStorage.setItem(
    'banzukeDivisionConfig',
    JSON.stringify({
      invalid: 'structure'
    })
  );

  const config = getConfig();

  // Should return default config
  assert(config.oldBanzuke, 'Should return default config for invalid data');
  assert(config.oldBanzuke.sanyaku, 'Should have valid structure');
});

test('should handle corrupted JSON in localStorage', () => {
  // Store corrupted JSON
  localStorage.setItem('banzukeDivisionConfig', 'not valid json');

  const config = getConfig();

  // Should return default config
  assert(config.oldBanzuke, 'Should return default config for corrupted data');
});

test('should save and load config correctly', () => {
  const customConfig = {
    oldBanzuke: {
      sanyaku: { Y: 2, O: 2, S: 2, K: 2 },
      maegashira: 20,
      juryo: 15,
      makushita: 10,
      sandanme: 0,
      jonidan: 0,
      jonokuchi: 0
    },
    newBanzuke: {
      sanyaku: { Y: 3, O: 3, S: 3, K: 3 },
      maegashira: 20,
      juryo: 15,
      makushita: 10,
      sandanme: 0,
      jonidan: 0,
      jonokuchi: 0
    }
  };

  saveConfig(customConfig);
  const loaded = getConfig();

  // Check key properties match
  assertEquals(loaded.oldBanzuke.sanyaku.Y, customConfig.oldBanzuke.sanyaku.Y);
  assertEquals(loaded.oldBanzuke.maegashira, customConfig.oldBanzuke.maegashira);
  assertEquals(loaded.newBanzuke.sanyaku.Y, customConfig.newBanzuke.sanyaku.Y);
});

test('should handle getDivisionCounts with valid config', () => {
  const counts = getDivisionCounts('oldBanzuke');

  assertEquals(counts.Y, 1, 'Should return Y count');
  assertEquals(counts.O, 1, 'Should return O count');
  assertEquals(counts.S, 1, 'Should return S count');
  assertEquals(counts.K, 1, 'Should return K count');
  assertEquals(counts.M, 17, 'Should return M count');
  assertEquals(counts.J, 14, 'Should return J count');
});

test('should handle getDivisionCounts with invalid banzuke type', () => {
  const counts = getDivisionCounts('invalidType');

  // Should not throw, but return defaults
  assert(counts, 'Should return some counts');
});

test('should handle getDivisionCounts with corrupted config', () => {
  // Save a config missing sanyaku
  localStorage.setItem(
    'banzukeDivisionConfig',
    JSON.stringify({
      oldBanzuke: {
        maegashira: 17,
        juryo: 14
      },
      newBanzuke: {
        maegashira: 17,
        juryo: 14
      }
    })
  );

  const counts = getDivisionCounts('oldBanzuke');

  // Should return default counts
  assertEquals(counts.Y, 1, 'Should return default Y count');
  assertEquals(counts.M, 17, 'Should return default M count');
});

test('should reset to default correctly', () => {
  // Save custom config
  saveConfig({
    oldBanzuke: {
      sanyaku: { Y: 5, O: 5, S: 5, K: 5 },
      maegashira: 30,
      juryo: 20,
      makushita: 0,
      sandanme: 0,
      jonidan: 0,
      jonokuchi: 0
    },
    newBanzuke: {
      sanyaku: { Y: 5, O: 5, S: 5, K: 5 },
      maegashira: 30,
      juryo: 20,
      makushita: 0,
      sandanme: 0,
      jonidan: 0,
      jonokuchi: 0
    }
  });

  const defaultConfig = resetToDefault();
  const loaded = getConfig();

  assertEquals(loaded.oldBanzuke.sanyaku.Y, 1, 'Should reset to default Y count');
  assertEquals(loaded.oldBanzuke.maegashira, 17, 'Should reset to default M count');
  assertEquals(defaultConfig.oldBanzuke.sanyaku.Y, loaded.oldBanzuke.sanyaku.Y, 'Reset should return and save default config');
});