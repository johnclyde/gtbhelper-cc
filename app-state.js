// App State Module - Manages application state and preferences

// Constants
export const CURRENT_BASHO = '202507';

// Direct storage key usage - no need for abstraction

// Radio button options
export const RADIO_OPTIONS = {
  OPEN_RIKISHI_PAGE: 'openRikishiPage',
  RETURN_TO_OLD: 'returnToOld'
};

// Clean up legacy storage
export function cleanupLegacyStorage() {
  if (localStorage.getItem('banzuke1') !== null) {
    localStorage.removeItem('banzuke1');
    localStorage.removeItem('banzuke2');
  }
}

// Save radio preference
export function saveRadioPreference(value) {
  localStorage.setItem('radioButton', value);
}

// Get radio preference
export function getRadioPreference() {
  const saved = localStorage.getItem('radioButton');
  return saved || RADIO_OPTIONS.OPEN_RIKISHI_PAGE;
}

// Initialize radio buttons
export function initializeRadioButtons() {
  const radioButtons = document.getElementsByClassName('checkbox');
  const preference = getRadioPreference();

  if (radioButtons.length >= 2) {
    if (preference === RADIO_OPTIONS.OPEN_RIKISHI_PAGE) {
      radioButtons[0].checked = true;
    } else {
      radioButtons[1].checked = true;
    }
  }
}
