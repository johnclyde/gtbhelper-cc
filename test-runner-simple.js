#!/usr/bin/env node

// Simple test runner that can run in CI without heavy dependencies
// Run with: node test-runner-simple.js

import { existsSync, readFileSync } from 'node:fs';

console.log('Running GTB Helper Tests...\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Simple test framework
function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`✓ ${name}`);
  } catch (error) {
    failedTests++;
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
  }
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

// Test basic module loading
test('Project structure is valid', () => {
  assert(existsSync('index.html'), 'index.html should exist');
  assert(existsSync('basho-utils.js'), 'basho-utils.js should exist');
  assert(existsSync('rikishi-names.js'), 'rikishi-names.js should exist');
  assert(existsSync('division-manager.js'), 'division-manager.js should exist');
  assert(existsSync('rikishi-card-manager.js'), 'rikishi-card-manager.js should exist');
  assert(existsSync('main.js'), 'main.js should exist');
  assert(existsSync('app-state.js'), 'app-state.js should exist');
});

test('HTML files are valid', () => {
  const indexHtml = readFileSync('index.html', 'utf8');
  assert(indexHtml.includes('<!DOCTYPE html>'), 'index.html should have DOCTYPE');
  assert(indexHtml.includes('modules-init.js'), 'index.html should load modules-init.js');
  assert(
    indexHtml.includes('Generated dynamically'),
    'Tables should be marked as dynamically generated'
  );
});

test('JavaScript files use ES6 modules', () => {
  const bashoUtils = readFileSync('basho-utils.js', 'utf8');
  assert(bashoUtils.includes('export function'), 'basho-utils.js should use ES6 exports');

  const rikishiNames = readFileSync('rikishi-names.js', 'utf8');
  assert(rikishiNames.includes('export const'), 'rikishi-names.js should export constants');
  assert(rikishiNames.includes('export function'), 'rikishi-names.js should export functions');

  const divisionManager = readFileSync('division-manager.js', 'utf8');
  assert(divisionManager.includes('export function'), 'division-manager.js should use ES6 exports');

  const appState = readFileSync('app-state.js', 'utf8');
  assert(appState.includes('export'), 'app-state.js should use ES6 exports');
});

test('Test files exist', () => {
  assert(existsSync('tests/basho-utils.test.js'), 'basho-utils test should exist');
  assert(existsSync('tests/rikishi-names.test.js'), 'rikishi-names test should exist');
  assert(existsSync('tests/table-generator.test.js'), 'table-generator test should exist');
  assert(
    existsSync('tests/rikishi-card-manager.test.js'),
    'rikishi-card-manager test should exist'
  );
  assert(existsSync('tests/division-manager.test.js'), 'division-manager test should exist');
});

test('Package.json is valid', () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  assert(packageJson.name === 'gtbhelper-cc', 'Package name should be gtbhelper-cc');
  assert(packageJson.type === 'module', 'Package should be ES6 module');
  assert(packageJson.scripts.test, 'Package should have test script');
});

// Summary
console.log(`\nTest Summary: ${passedTests} passed, ${failedTests} failed, ${totalTests} total`);
process.exit(failedTests > 0 ? 1 : 0);
