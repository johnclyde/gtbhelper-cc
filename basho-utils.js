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
  var bashoInfo = parseBashoDate(endedBashoDate);
  var tableTitle = document.getElementsByClassName("tableTitle");
  
  // Current basho title
  tableTitle[0].innerHTML = getBashoName(bashoInfo.month) + ' ' + bashoInfo.year;
  
  // Next basho title
  var nextBasho = getNextBasho(bashoInfo.year, bashoInfo.month);
  tableTitle[1].innerHTML = getBashoName(nextBasho.month) + ' ' + nextBasho.year + 
                            " Guess - " + tableTitle[1].innerHTML;
}

// Also maintain backward compatibility with window.bashoUtils
window.bashoUtils = {
  writeTableTitles,
  getBashoName,
  parseBashoDate,
  getNextBasho
};