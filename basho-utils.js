// Basho Utilities Module - Handles basho date and naming logic

// Basho name lookup table
const bashoMonthLookup = {
  1: "Hatsu", 
  3: "Haru", 
  5: "Natsu", 
  7: "Nagoya", 
  9: "Aki",
  11: "Kyushu"
};

// Get basho name from month number
export function getBashoName(month) {
  return bashoMonthLookup[month];
}

// Parse basho date string
export function parseBashoDate(bashoDateString) {
  return {
    year: parseInt(bashoDateString.substring(0, 4)),
    month: parseInt(bashoDateString.slice(-2))
  };
}

// Get next basho info
export function getNextBasho(year, month) {
  if (month > 9) {
    year++;
    month = 1;
  } else {
    month += 2;
  }
  return { year, month };
}

// Write table titles for current and next basho
export function writeTableTitles(endedBashoDate) {
  const bashoInfo = parseBashoDate(endedBashoDate);
  const tableTitles = document.getElementsByClassName("tableTitle");
  
  if (tableTitles.length < 2) {
    console.error('Expected at least 2 elements with class "tableTitle"');
    return;
  }

  // Current basho title
  tableTitles[0].textContent = `${getBashoName(bashoInfo.month)} ${bashoInfo.year}`;

  // Next basho title
  const nextBasho = getNextBasho(bashoInfo.year, bashoInfo.month);
  const existingText = tableTitles[1].textContent;
  const baseText = existingText.includes('rikishi placed') ? existingText : '';
  tableTitles[1].textContent = `${getBashoName(nextBasho.month)} ${nextBasho.year} Guess${baseText ? ' - ' + baseText : ''}`;
}

