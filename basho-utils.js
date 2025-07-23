// Basho Utilities Module - Handles basho date and naming logic

(function() {
  'use strict';
  
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
  function getBashoName(month) {
    return bashoMonthLookup[month];
  }
  
  // Parse basho date string
  function parseBashoDate(bashoDateString) {
    return {
      year: parseInt(bashoDateString.substring(0, 4)),
      month: parseInt(bashoDateString.slice(-2))
    };
  }
  
  // Get next basho info
  function getNextBasho(year, month) {
    if (month > 9) {
      year++;
      month = 1;
    } else {
      month += 2;
    }
    return { year, month };
  }
  
  // Write table titles for current and next basho
  function writeTableTitles(endedBashoDate) {
    var bashoInfo = parseBashoDate(endedBashoDate);
    var tableTitle = document.getElementsByClassName("tableTitle");
    
    // Current basho title
    tableTitle[0].innerHTML = getBashoName(bashoInfo.month) + ' ' + bashoInfo.year;
    
    // Next basho title
    var nextBasho = getNextBasho(bashoInfo.year, bashoInfo.month);
    tableTitle[1].innerHTML = getBashoName(nextBasho.month) + ' ' + nextBasho.year + 
                              " Guess - " + tableTitle[1].innerHTML;
  }
  
  // Export functions to global scope
  window.bashoUtils = {
    writeTableTitles: writeTableTitles,
    getBashoName: getBashoName,
    parseBashoDate: parseBashoDate,
    getNextBasho: getNextBasho
  };
  
})();