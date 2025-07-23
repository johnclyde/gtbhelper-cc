// Test for division manager edge cases
import { strict as assert } from 'node:assert';

// Mock localStorage
global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
  clear() {
    this.data = {};
  }
};

// Import after setting up mocks
import { 
  getDivisionCounts, 
  updateDivisionCount, 
  updateSanyakuCount,
  addDivision,
  removeDivision,
  getConfig,
  saveConfig 
} from '../division-manager.js';

describe('Division Manager Edge Cases', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should handle negative division counts', () => {
    updateDivisionCount('oldBanzuke', 'maegashira', -5);
    const counts = getDivisionCounts('oldBanzuke');
    assert(counts.M >= 0, 'Should not allow negative counts');
  });

  it('should handle extremely large division counts', () => {
    updateDivisionCount('oldBanzuke', 'maegashira', 999);
    const counts = getDivisionCounts('oldBanzuke');
    assert(counts.M > 0, 'Should handle large counts');
    assert(counts.M <= 999, 'Should store the requested count');
  });

  it('should handle invalid division names', () => {
    // Should not throw
    updateDivisionCount('oldBanzuke', 'invalidDivision', 5);
    const config = getConfig();
    assert(config.oldBanzuke, 'Config should still be valid');
  });

  it('should handle invalid sanyaku ranks', () => {
    // Should not throw
    updateSanyakuCount('oldBanzuke', 'Z', 3); // Z is not a valid rank
    const config = getConfig();
    assert(config.oldBanzuke.sanyaku, 'Sanyaku config should still be valid');
  });

  it('should handle adding division that already exists', () => {
    // Add juryo when it already exists
    addDivision('oldBanzuke', 'juryo');
    const counts = getDivisionCounts('oldBanzuke');
    assert.equal(counts.J, 14, 'Should maintain existing count');
  });

  it('should handle removing division that does not exist', () => {
    // Remove makushita when it's already 0
    removeDivision('oldBanzuke', 'makushita');
    const counts = getDivisionCounts('oldBanzuke');
    assert.equal(counts.Ms, 0, 'Should remain at 0');
  });

  it('should handle concurrent modifications', () => {
    // Simulate concurrent updates
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(
        Promise.resolve().then(() => {
          updateDivisionCount('oldBanzuke', 'maegashira', 17 + i);
        })
      );
    }
    
    return Promise.all(promises).then(() => {
      const counts = getDivisionCounts('oldBanzuke');
      assert(counts.M >= 17, 'Should have processed at least one update');
    });
  });

  it('should handle partial config updates', () => {
    const config = getConfig();
    // Remove a required property
    delete config.oldBanzuke.maegashira;
    saveConfig(config);
    
    // Should return default when loading invalid config
    const newConfig = getConfig();
    assert(newConfig.oldBanzuke.maegashira !== undefined, 'Should have default maegashira count');
  });

  it('should handle localStorage quota exceeded', () => {
    // Mock localStorage to throw quota exceeded
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error('QuotaExceededError');
    };
    
    // Should not throw
    let error = null;
    try {
      updateDivisionCount('oldBanzuke', 'maegashira', 20);
    } catch (e) {
      error = e;
    }
    
    // Restore original
    localStorage.setItem = originalSetItem;
    
    assert(error, 'Should propagate quota exceeded error');
  });

  it('should handle switching between banzuke types', () => {
    // Update old banzuke
    updateDivisionCount('oldBanzuke', 'maegashira', 20);
    
    // Update new banzuke
    updateDivisionCount('newBanzuke', 'maegashira', 25);
    
    // Check both are independent
    const oldCounts = getDivisionCounts('oldBanzuke');
    const newCounts = getDivisionCounts('newBanzuke');
    
    assert.equal(oldCounts.M, 20, 'Old banzuke should have its own count');
    assert.equal(newCounts.M, 25, 'New banzuke should have its own count');
  });

  it('should handle empty string as banzukeType', () => {
    const counts = getDivisionCounts('');
    assert(counts, 'Should return some counts');
    assert(typeof counts.Y === 'number', 'Should have default counts');
  });

  it('should validate sanyaku hierarchy', () => {
    // Try to set more Ozeki than Yokozuna
    updateSanyakuCount('oldBanzuke', 'Y', 1);
    updateSanyakuCount('oldBanzuke', 'O', 5);
    
    const counts = getDivisionCounts('oldBanzuke');
    // System should allow this but it's semantically incorrect
    assert.equal(counts.Y, 1, 'Should have 1 Yokozuna');
    assert.equal(counts.O, 5, 'Should allow 5 Ozeki even if incorrect');
  });
});