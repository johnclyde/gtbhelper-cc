// Rikishi Names Module - Handles custom name editing functionality

(function() {
  'use strict';
  
  // Load custom rikishi names from localStorage
  function loadCustomRikishiNames() {
    var customNames = localStorage.getItem('customRikishiNames');
    if (customNames) {
      return JSON.parse(customNames);
    }
    return {};
  }

  // Save custom rikishi names to localStorage
  function saveCustomRikishiNames(customNames) {
    localStorage.setItem('customRikishiNames', JSON.stringify(customNames));
  }

  // Make rikishi names editable
  function makeRikishiNamesEditable() {
    var customNames = loadCustomRikishiNames();
    
    // Add click event to all rikishi name links
    document.addEventListener('click', function(e) {
      // Check if clicked element is a rikishi name link
      if (e.target.tagName === 'A' && e.target.href.includes('Rikishi.aspx?r=')) {
        e.preventDefault();
        
        // Get the rikishi card
        var card = e.target.closest('.redips-drag');
        if (!card) return;
        
        var rikishiId = card.getAttribute('data-rid');
        var currentName = e.target.textContent;
        
        // Create input field
        var input = document.createElement('input');
        input.type = 'text';
        input.value = customNames[rikishiId] || currentName;
        input.style.width = '80px';
        input.style.fontSize = '12px';
        
        // Replace link with input
        e.target.style.display = 'none';
        e.target.parentNode.insertBefore(input, e.target);
        input.focus();
        input.select();
        
        // Handle input events
        function saveEdit() {
          var newName = input.value.trim();
          if (newName && newName !== currentName) {
            customNames[rikishiId] = newName;
            saveCustomRikishiNames(customNames);
            e.target.textContent = newName;
          } else if (newName === '') {
            // If empty, revert to original name
            delete customNames[rikishiId];
            saveCustomRikishiNames(customNames);
            e.target.textContent = currentName;
          }
          input.remove();
          e.target.style.display = '';
          
          // Save the entire banzuke state
          window.localStorage.setItem("banzuke", document.getElementById("tableLiner").innerHTML);
        }
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', function(event) {
          if (event.key === 'Enter') {
            saveEdit();
          } else if (event.key === 'Escape') {
            input.remove();
            e.target.style.display = '';
          }
        });
      }
    });
    
    // Apply custom names on load
    var allLinks = document.querySelectorAll('a[href*="Rikishi.aspx?r="]');
    allLinks.forEach(function(link) {
      var card = link.closest('.redips-drag');
      if (card) {
        var rikishiId = card.getAttribute('data-rid');
        if (customNames[rikishiId]) {
          link.textContent = customNames[rikishiId];
        }
      }
    });
  }
  
  // Export functions to global scope
  window.rikishiNames = {
    load: loadCustomRikishiNames,
    save: saveCustomRikishiNames,
    makeEditable: makeRikishiNamesEditable
  };
  
})();