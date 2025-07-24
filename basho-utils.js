// Basho Utilities Module - Handles basho date and naming logic

// Basho name lookup table
const bashoMonthLookup = {
  1: 'Hatsu',
  3: 'Haru',
  5: 'Natsu',
  7: 'Nagoya',
  9: 'Aki',
  11: 'Kyushu'
};

// Get basho name from month number
export function getBashoName(month) {
  return bashoMonthLookup[month];
}

// Parse basho date string
export function parseBashoDate(bashoDateString) {
  return {
    year: Number.parseInt(bashoDateString.substring(0, 4)),
    month: Number.parseInt(bashoDateString.slice(-2))
  };
}

// Get next basho info
export function getNextBasho(year, month) {
  let nextYear = year;
  let nextMonth = month;
  if (nextMonth > 9) {
    nextYear++;
    nextMonth = 1;
  } else {
    nextMonth += 2;
  }
  return { year: nextYear, month: nextMonth };
}

// Write table titles for current and next basho
export function writeTableTitles(endedBashoDate) {
  const bashoInfo = parseBashoDate(endedBashoDate);
  const nextBasho = getNextBasho(bashoInfo.year, bashoInfo.month);
  
  const currentBashoName = `${getBashoName(bashoInfo.month)} ${bashoInfo.year}`;
  const nextBashoName = `${getBashoName(nextBasho.month)} ${nextBasho.year}`;
  
  // Set main titles
  const oldTitle = document.getElementById('oldBanzukeTitle');
  const newTitle = document.getElementById('newBanzukeTitle');
  
  if (oldTitle) oldTitle.textContent = currentBashoName;
  if (newTitle) newTitle.textContent = `${nextBashoName} Guess`;
}
