import { getBashoName, getNextBasho, parseBashoDate, writeTableTitles } from '../basho-utils.js';

test('getBashoName returns correct names', () => {
  assertEquals(getBashoName(1), 'Hatsu');
  assertEquals(getBashoName(3), 'Haru');
  assertEquals(getBashoName(5), 'Natsu');
  assertEquals(getBashoName(7), 'Nagoya');
  assertEquals(getBashoName(9), 'Aki');
  assertEquals(getBashoName(11), 'Kyushu');
});

test('getBashoName returns undefined for invalid months', () => {
  assertEquals(getBashoName(2), undefined);
  assertEquals(getBashoName(4), undefined);
  assertEquals(getBashoName(12), undefined);
});

test('parseBashoDate parses correctly', () => {
  const result = parseBashoDate('202301');
  assertEquals(result.year, 2023);
  assertEquals(result.month, 1);
});

test('parseBashoDate handles different years', () => {
  const result = parseBashoDate('202411');
  assertEquals(result.year, 2024);
  assertEquals(result.month, 11);
});

test('getNextBasho calculates correctly within year', () => {
  let result = getNextBasho(2023, 1);
  assertEquals(result.year, 2023);
  assertEquals(result.month, 3);

  result = getNextBasho(2023, 3);
  assertEquals(result.year, 2023);
  assertEquals(result.month, 5);

  result = getNextBasho(2023, 9);
  assertEquals(result.year, 2023);
  assertEquals(result.month, 11);
});

test('getNextBasho handles year transition', () => {
  const result = getNextBasho(2023, 11);
  assertEquals(result.year, 2024);
  assertEquals(result.month, 1);
});

test('writeTableTitles updates DOM elements correctly', () => {
  // Create DOM elements properly
  const oldTitle = document.createElement('th');
  oldTitle.id = 'oldBanzukeTitle';
  document.body.appendChild(oldTitle);
  
  const newTitle = document.createElement('th');
  newTitle.id = 'newBanzukeTitle';
  document.body.appendChild(newTitle);

  writeTableTitles('202301');

  assertEquals(oldTitle.textContent, 'Hatsu 2023');
  assertEquals(newTitle.textContent, 'Haru 2023 Guess');
  
  // Clean up
  document.body.removeChild(oldTitle);
  document.body.removeChild(newTitle);
});

test('writeTableTitles handles missing elements gracefully', () => {
  // Create only old title element
  const oldTitle = document.createElement('th');
  oldTitle.id = 'oldBanzukeTitle';
  document.body.appendChild(oldTitle);

  // Should not throw error
  writeTableTitles('202301');

  assertEquals(oldTitle.textContent, 'Hatsu 2023');
  
  // Clean up
  document.body.removeChild(oldTitle);
});

test('writeTableTitles preserves rikishi count text', () => {
  // Create DOM elements
  const oldTitle = document.createElement('th');
  oldTitle.id = 'oldBanzukeTitle';
  document.body.appendChild(oldTitle);
  
  const newTitle = document.createElement('th');
  newTitle.id = 'newBanzukeTitle';
  document.body.appendChild(newTitle);

  writeTableTitles('202307');

  assertEquals(oldTitle.textContent, 'Nagoya 2023');
  assertEquals(newTitle.textContent, 'Aki 2023 Guess');
  
  // Clean up
  document.body.removeChild(oldTitle);
  document.body.removeChild(newTitle);
});

test('writeTableTitles handles year transition in titles', () => {
  // Create DOM elements
  const oldTitle = document.createElement('th');
  oldTitle.id = 'oldBanzukeTitle';
  document.body.appendChild(oldTitle);
  
  const newTitle = document.createElement('th');
  newTitle.id = 'newBanzukeTitle';
  document.body.appendChild(newTitle);

  writeTableTitles('202311');

  assertEquals(oldTitle.textContent, 'Kyushu 2023');
  assertEquals(newTitle.textContent, 'Hatsu 2024 Guess');
  
  // Clean up
  document.body.removeChild(oldTitle);
  document.body.removeChild(newTitle);
});

test('writeTableTitles uses textContent not innerHTML', () => {
  // Create DOM elements
  const oldTitle = document.createElement('th');
  oldTitle.id = 'oldBanzukeTitle';
  document.body.appendChild(oldTitle);
  
  const newTitle = document.createElement('th');
  newTitle.id = 'newBanzukeTitle';
  // Add a script tag to test XSS protection
  const script = document.createElement('script');
  script.textContent = "alert('xss')";
  newTitle.appendChild(script);
  document.body.appendChild(newTitle);

  writeTableTitles('202305');

  // If innerHTML was used, the script tag would execute
  // With textContent, it's treated as plain text
  assertEquals(oldTitle.textContent, 'Natsu 2023');
  assertEquals(newTitle.textContent, 'Nagoya 2023 Guess');

  // Verify no script tags exist in the DOM after setting textContent
  assert(!newTitle.querySelector('script'), 'Script tag should not exist');
  
  // Clean up
  document.body.removeChild(oldTitle);
  document.body.removeChild(newTitle);
});
