//***** Just update the "basho" variable and you're all done. *****

// These need to be global for other functions to access
var basho = "202301"; // The date of the basho just ended

window.onload = function() {

  if (window.localStorage.getItem("banzuke1") !== null) {
    window.localStorage.removeItem("banzuke1");
    window.localStorage.removeItem("banzuke2");
  }
  if (window.localStorage.getItem("banzuke") === null) {
    writeTableTitles(basho);
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

  function writeTableTitles(endedBashoDate) {
    var bashoYear  = parseInt(endedBashoDate.substring(0, 4)), 
        bashoMonth = parseInt(endedBashoDate.slice(-2)), 
        tableTitle = document.getElementsByClassName("tableTitle");

    const bashoMonthLookup = {
            1: "Hatsu", 
            3: "Haru", 
            5: "Natsu", 
            7: "Nagoya", 
            9: "Aki",
            11: "Kyushu"
          }, 
          getBashoName = (bMonth) => bashoMonthLookup[bMonth];

    tableTitle[0].innerHTML = getBashoName(bashoMonth) + ' ' + bashoYear;
    if (bashoMonth > 9) {
      bashoYear++;
      bashoMonth = -1;
    }
    tableTitle[1].innerHTML = getBashoName(bashoMonth+2) + ' ' + bashoYear + 
                              " Guess - " + tableTitle[1].innerHTML;
  }

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
  
  // Initialize REDIPS drag and drop after everything is loaded
  redips.init();
}

function saveRadio(radioButton) {
  window.localStorage.setItem("radioButton", radioButton.value);
}

'use strict';

let redips = {}, 
    rd     = REDIPS.drag;

rd.animation = "off";

redips.init = function () {
  rd.init();
  rd.hover.colorTd = "yellow";
  //rd.hover.borderTd = "2px solid blue";
  rd.dropMode = "multiple";
  rd.only.divClass.se = "b2";
  
  // Initialize editable rikishi names
  window.rikishiNames.makeEditable();

  for (var i = 0; i < theSekitori.length; i++) {
    if (theSekitori[i] !== "") {
      var rank = theSekitori[i].split(' ')[0];
      rd.only.div[rank] = rank;
    }
  }

  rd.event.dblClicked = function() {

    var radioButton = document.getElementsByTagName("input");
    var rikishiURL  = "https://sumodb.sumogames.de/Rikishi.aspx?r=" + rd.obj.dataset.rid;
    var thisRank    = rd.obj.id, 
        b1Cell      = document.getElementsByTagName("td"), 
        currentCell = rd.findParent('TD', rd.obj), 
        currentChgCell;
    
    if (radioButton[0].checked) 
      window.open(rikishiURL, "_blank").focus();
    else if (currentCell.classList.contains("b2")) {
      for (var i = 0; i <= theSekitori.length; i++) {
        if (b1Cell[i].classList.contains(thisRank)) {
          if (currentCell.previousSibling.className == "ch") 
            currentChgCell = currentCell.previousSibling;
          else if (currentCell.nextSibling.className == "ch")
            currentChgCell = currentCell.nextSibling;

          if (currentCell.children.length > 1) {
            var chgs = currentChgCell.innerHTML.split("<br>");

            for (var j = 0; j < currentCell.children.length; j++) {
              if (currentCell.children[j] == rd.obj) {
                chgs.splice(j, 1);
                currentChgCell.innerHTML = chgs.join("<br>");
              }
            }
          }
          else {
            currentChgCell.innerHTML = " ";
            currentCell.style.border = "1px dashed dimgray";
          }

          rd.moveObject({
            obj: rd.obj, 
            target: b1Cell[i], 
            callback: function () {
              document.getElementById("makRik").innerHTML--;
              b1Cell[i].children[0].style.display = "none";
              b1Cell[i].style.removeProperty("border");
              window.localStorage.setItem("banzuke", 
                document.getElementById("tableLiner").innerHTML);
            }
          });
        }
      }
    }

  };

  rd.event.clicked = function(currentCell) {
    currentCell.style.backgroundColor = "lightblue";
  };

  rd.event.notMoved = function() {
    var currentCell = rd.findParent('TD', rd.obj); 
    currentCell.style.removeProperty("background-color");
  };

  rd.event.droppedBefore = function(targetCell) {

    var rikiCount   = document.getElementById("makRik"), 
        thisCard    = rd.obj, 
        currentCell = rd.findParent('TD', thisCard), 
        currentChgCell;

    currentCell.style.removeProperty("background-color");

    if (!currentCell.classList.contains("b2") && 
      targetCell.classList.contains("b2")) {
      currentCell.children[0].style.display = "block";
      currentCell.style.border = "1px dashed dimgray";
      rikiCount.innerHTML++;
    }
    else if (currentCell.classList.contains("b2") && 
      !targetCell.classList.contains("b2")) {
      targetCell.children[0].style.display = "none";
      targetCell.style.removeProperty("border");
      rikiCount.innerHTML--;
    }
    
    if (currentCell.classList.contains("b2")) {
      if (currentCell.previousSibling.className == "ch") 
        currentChgCell = currentCell.previousSibling;
      else if (currentCell.nextSibling.className == "ch")
        currentChgCell = currentCell.nextSibling;

      if (currentCell.children.length > 1) {
        var chgs = currentChgCell.innerHTML.split("<br>");

        for (var i = 0; i < currentCell.children.length; i++) {
          if (currentCell.children[i] == thisCard) {
            chgs.splice(i, 1);
            currentChgCell.innerHTML = chgs.join("<br>");
          }
        }
      }
      else {
        currentChgCell.innerHTML = " ";
        currentCell.style.border = "1px dashed dimgray";
      }
    }

  };

  rd.event.dropped = function(targetCell) {

    if (targetCell.classList.contains("b2")) {
      var thisRank = rd.obj.id, 
          rikishiWins = rd.obj.innerText.split(' ')[2].split('-')[0], 
          thisChg, targetChgCell, targetCellRank;

      if (targetCell.previousSibling.className == "ch") {
        targetChgCell = targetCell.previousSibling;
        targetCellRank = targetCell.nextSibling.innerHTML + 'e';
      }
      else if (targetCell.nextSibling.className == "ch") {
        targetChgCell = targetCell.nextSibling;
        targetCellRank = targetCell.previousSibling.innerHTML + 'w';
      }

      if (targetCellRank.charAt(0) == 'M') {
        switch (thisRank.charAt(0)) {
          case 'M': 
            var thisMaeNum  = parseInt(thisRank.slice(1, -1)), 
                targetMaeNum = parseInt(targetCellRank.slice(1, -1));
            
            if (thisRank.slice(-1) == 'w')       thisMaeNum += 0.5;
            if (targetCellRank.slice(-1) == 'w') targetMaeNum += 0.5;

            thisChg = thisMaeNum - targetMaeNum;

            if (thisChg > 0) 
              thisChg = "+" + thisChg;
            else if (thisChg == 0) 
              thisChg = "─";
            break;
          case 'J': thisChg = " ↑ "; break;
          default:
            thisChg = " ↓ ";
            thisRank = thisRank.substring(0, 1);
        }
      }
      else if (targetCellRank.charAt(0) == 'J') {
        targetCellRank = 'J';
        switch (thisRank.charAt(0)) {
          case 'M': thisChg = " ↓ "; break;
          case 'J': thisChg = "⇄"; break;
          default:  thisChg = "!!!";
        }
      }
      else {
        switch (thisRank.charAt(0)) {
          case 'M': 
            thisChg = " ↑ ";
            targetCellRank = targetCellRank.substring(0, 1);
            break;
          case 'J': thisChg = "!!!"; break;
          default:  thisChg = "⇄";
        }
      }

      thisChg = '<a href="https://sumodb.sumogames.de/Query.aspx?show_form=0&form1_rank=' + 
                thisRank + "&form1_wins=" + rikishiWins + 
                "&form1_year=193905-194401,194905-now&form2_highlight=on&form2_rank=" + 
                targetCellRank + '" target="_blank" title="Click to run a SumoDB query">' + thisChg + "</a>";

      if (targetChgCell.innerHTML == " ") {
        targetChgCell.innerHTML = thisChg;
        targetCell.style.border = "none";
      }
      else 
        targetChgCell.innerHTML += "<br>" + thisChg;
    }

  };

  rd.event.finish = function() {
    window.localStorage.setItem("banzuke", document.getElementById("tableLiner").innerHTML);
  };

};

redips.resetBanzuke = function() {
  if (confirm("Reset the banzuke?") == true) {
    var b1Cell  = document.getElementsByTagName("td"), 
        b2Cell  = document.querySelectorAll(".b2"), 
        chgCell = document.getElementsByClassName("ch");

    window.localStorage.removeItem("banzuke");
    document.getElementById("makRik").innerHTML = 0;
    
    for (var i = 0; i < b2Cell.length; i++) {
      if (b2Cell[i].children.length > 0) {
        b2Cell[i].style.border = "1px dashed dimgray";
        chgCell[i].innerHTML = ' ';
        for (var j = b2Cell[i].children.length-1; j >= 0 ; j--) {
          for (var k = 0; k <= theSekitori.length; k++) {
            if (b1Cell[k].classList.contains(b2Cell[i].children[j].id)) {
              rd.moveObject({
                obj: b2Cell[i].children[j], 
                target: b1Cell[k]
              });
              b1Cell[k].children[0].style.display = "none";
              b1Cell[k].style.removeProperty("border");
              break;
            }
          }
        }
      }
    }
  }
};

// Remove these as we'll call redips.init from within window.onload
// if (window.addEventListener)
//   window.addEventListener("load", redips.init, false);
// else if (window.attachEvent)
//   window.attachEvent("onload", redips.init);