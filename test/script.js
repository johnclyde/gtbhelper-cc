//***** Just update the "basho" variable and you're all done. *****

// These need to be global for other functions to access
var basho = "202301"; // The date of the basho just ended

window.onload = function() {

  if (window.localStorage.getItem("banzuke1") !== null) {
    window.localStorage.removeItem("banzuke1");
    window.localStorage.removeItem("banzuke2");
  }
  if (window.localStorage.getItem("banzuke") === null) {
    window.bashoUtils.writeTableTitles(basho);
    populateSlots();
  }
  else {
    document.getElementById("tableLiner").innerHTML = 
    window.localStorage.getItem("banzuke");
  }

  var radioButton = document.getElementsByClassName("checkbox"), 
      radioLocal  = window.localStorage.getItem("radioButton");

  if (radioLocal === null || radioLocal == "openRikishiPage")
    radioButton[0].checked = true;
  else 
    radioButton[1].checked = true;


  function populateSlots() {
    var cell = document.querySelectorAll(".redips-only");
    var customNames = window.rikishiNames.load();
    
    for (var i = 0; i < theSekitori.length; i++) {
      if (theSekitori[i] !== "") {
        var card     = document.createElement("div"), 
            rikiData = theSekitori[i].split(' ');

        card.setAttribute("id", rikiData[0]);
        card.className = "redips-drag se";
        card.setAttribute("data-rid", sekitoriID[i]);

        /*
        if (rikiData[2].split('-')[0] < 8) 
          card.style.backgroundColor = "#ffd2d2";
        else 
          card.style.backgroundColor = "#c2ff9f";
        */

        rikiData[2] = '<a href="https://sumodb.sumogames.de/Rikishi_basho.aspx?r=' + 
                      sekitoriID[i] + "&b=" + basho + '" target="_blank">' + rikiData[2] + "</a>";

        card.innerHTML = rikiData.join(' ');
        
        // Apply custom name if exists
        var displayName = customNames[sekitoriID[i]] || rikiData[1];

        rikiData[1] = '<a href="https://sumodb.sumogames.de/Rikishi.aspx?r=' + 
                      sekitoriID[i] + '" target="_blank">' + displayName + "</a>";

        if (rikiData[1].includes("Chiyotairyu") || rikiData[1].includes("Yutakayama")) {
          card.innerHTML = rikiData.join(' ');
          card.style.backgroundColor = "#dadada";
          card.style.cursor = "text";
          card.style.color = "#3c3c3c";
          card.className = "redips-nodrag";
          card.setAttribute("title", "Retired");
        }

        var holder = document.createElement("span");
        holder.innerHTML = rikiData.join(' ');
        holder.style.display = "none";

        cell[i].appendChild(holder);
        cell[i].appendChild(card);
      }
    }
  }
  
  // Initialize drag and drop functionality
  window.dragDropManager.init();
}

function saveRadio(radioButton) {
  window.localStorage.setItem("radioButton", radioButton.value);
}

// Reset banzuke function for onclick handler
function resetBanzuke() {
  window.dragDropManager.reset();
}