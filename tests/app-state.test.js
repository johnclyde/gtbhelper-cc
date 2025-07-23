// Tests for app state management

import {
  CURRENT_BASHO,
  RADIO_OPTIONS,
  getRadioPreference,
  getSavedBanzuke,
  hasSavedBanzuke,
  initializeRadioButtons,
  saveRadioPreference
} from '../app-state.js';

test('CURRENT_BASHO is set correctly', () => {
  assertEquals(CURRENT_BASHO, '202507', 'Current basho should be 202507');
});

test('RADIO_OPTIONS has correct values', () => {
  assertEquals(RADIO_OPTIONS.OPEN_RIKISHI_PAGE, 'openRikishiPage');
  assertEquals(RADIO_OPTIONS.RETURN_TO_OLD, 'returnToOld');
});

test('hasSavedBanzuke returns false when no saved banzuke', () => {
  localStorage.clear();
  assert(!hasSavedBanzuke(), 'Should return false when no saved banzuke');
});

test('hasSavedBanzuke returns true when banzuke exists', () => {
  localStorage.setItem('banzuke', '<div>test</div>');
  assert(hasSavedBanzuke(), 'Should return true when banzuke exists');
  localStorage.removeItem('banzuke');
});

test('getSavedBanzuke returns null when no saved banzuke', () => {
  localStorage.clear();
  assertEquals(getSavedBanzuke(), null, 'Should return null when no saved banzuke');
});

test('getSavedBanzuke returns saved HTML', () => {
  const testHTML = '<div class="test">Test Banzuke</div>';
  localStorage.setItem('banzuke', testHTML);
  assertEquals(getSavedBanzuke(), testHTML, 'Should return saved HTML');
  localStorage.removeItem('banzuke');
});

test('saveRadioPreference saves to localStorage', () => {
  localStorage.clear();
  saveRadioPreference('testValue');
  assertEquals(localStorage.getItem('radioButton'), 'testValue', 'Should save preference');
});

test('getRadioPreference returns saved preference', () => {
  localStorage.setItem('radioButton', 'returnToOld');
  assertEquals(getRadioPreference(), 'returnToOld', 'Should return saved preference');
});

test('getRadioPreference returns default when no saved preference', () => {
  localStorage.clear();
  assertEquals(
    getRadioPreference(),
    RADIO_OPTIONS.OPEN_RIKISHI_PAGE,
    'Should return default preference'
  );
});

test('initializeRadioButtons sets first radio when preference is openRikishiPage', () => {
  document.body.innerHTML = `
    <input type="radio" class="checkbox" value="openRikishiPage">
    <input type="radio" class="checkbox" value="returnToOld">
  `;

  localStorage.setItem('radioButton', 'openRikishiPage');
  initializeRadioButtons();

  const radios = document.getElementsByClassName('checkbox');
  assert(radios[0].checked, 'First radio should be checked');
  assert(!radios[1].checked, 'Second radio should not be checked');
});

test('initializeRadioButtons sets second radio when preference is returnToOld', () => {
  document.body.innerHTML = `
    <input type="radio" class="checkbox" value="openRikishiPage">
    <input type="radio" class="checkbox" value="returnToOld">
  `;

  localStorage.setItem('radioButton', 'returnToOld');
  initializeRadioButtons();

  const radios = document.getElementsByClassName('checkbox');
  assert(!radios[0].checked, 'First radio should not be checked');
  assert(radios[1].checked, 'Second radio should be checked');
});

test('initializeRadioButtons uses default when no saved preference', () => {
  document.body.innerHTML = `
    <input type="radio" class="checkbox" value="openRikishiPage">
    <input type="radio" class="checkbox" value="returnToOld">
  `;

  localStorage.clear();
  initializeRadioButtons();

  const radios = document.getElementsByClassName('checkbox');
  assert(radios[0].checked, 'First radio should be checked by default');
  assert(!radios[1].checked, 'Second radio should not be checked');
});

test('initializeRadioButtons handles missing radio buttons gracefully', () => {
  document.body.innerHTML = '';

  // Should not throw error
  initializeRadioButtons();

  // Add only one radio button
  document.body.innerHTML = '<input type="radio" class="checkbox">';
  initializeRadioButtons();

  // Should still not throw error
  assert(true, 'Should handle missing elements gracefully');
});
