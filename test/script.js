// GTB Helper - Main Application Entry Point

// Global basho date - update this after each tournament
var basho = "202301";

// Initialize application when DOM is ready
window.onload = function() {
  // Clean up old storage format
  if (window.localStorage.getItem("banzuke1") !== null) {
    window.localStorage.removeItem("banzuke1");
    window.localStorage.removeItem("banzuke2");
  }
  
  // Initialize modules
  window.rikishiCardManager.init();
  
  // Set up the banzuke
  if (window.localStorage.getItem("banzuke") === null) {
    window.bashoUtils.writeTableTitles(basho);
    window.rikishiCardManager.populateAllSlots(basho);
  } else {
    document.getElementById("tableLiner").innerHTML = 
      window.localStorage.getItem("banzuke");
  }
  
  // Set up radio button preferences
  var radioButton = document.getElementsByClassName("checkbox");
  var radioLocal = window.localStorage.getItem("radioButton");
  
  if (radioLocal === null || radioLocal == "openRikishiPage") {
    radioButton[0].checked = true;
  } else {
    radioButton[1].checked = true;
  }
  
  // Initialize drag and drop functionality
  window.dragDropManager.init();
}

// Save radio button preference
function saveRadio(radioButton) {
  window.localStorage.setItem("radioButton", radioButton.value);
}

// Reset banzuke function for onclick handler
function resetBanzuke() {
  window.dragDropManager.reset();
}