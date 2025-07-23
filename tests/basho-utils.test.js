import { getBashoName, parseBashoDate, getNextBasho } from '../basho-utils.js';

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