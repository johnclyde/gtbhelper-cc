// Rikishi Card Manager - Handles creation and management of rikishi cards

import { theSekitori, sekitoriID } from './rikishi-names.js';

// Storage keys
const RETIRED_RIKISHI_KEY = 'retiredRikishi';
const CUSTOM_NAMES_KEY = 'customRikishiNames';
  
// Get retired rikishi from localStorage
function getRetiredRikishi() {
    const stored = localStorage.getItem(RETIRED_RIKISHI_KEY);
    return stored ? JSON.parse(stored) : {};
  }
  
// Save retired rikishi to localStorage
function saveRetiredRikishi(retiredMap) {
    localStorage.setItem(RETIRED_RIKISHI_KEY, JSON.stringify(retiredMap));
  }
  
// Mark a rikishi as retired
function markAsRetired(rikishiId) {
    const retired = getRetiredRikishi();
    retired[rikishiId] = true;
    saveRetiredRikishi(retired);
  }
  
// Mark a rikishi as active (unretire)
function markAsActive(rikishiId) {
    const retired = getRetiredRikishi();
    delete retired[rikishiId];
    saveRetiredRikishi(retired);
  }
  
// Check if a rikishi is retired
function isRetired(rikishiId) {
    const retired = getRetiredRikishi();
    return retired[rikishiId] === true;
  }
  
// Create a rikishi card element
export function createCard(rikishiData, rikishiId, basho) {
    const rikiData = rikishiData.split(' ');
    const card = document.createElement('div');
    
    // Set basic attributes
    card.setAttribute('id', rikiData[0]);
    card.setAttribute('data-rid', rikishiId);
    
    // Get custom name if exists
    const customNames = window.rikishiNames.load();
    const displayName = customNames[rikishiId] || rikiData[1];
    
    // Create record link
    rikiData[2] = `<a href="https://sumodb.sumogames.de/Rikishi_basho.aspx?r=${rikishiId}&b=${basho}" target="_blank">${rikiData[2]}</a>`;
    
    // Create name link
    rikiData[1] = `<a href="https://sumodb.sumogames.de/Rikishi.aspx?r=${rikishiId}" target="_blank">${displayName}</a>`;
    
    // Apply retired styling if needed
    if (isRetired(rikishiId)) {
      card.className = 'redips-nodrag';
      card.style.backgroundColor = '#dadada';
      card.style.cursor = 'not-allowed';
      card.style.color = '#3c3c3c';
      card.setAttribute('title', 'Retired - Right-click to toggle retirement status');
    } else {
      card.className = 'redips-drag se';
      card.style.cursor = 'grab';
      card.setAttribute('title', 'Right-click to mark as retired');
    }
    
    card.innerHTML = rikiData.join(' ');
    
    // Add right-click handler for retirement toggle
    card.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      toggleRetirement(rikishiId, card);
    });
    
    return card;
  }
  
// Toggle retirement status
function toggleRetirement(rikishiId, card) {
    if (isRetired(rikishiId)) {
      if (confirm('Mark this rikishi as active?')) {
        markAsActive(rikishiId);
        // Update card appearance
        card.className = 'redips-drag se';
        card.style.backgroundColor = '';
        card.style.cursor = 'grab';
        card.style.color = '';
        card.setAttribute('title', 'Right-click to mark as retired');
        // Re-initialize drag functionality for this card
        if (window.dragDropManager && window.dragDropManager.reinitializeCard) {
          window.dragDropManager.reinitializeCard(card);
        }
      }
    } else {
      if (confirm('Mark this rikishi as retired?')) {
        markAsRetired(rikishiId);
        // Update card appearance
        card.className = 'redips-nodrag';
        card.style.backgroundColor = '#dadada';
        card.style.cursor = 'not-allowed';
        card.style.color = '#3c3c3c';
        card.setAttribute('title', 'Retired - Right-click to toggle retirement status');
      }
    }
    
    // Save the updated banzuke state
    saveBanzukeState();
  }
  
// Populate all rikishi slots
export function populateAllSlots(basho) {
    const cells = document.querySelectorAll('.redips-only');
    
    for (let i = 0; i < theSekitori.length; i++) {
      if (theSekitori[i] !== '') {
        // Create card
        const card = createCard(theSekitori[i], sekitoriID[i], basho);
        
        // Create holder (hidden span)
        const holder = document.createElement('span');
        holder.innerHTML = card.innerHTML;
        holder.style.display = 'none';
        
        // Append to cell
        cells[i].appendChild(holder);
        cells[i].appendChild(card);
      }
    }
  }
  
// Save banzuke state
function saveBanzukeState() {
    const tableLiner = document.getElementById('tableLiner');
    if (tableLiner) {
      localStorage.setItem('banzuke', tableLiner.innerHTML);
    }
  }
  
// Migrate old hardcoded retired rikishi
function migrateHardcodedRetired() {
    const retired = getRetiredRikishi();
    let needsSave = false;
    
    // Check each rikishi for hardcoded retirement
    for (let i = 0; i < theSekitori.length; i++) {
      if (theSekitori[i] !== '') {
        const rikiData = theSekitori[i].split(' ');
        const rikishiId = sekitoriID[i];
        
        // Check for Chiyotairyu or Yutakayama
        if (rikiData[1] === 'Chiyotairyu' || rikiData[1] === 'Yutakayama') {
          if (!retired[rikishiId]) {
            retired[rikishiId] = true;
            needsSave = true;
          }
        }
      }
    }
    
    if (needsSave) {
      saveRetiredRikishi(retired);
    }
  }
  
// Initialize the module
export function init() {
    // Run migration on first load
    if (!localStorage.getItem('retiredMigrationDone')) {
      migrateHardcodedRetired();
      localStorage.setItem('retiredMigrationDone', 'true');
    }
  }
  
