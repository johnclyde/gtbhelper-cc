// Test for rikishi card manager custom names functionality
import './test-setup.js';
import { makeEditable } from '../rikishi-card-manager.js';

beforeEach(() => {
  document.body.innerHTML = `
    <div id="banzuke1">
      <div class="rikishi-drag" id="M1e" data-rid="12203">
        <a href="https://sumodb.sumogames.de/Rikishi.aspx?r=12203">Tobizaru</a>
        <a href="https://sumodb.sumogames.de/Rikishi_basho.aspx?r=12203&b=202501">0-0</a>
      </div>
    </div>
  `;
});

test('should save and load custom names', () => {
  // Initialize the editable functionality
  makeEditable();

  // Find the name link
  const nameLink = document.querySelector('a[href*="Rikishi.aspx?r="]');
  assert(nameLink, 'Should find rikishi name link');
  assertEquals(nameLink.textContent, 'Tobizaru', 'Should have original name');

  // Simulate click to edit
  const clickEvent = new window.MouseEvent('click', {
    bubbles: true,
    cancelable: true
  });
  nameLink.dispatchEvent(clickEvent);

  // Check that input was created
  const input = nameLink.parentNode.querySelector('input');
  assert(input, 'Should create input field');
  assertEquals(input.value, 'Tobizaru', 'Input should have original name');

  // Change the name
  input.value = 'CustomName';

  // Simulate Enter key to save
  const enterEvent = new window.KeyboardEvent('keydown', {
    key: 'Enter',
    bubbles: true
  });
  input.dispatchEvent(enterEvent);

  // Check that name was updated
  assertEquals(nameLink.textContent, 'CustomName', 'Name should be updated');

  // Check localStorage
  const savedData = JSON.parse(localStorage.getItem('customRikishiNames'));
  assert(savedData, 'Should save to localStorage');
  assertEquals(savedData['12203'], 'CustomName', 'Should save custom name');
});

test('should apply custom names on page load', () => {
  // Pre-save a custom name
  localStorage.setItem(
    'customRikishiNames',
    JSON.stringify({
      12203: 'PreloadedName'
    })
  );

  // Initialize
  makeEditable();

  // Check that custom name was applied
  const nameLink = document.querySelector('a[href*="Rikishi.aspx?r="]');
  assertEquals(nameLink.textContent, 'PreloadedName', 'Should apply custom name on load');
});

test('should revert to original name when cleared', () => {
  makeEditable();

  const nameLink = document.querySelector('a[href*="Rikishi.aspx?r="]');

  // Click to edit
  const clickEvent = new window.MouseEvent('click', {
    bubbles: true,
    cancelable: true
  });
  nameLink.dispatchEvent(clickEvent);

  const input = nameLink.parentNode.querySelector('input');

  // Clear the input
  input.value = '';

  // Save
  const enterEvent = new window.KeyboardEvent('keydown', {
    key: 'Enter',
    bubbles: true
  });
  input.dispatchEvent(enterEvent);

  // Should revert to original
  assertEquals(nameLink.textContent, 'Tobizaru', 'Should revert to original name');

  // Should remove from localStorage
  const savedData = JSON.parse(localStorage.getItem('customRikishiNames') || '{}');
  assert(!savedData['12203'], 'Should remove custom name from storage');
});