// Table Generator Module - Dynamically generates banzuke tables

// Rank definitions
const RANKS = {
  sanyaku: [
    { rank: 'Y1', name: 'Yokozuna 1' },
    { rank: 'O1', name: 'Ozeki 1' },
    { rank: 'S1', name: 'Sekiwake 1' },
    { rank: 'S2', name: 'Sekiwake 2' },
    { rank: 'K1', name: 'Komusubi 1' },
    { rank: 'K2', name: 'Komusubi 2' }
  ],
  maegashira: Array.from({ length: 16 }, (_, i) => ({
    rank: `M${i + 1}`,
    name: `Maegashira ${i + 1}`
  })),
  juryo: Array.from({ length: 14 }, (_, i) => ({
    rank: `J${i + 1}`,
    name: `Juryo ${i + 1}`
  }))
};

// Generate old banzuke table rows
export function generateOldBanzukeRows() {
  const tbody = [];
  
  // Sanyaku ranks
  RANKS.sanyaku.forEach(({ rank }) => {
    tbody.push(`<tr class="san"><td class="redips-only ${rank}e"></td><th>${rank}</th><td class="redips-only ${rank}w"></td></tr>`);
  });
  
  // Maegashira ranks
  tbody.push(''); // Empty line for spacing
  RANKS.maegashira.forEach(({ rank }) => {
    tbody.push(`<tr><td class="redips-only ${rank}e"></td><th>${rank}</th><td class="redips-only ${rank}w"></td></tr>`);
  });
  
  // Divider
  tbody.push('<tr><th class="divider" colspan="3"></th></tr>');
  
  // Juryo ranks
  RANKS.juryo.forEach(({ rank }) => {
    tbody.push(`<tr><td class="redips-only ${rank}e"></td><th>${rank}</th><td class="redips-only ${rank}w"></td></tr>`);
  });
  
  return tbody.join('\n              ');
}

// Generate new banzuke table rows
export function generateNewBanzukeRows() {
  const tbody = [];
  
  // New banzuke has different rank structure
  const newRanks = [
    { rank: 'Y1', san: true },
    { rank: 'Y2', san: true },
    { rank: 'O1', san: true },
    { rank: 'O2', san: true },
    { rank: 'O3', san: true },
    { rank: 'S1', san: true },
    { rank: 'S2', san: true },
    { rank: 'K1', san: true },
    { rank: 'K2', san: true }
  ];
  
  // Add sanyaku ranks
  newRanks.forEach(({ rank, san }) => {
    tbody.push(`<tr class="san"><td class="ch"> </td><td class="redips-only b2"></td><th>${rank}</th><td class="redips-only b2"></td><td class="ch"> </td></tr>`);
  });
  
  tbody.push(''); // Empty line for spacing
  
  // Add maegashira ranks (can go up to M18)
  for (let i = 1; i <= 18; i++) {
    tbody.push(`<tr><td class="ch"> </td><td class="redips-only b2"></td><th>M${i}</th><td class="redips-only b2"></td><td class="ch"> </td></tr>`);
  }
  
  // Divider
  tbody.push('<tr><th class="divider" colspan="5"></th></tr>');
  
  // Single juryo row (generic)
  tbody.push('<tr><td class="ch"> </td><td class="redips-only b2"></td><th>J</th><td class="redips-only b2"></td><td class="ch"> </td></tr>');
  
  return tbody.join('\n              ');
}

// Initialize tables
export function initializeTables() {
  // Find table bodies
  const oldBanzukeTbody = document.querySelector('#banzuke1 tbody');
  const newBanzukeTbody = document.querySelector('#banzuke2 tbody');
  
  if (oldBanzukeTbody) {
    oldBanzukeTbody.innerHTML = generateOldBanzukeRows();
  }
  
  if (newBanzukeTbody) {
    newBanzukeTbody.innerHTML = generateNewBanzukeRows();
  }
}

// Also maintain backward compatibility
window.tableGenerator = {
  initializeTables,
  generateOldBanzukeRows,
  generateNewBanzukeRows
};