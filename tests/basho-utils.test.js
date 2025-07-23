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
  // Set up DOM
  document.body.innerHTML = `
    <th class="tableTitle"></th>
    <th class="tableTitle">0 rikishi placed</th>
  `;

  writeTableTitles('202301');

  const titles = document.getElementsByClassName('tableTitle');
  assertEquals(titles[0].textContent, 'Hatsu 2023');
  assertEquals(titles[1].textContent, 'Haru 2023 Guess - 0 rikishi placed');
});

test('writeTableTitles handles missing elements gracefully', () => {
  // Set up DOM with only one title
  document.body.innerHTML = '<th class="tableTitle"></th>';

  // Should not throw error
  writeTableTitles('202301');

  const titles = document.getElementsByClassName('tableTitle');
  assertEquals(titles[0].textContent, 'Hatsu 2023');
});

test('writeTableTitles preserves rikishi count text', () => {
  document.body.innerHTML = `
    <th class="tableTitle"></th>
    <th class="tableTitle">42 rikishi placed</th>
  `;

  writeTableTitles('202307');

  const titles = document.getElementsByClassName('tableTitle');
  assertEquals(titles[0].textContent, 'Nagoya 2023');
  assertEquals(titles[1].textContent, 'Aki 2023 Guess - 42 rikishi placed');
});

test('writeTableTitles handles year transition in titles', () => {
  document.body.innerHTML = `
    <th class="tableTitle"></th>
    <th class="tableTitle"></th>
  `;

  writeTableTitles('202311');

  const titles = document.getElementsByClassName('tableTitle');
  assertEquals(titles[0].textContent, 'Kyushu 2023');
  assertEquals(titles[1].textContent, 'Hatsu 2024 Guess');
});

test('writeTableTitles uses textContent not innerHTML', () => {
  document.body.innerHTML = `
    <th class="tableTitle"></th>
    <th class="tableTitle"><script>alert('xss')</script></th>
  `;

  writeTableTitles('202305');

  const titles = document.getElementsByClassName('tableTitle');
  // If innerHTML was used, the script tag would execute
  // With textContent, it's treated as plain text
  assertEquals(titles[0].textContent, 'Natsu 2023');
  assertEquals(titles[1].textContent, 'Nagoya 2023 Guess');

  // Verify no script tags exist in the DOM
  assert(!titles[1].querySelector('script'), 'Script tag should not exist');
});
