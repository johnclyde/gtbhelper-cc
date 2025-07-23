// Test setup utilities for GTB Helper tests

// Simple test runner functions
let beforeEachFn = null;

global.test = async (name, fn) => {
  try {
    // Clear localStorage before each test
    if (global.localStorage && global.localStorage.clear) {
      global.localStorage.clear();
    }
    // Run beforeEach if defined
    if (beforeEachFn) {
      beforeEachFn();
    }
    await fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  ${error.message}`);
    throw error;
  }
};

global.beforeEach = (fn) => {
  beforeEachFn = fn;
};

// Simple assertion functions
global.assert = (condition, message = 'Assertion failed') => {
  if (!condition) {
    throw new Error(message);
  }
};

global.assertEquals = (actual, expected, message = '') => {
  if (actual !== expected) {
    throw new Error(
      `${message ? `${message}: ` : ''}Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`
    );
  }
};

global.assertArrayEquals = (actual, expected, message = '') => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${message ? `${message}: ` : ''}Expected array ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`
    );
  }
};

// Setup DOM environment
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
// Navigator is read-only in newer Node versions

// Add other globals that might be used
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.NodeList = dom.window.NodeList;
global.DOMParser = dom.window.DOMParser;

// Mock localStorage
const localStorageMock = {
  storage: {},
  getItem(key) {
    return this.storage[key] || null;
  },
  setItem(key, value) {
    this.storage[key] = value;
  },
  removeItem(key) {
    delete this.storage[key];
  },
  clear() {
    this.storage = {};
  }
};
global.localStorage = localStorageMock;

// Mock confirm and alert
global.confirm = () => true;
global.alert = () => {};
