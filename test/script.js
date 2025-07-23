
/* To make this, enable "One Column" option in SumoDB, copy & paste the tables 
 * as plain text and then turn them into array like this. Don't forget to add 
 * the empty spots in the banzuke (as empty string ""). Put the character ' ' 
 * in between the record and special letter Y, S, DK ... As ' ' 
 * is not considered a regular whitespace, it will not expand.
 */ 
var theSekitori = [
  "Y1e Hoshoryu 0-0", 
  "Y1w Onosato 0-0", 
  "O1e Kotozakura 0-0", 
  "", 
  "S1e Wakatakakage 0-0", 
  "", 
  "S2e Takayasu 0-0", 
  "S2w Shodai 0-0", 
  "K1e Kirishima 0-0", 
  "", 
  "K2e Meisei 0-0", 
  "K2w Wakamotoharu 0-0", 
  "M1e Tobizaru 0-0", 
  "M1w Daieisho 0-0", 
  "M2e Mitakeumi 0-0", 
  "M2w Tamawashi 0-0", 
  "M3e Abi 0-0", 
  "M3w Midorifuji 0-0", 
  "M4e Nishikifuji 0-0", 
  "M4w Sadanoumi 0-0", 
  "M5e Ryuden 0-0", 
  "M5w Nishikigi 0-0", 
  "M6e Hokutofuji 0-0", 
  "M6w Myogiryu 0-0", 
  "M7e Ichinojo 0-0", 
  "M7w Ura 0-0", 
  "M8e Onosho 0-0", 
  "M8w Oho 0-0", 
  "M9e Takanosho 0-0", 
  "M9w Endo 0-0", 
  "M10e Aoiyama 0-0", 
  "M10w Hiradoumi 0-0", 
  "M11e Chiyoshoma 0-0", 
  "M11w Tochinoshin 0-0", 
  "M12e Kagayaki 0-0", 
  "M12w Okinoumi 0-0", 
  "M13e Kotoshoho 0-0", 
  "M13w Kotoeko 0-0", 
  "M14e Ichiyamamoto 0-0", 
  "M14w Azumaryu 0-0", 
  "M15e Tsurugisho 0-0", 
  "M15w Mitoryu 0-0", 
  "M16e Takarafuji 0-0", 
  "M16w Chiyomaru 0-0", 
  "M17e Kusano 0-0",
  "M17w Fujinokawa 0-0",
  "J1e Akua 0-0", 
  "J1w Bushozan 0-0", 
  "J2e Hokuseiho 0-0", 
  "J2w Daiamami 0-0", 
  "J3e Atamifuji 0-0", 
  "J3w Oshoma 0-0", 
  "J4e Tohakuryu 0-0", 
  "J4w Enho 0-0", 
  "J5e Kinbozan 0-0", 
  "J5w Kotokuzan 0-0", 
  "J6e Churanoumi 0-0", 
  "J6w Daishoho 0-0", 
  "J7e Chiyonokuni 0-0", 
  "J7w Tochimusashi 0-0", 
  "J8e Shimanoumi 0-0", 
  "J8w Kitanowaka 0-0", 
  "J9e Roga 0-0", 
  "J9w Hidenoumi 0-0", 
  "J10e Gonoyama 0-0", 
  "J10w Terutsuyoshi 0-0", 
  "J11e Chiyosakae 0-0", 
  "J11w Shimazuumi 0-0", 
  "J12e Takakento 0-0", 
  "J12w Asanoyama 0-0", 
  "J13e Shonannoumi 0-0", 
  "J13w Kaisho 0-0", 
  "J14e Tsushimanada 0-0", 
  "J14w Hakuyozan 0-0"
];

/* Enable "No Rank Colouring" and "One Column" options and then open the 
 * browser's inspector (F12). Find the table and copy & paste the <tbody> node. 
 * The rikishi ID is located right after "Rikishi.aspx?r=". Turn the IDs into an 
 * array (add the empty spots as 0). This array should have the same length as 
 * theSekitori array.
 */
var sekitoriID = [
  12451, 
  12453, 
  12270, 
  0, 
  12370, 
  0, 
  6480, 
  12130, 
  12231, 
  0, 
  11946, 
  11980, 
  12203, 
  11985, 
  12210, 
  5944, 
  12094, 
  12352, 
  12351, 
  2879, 
  6594, 
  6596, 
  12239, 
  11784, 
  12107, 
  12226, 
  12043, 
  12453, 
  11855, 
  12055, 
  11786, 
  12314, 
  11785, 
  6599, 
  11845, 
  6463, 
  12449, 
  7153, 
  12362, 
  11723, 
  12113, 
  12406, 
  11728, 
  7240, 
  12000,
  12001,
  11918, 
  12117, 
  12646, 
  12273, 
  12664, 
  12717, 
  12575, 
  12412, 
  12721, 
  11809, 
  12320, 
  12040, 
  6642, 
  12674, 
  12024, 
  12548, 
  12516, 
  12026, 
  12688, 
  11868, 
  11736, 
  12013, 
  12114, 
  12291, 
  12162, 
  12075, 
  12342, 
  11943
];

//***** Just update the "basho" variable and you're all done. *****

window.onload = function() {


  var basho = "202301"; // The date of the basho just ended

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
          case 'J': thisChg = " ↑ "; break;
          default:
            thisChg = " ↓ ";
            thisRank = thisRank.substring(0, 1);
        }
      }
      else if (targetCellRank.charAt(0) == 'J') {
        targetCellRank = 'J';
        switch (thisRank.charAt(0)) {
          case 'M': thisChg = " ↓ "; break;
          case 'J': thisChg = "⇄"; break;
          default:  thisChg = "!!!";
        }
      }
      else {
        switch (thisRank.charAt(0)) {
          case 'M': 
            thisChg = " ↑ ";
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
