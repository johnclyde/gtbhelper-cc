// Table Generator Module - Dynamically generates banzuke tables using DOM manipulation

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
  maegashira: Array.from({ length: 17 }, (_, i) => ({
    rank: `M${i + 1}`,
    name: `Maegashira ${i + 1}`
  })),
  juryo: Array.from({ length: 14 }, (_, i) => ({
    rank: `J${i + 1}`,
    name: `Juryo ${i + 1}`
  }))
};

// Helper function to create a table row
function createRankRow(rank, isOldBanzuke = true, isSanyaku = false) {
  const tr = document.createElement('tr');
  if (isSanyaku) {
    tr.className = 'san';
  }

  if (isOldBanzuke) {
    // Old banzuke format: east | rank | west
    const tdEast = document.createElement('td');
    tdEast.className = `sortable-cell ${rank}e`;
    tr.appendChild(tdEast);

    const th = document.createElement('th');
    th.textContent = rank;
    tr.appendChild(th);

    const tdWest = document.createElement('td');
    tdWest.className = `sortable-cell ${rank}w`;
    tr.appendChild(tdWest);
  } else {
    // New banzuke format: change | east | rank | west | change
    const tdChange1 = document.createElement('td');
    tdChange1.className = 'ch';
    tdChange1.textContent = ' ';
    tr.appendChild(tdChange1);

    const tdEast = document.createElement('td');
    tdEast.className = 'sortable-cell b2';
    tr.appendChild(tdEast);

    const th = document.createElement('th');
    th.textContent = rank;
    tr.appendChild(th);

    const tdWest = document.createElement('td');
    tdWest.className = 'sortable-cell b2';
    tr.appendChild(tdWest);

    const tdChange2 = document.createElement('td');
    tdChange2.className = 'ch';
    tdChange2.textContent = ' ';
    tr.appendChild(tdChange2);
  }

  return tr;
}

// Create divider row
function createDividerRow(colspan) {
  const tr = document.createElement('tr');
  const th = document.createElement('th');
  th.className = 'divider';
  th.colSpan = colspan;
  tr.appendChild(th);
  return tr;
}

// Generate old banzuke table rows as DOM elements
export function generateOldBanzukeRows() {
  const fragment = document.createDocumentFragment();

  // Sanyaku ranks
  for (const { rank } of RANKS.sanyaku) {
    fragment.appendChild(createRankRow(rank, true, true));
  }

  // Empty row for spacing
  const emptyRow1 = document.createElement('tr');
  emptyRow1.appendChild(document.createElement('td'));
  fragment.appendChild(emptyRow1);

  // Maegashira ranks
  for (const { rank } of RANKS.maegashira) {
    fragment.appendChild(createRankRow(rank, true, false));
  }

  // Divider
  fragment.appendChild(createDividerRow(3));

  // Juryo ranks
  for (const { rank } of RANKS.juryo) {
    fragment.appendChild(createRankRow(rank, true, false));
  }

  return fragment;
}

// Generate new banzuke table rows as DOM elements
export function generateNewBanzukeRows() {
  const fragment = document.createDocumentFragment();

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
  for (const { rank } of newRanks) {
    fragment.appendChild(createRankRow(rank, false, true));
  }

  // Empty row for spacing
  const emptyRow = document.createElement('tr');
  emptyRow.appendChild(document.createElement('td'));
  fragment.appendChild(emptyRow);

  // Add maegashira ranks (can go up to M18)
  for (let i = 1; i <= 18; i++) {
    fragment.appendChild(createRankRow(`M${i}`, false, false));
  }

  // Divider
  fragment.appendChild(createDividerRow(5));

  // Add juryo ranks J1-J14
  for (let i = 1; i <= 14; i++) {
    fragment.appendChild(createRankRow(`J${i}`, false, false));
  }

  return fragment;
}

// Initialize tables
export function initializeTables() {
  // Find table bodies
  const oldBanzukeTbody = document.querySelector('#banzuke1 tbody');
  const newBanzukeTbody = document.querySelector('#banzuke2 tbody');

  if (oldBanzukeTbody) {
    // Clear existing content
    while (oldBanzukeTbody.firstChild) {
      oldBanzukeTbody.removeChild(oldBanzukeTbody.firstChild);
    }
    oldBanzukeTbody.appendChild(generateOldBanzukeRows());
  }

  if (newBanzukeTbody) {
    // Clear existing content
    while (newBanzukeTbody.firstChild) {
      newBanzukeTbody.removeChild(newBanzukeTbody.firstChild);
    }
    newBanzukeTbody.appendChild(generateNewBanzukeRows());
  }
}
