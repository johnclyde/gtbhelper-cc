import { load, save, theSekitori, sekitoriID } from '../rikishi-names.js';

test('theSekitori array is properly formatted', () => {
  assert(Array.isArray(theSekitori), 'theSekitori should be an array');
  assert(theSekitori.length > 0, 'theSekitori should not be empty');
  
  // Check first few entries
  assert(theSekitori[0].includes('Y1e'), 'First entry should be Y1e');
  assert(theSekitori[1].includes('Y1w'), 'Second entry should be Y1w');
});

test('sekitoriID array matches theSekitori length', () => {
  assert(Array.isArray(sekitoriID), 'sekitoriID should be an array');
  assertEquals(sekitoriID.length, theSekitori.length, 'Arrays should have same length');
});

test('sekitoriID contains valid IDs', () => {
  sekitoriID.forEach((id, index) => {
    if (theSekitori[index] !== '') {
      assert(typeof id === 'number', `ID at index ${index} should be a number`);
      assert(id > 0, `ID at index ${index} should be positive`);
    } else {
      assertEquals(id, 0, `Empty slot at index ${index} should have ID 0`);
    }
  });
});

test('load returns empty object when no data', () => {
  localStorage.clear();
  const result = load();
  assert(typeof result === 'object', 'Should return an object');
  assertEquals(Object.keys(result).length, 0, 'Should be empty');
});

test('save and load work correctly', () => {
  localStorage.clear();
  
  const testData = {
    '12451': 'Custom Name 1',
    '12453': 'Custom Name 2'
  };
  
  save(testData);
  const loaded = load();
  
  assertEquals(loaded['12451'], 'Custom Name 1');
  assertEquals(loaded['12453'], 'Custom Name 2');
  assertEquals(Object.keys(loaded).length, 2);
});

test('save overwrites existing data', () => {
  save({ '12451': 'Name 1' });
  save({ '12453': 'Name 2' });
  
  const loaded = load();
  assertEquals(loaded['12451'], undefined, 'First save should be overwritten');
  assertEquals(loaded['12453'], 'Name 2', 'Second save should be present');
});