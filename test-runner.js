// Test runner for CI environments
// Can be run with Node.js using a headless browser or a testing framework

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = window.document;
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value.toString();
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

// Test framework
const results = [];
let currentTest = null;

function test(name, fn) {
  currentTest = { name, passed: true, error: null };
  try {
    fn();
  } catch (error) {
    currentTest.passed = false;
    currentTest.error = error.message;
  }
  results.push(currentTest);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
}

// Make test functions global
global.test = test;
global.assert = assert;
global.assertEquals = assertEquals;

// Import and run tests
async function runTests() {
  try {
    // Import all test modules
    await import('./tests/basho-utils.test.js');
    await import('./tests/rikishi-names.test.js');
    await import('./tests/table-generator.test.js');
    await import('./tests/rikishi-card-manager.test.js');
    
    // Display results
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    
    console.log(`\nTest Summary: ${passed} passed, ${failed} failed, ${results.length} total\n`);
    
    for (const result of results) {
      const icon = result.passed ? '✓' : '✗';
      console.log(`${icon} ${result.name}`);
      if (result.error) {
        console.log(`  Error: ${result.error}`);
      }
    }
    
    // Exit with appropriate code
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Test runner error:', error);
    process.exit(1);
  }
}

runTests();