
'use strict';

/* To make this, enable "One Column" option in SumoDB, copy & paste the tables 
 * as plain text and then turn them into array like this. Don't forget to add 
 * the empty spots in the banzuke (as empty string ""). Put the character ' ' 
 * in between the record and special letter Y, S, DK ... As ' ' 
 * is not considered a regular whitespace, it will not expand.
 */ 
var theSekitori = [
  "Y1e Terunofuji 0-0", 
  "", 
  "", 
  "O1w Takakeisho 8-1", 
  "S1e Wakatakakage 0-0", 
  "S1w Hoshoryu 0-0", 
  "S2e Takayasu 0-0", 
  "S2w Shodai 0-0", 
  "K1e Kiribayama 0-0", 
  "K1w Kotonowaka 0-0", 
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
  "J1e Akua 0-0", 
  "J1w Bushozan 0-0", 
  "J2e Hokuseiho 0-0", 
  "J2w Daiamami 0-0", 
  "J3e Atamifuji 0-0", 
  "J3w Oshoma 0-0", 
  "J4e Tohakuryu 0-0", 
  "J4w Enho 0-0", 
  "J5e Kinbozan 8-1", 
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
  "J12w Asanoyama 9-0", 
  "J13e Shonannoumi 0-0", 
  "J13w Kaisho 0-0", 
  "J14e Tsushimanada 0-0", 
  "J14w Hakuyozan 0-0"
];

/* Add here the shikona of retired sekitori, who will not appear in the 
 * following banzuke. If nobody retired leave this array empty
 */
var retiredRikishi = ["Okinoumi"];

/* Enable "No Rank Colouring" and "One Column" options and then open the 
 * browser's inspector (F12). Find the table and copy & paste the <tbody> node. 
 * The rikishi ID is located right after "Rikishi.aspx?r=". Turn the IDs into an 
 * array (add the empty spots as 0). This array should have the same length as 
 * theSekitori array.
 */
var sekitoriID = [
  11927, 
  0, 
  0, 
  12191, 
  12370, 
  12451, 
  6480, 
  12130, 
  12231, 
  12270, 
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

let redips = {}, 
    rd     = REDIPS.drag;

//***** Just update the "basho" variable and you're all done. *****

window.onload = function() {

  var basho = "202301"; // The date of the basho just ended

  var CLIENT_ID = "527214845927-p6ofscooll9ettfc8vpb4f5dqbhome4h.apps.googleusercontent.com";
  var API_KEY = "AIzaSyBiIfRASPUPjYmDLggGBQKCw63h-5B073o";
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
  // https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid
  var SCOPES = "https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.resource";
  var signinButton = document.getElementById("signinButton");
  var signoutButton = document.getElementById("signoutButton");
  var saveToDriveButton = document.getElementById("saveToDrive");
  var loadSaveButton = document.getElementById("loadSave");
  var messageLine = document.getElementById("messageLine");
  var progressText = document.getElementById("progressText");
  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

  signinButton.style.display = "none";
  signoutButton.style.display = "none";
  saveToDriveButton.style.display = "none";
  loadSaveButton.style.display = "none";

  gapiLoaded();
  gisLoaded();

  function gapiLoaded() {
    gapi.load("client", initializeGapiClient);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: DISCOVERY_DOCS
    });
    gapiInited = true;
    maybeEnableButtons();
  }

  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES, 
      prompt: "", 
      callback: ""
    });
    gisInited = true;
    maybeEnableButtons();
  }

  function maybeEnableButtons() {
    if (gapiInited && gisInited) {
      signinButton.style.display = "inline-block";
      messageLine.innerHTML = "Save or load your banzuke via Google Drive";
      progressText.innerHTML = "";
    }
  }

  signinButton.onclick = () => handleAuthClick()
  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) 
        throw (resp);
      signinButton.style.display = "none";
      signoutButton.style.display = "inline-block";
      saveToDriveButton.style.display = "inline-block";
      loadSaveButton.style.display = "inline-block";
      messageLine.innerHTML = "Please wait...";
      checkFolder("GTB Helper Save (do not modify)");
    };

    if (gapi.client.getToken() === null) 
      tokenClient.requestAccessToken({ prompt: "consent" });
    else 
      tokenClient.requestAccessToken({ prompt: "" });
  }

  signoutButton.onclick = () => handleSignoutClick()
  function handleSignoutClick() {
    const token = gapi.client.getToken();

    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken("");
      signinButton.style.display = "inline-block";
      signoutButton.style.display = "none";
      saveToDriveButton.style.display = "none";
      loadSaveButton.style.display = "none";
      messageLine.innerHTML = "Save or load your banzuke via Google Drive";
      progressText.innerHTML = "";
    }
  }

  function checkFolder(folderName) {
    gapi.client.drive.files.list({
      'q': "name = '" + folderName + "'"
    }).then(function (response) {
      var files = response.result.files;

      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];

          window.localStorage.setItem("backupFolderId", file.id);
          //console.log("Folder available");
          showSave();
        }
      }
      else {
        createFolder("GTB Helper Save (do not modify)");
        messageLine.innerHTML = "No save";
        loadSaveButton.disabled = true;
      }
    });
  }

  function createFolder(folderName) {
    var access_token = gapi.auth.getToken().access_token;
    var request = gapi.client.request({
      "path": "drive/v2/files",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json", 
        "Authorization": "Bearer " + access_token
      }, 
      "body": {
        "title": folderName, 
        "mimeType": "application/vnd.google-apps.folder"
      }
    });
    request.execute(function (response) {
      window.localStorage.setItem("backupFolderId", response.id);
    })
  }

  function showSave() {
    var saveId = "";

    gapi.client.drive.files.list({
      'q': "name = 'gtb_helper_save.txt' and parents in '" + 
           window.localStorage.getItem("backupFolderId") + "'"
    }).then(function (response) {
      var files = response.result.files;

      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var saveId = files[i].id;

          gapi.client.drive.files.get({
            "fileId": saveId, 
            "fields": "modifiedTime"
          }).then(function (res) {
            var modifiedTime = moment(res.result.modifiedTime, 
              "YYYY-MM-DDThh:mm:ss.SSSZ").format("dddd, MMMM Do YYYY, h:mm:ss a");

            messageLine.setAttribute("data-saveId", saveId);
            messageLine.innerHTML = "From " + modifiedTime;
            loadSaveButton.disabled = false;
          });
        }
      }
      else {
        loadSaveButton.disabled = true;
        messageLine.innerHTML = "No save";
      }
    })
  }

  function uploadSave() {
    const blob = new Blob([window.localStorage.getItem("banzuke")], { type: "plain/text" });
    const parentFolder = window.localStorage.getItem("backupFolderId");
    var metadata = {
      name: "gtb_helper_save.txt", 
      mimeType: "plain/text", 
      parents: [parentFolder]
    };
    var formData = new FormData();

    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    formData.append("file", blob);

    fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
      method: "POST", 
      headers: new Headers({ "Authorization": "Bearer " + gapi.auth.getToken().access_token }), 
      body: formData
    }).then(function (response) {
      if (response.ok) {
        progressText.innerHTML = "Saved!";
        showSave();
        setTimeout(function() {
          progressText.innerHTML = "";
        }, 1000);
      }
      else {
        console.error(response);
        progressText.innerHTML = "Access token expired. Please sign out and try again";
      }
      //return response.json();
    }).catch(function(err) {});
  }

  function updateSave() {
    var saveId = messageLine.getAttribute("data-saveId");
    var url = "https://www.googleapis.com/upload/drive/v3/files/" + saveId + "?uploadType=media";
    
    fetch(url, {
      method: "PATCH",
      headers: new Headers({
        Authorization: "Bearer " + gapi.auth.getToken().access_token,
        "Content-type": "plain/text; charset=UTF-8"
      }), 
      body: window.localStorage.getItem("banzuke")
    }).then(function (response) {
      if (response.ok) {
        progressText.innerHTML = "Saved!";
        showSave();
        setTimeout(function() {
          progressText.innerHTML = "";
        }, 1000);
      }
      else {
        console.error(response);
        progressText.innerHTML = "Access token expired. Please sign out and try again";
      }
    }).catch(function(err) {});
  }

  function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
  }

  saveToDriveButton.addEventListener("click", function() {
    if (window.localStorage.getItem("banzuke") !== null) {
      progressText.innerHTML = "Please wait...";

      if (messageLine.innerHTML == "No save") 
        uploadSave();
      else 
        updateSave();
    }
  });

  loadSaveButton.addEventListener("click", function() {
    var saveId = messageLine.getAttribute("data-saveId");

    progressText.innerHTML = "Please wait...";

    gapi.client.drive.files.get({
      fileId: saveId, 
      alt: "media"
    }).then(function (res) {
      var banzukeHtml = b64_to_utf8(btoa(res.body));

      document.getElementById("tableLiner").innerHTML = banzukeHtml;
      window.localStorage.setItem("banzuke", banzukeHtml);
      redips.init();
      progressText.innerHTML = "";
    }).catch(function (err) {
      console.error(err);
      progressText.innerHTML = "Access token expired. Please sign out and try again";
    });
  });

  //****************************************************************************

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

    tableTitle[0].innerHTML = getBashoName(bashoMonth) + ' ' + bashoYear + 
                              tableTitle[0].innerHTML;
    if (bashoMonth > 9) {
      bashoYear++;
      bashoMonth = -1;
    }
    tableTitle[1].innerHTML = getBashoName(bashoMonth+2) + ' ' + bashoYear + 
                              " Guess - " + tableTitle[1].innerHTML;
  }

  function populateSlots() {
    var cell = document.querySelectorAll(".redips-only");
    
    for (var i = 0; i < theSekitori.length; i++) {
      if (theSekitori[i] !== "") {
        var card     = document.createElement("div"), 
            rikiData = theSekitori[i].split(' ');

        card.id = rikiData[0];
        card.className = "redips-drag se";
        card.setAttribute("data-rid", sekitoriID[i]);

        if (rikiData[2].split('-')[0] < 8) 
          card.setAttribute("data-ko", "0")
        else 
          card.setAttribute("data-ko", "1")

        rikiData[2] = '<a href="https://sumodb.sumogames.de/Rikishi_basho.aspx?r=' + 
                      sekitoriID[i] + "&b=" + basho + '" target="_blank">' + rikiData[2] + "</a>";

        card.innerHTML = rikiData.join(' ');

        rikiData[1] = '<a href="https://sumodb.sumogames.de/Rikishi.aspx?r=' + 
                      sekitoriID[i] + '" target="_blank">' + rikiData[1] + "</a>";

        if (retiredRikishi.includes(theSekitori[i].split(' ')[1])) {
          card.innerHTML = rikiData.join(' ');
          card.style.backgroundColor = "#ffe4b4";
          card.className = "redips-drag intai";
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
}

function saveRadio(radioButton) {
  window.localStorage.setItem("radioButton", radioButton.value);
}

// *****************************************************************************

rd.animation = "off";

redips.init = function () {
  rd.init();
  rd.hover.colorTd = "yellow";
  //rd.hover.borderTd = "2px solid blue";
  rd.dropMode = "multiple";
  rd.only.divClass.se = "b2";

  rd.enableDrag(false, ".intai");

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
        if (targetCell.nextSibling.innerHTML == 'J') 
          targetCellRank = 'J';
        else 
          targetCellRank = targetCell.nextSibling.innerHTML + 'e';
      }
      else if (targetCell.nextSibling.className == "ch") {
        targetChgCell = targetCell.nextSibling;
        if (targetCell.previousSibling.innerHTML == "J") 
          targetCellRank = 'J';
        else 
          targetCellRank = targetCell.previousSibling.innerHTML + 'w';
      }

      if (thisRank == targetCellRank) 
        thisChg = '─';
      else {
        const change = [
          ["calc", "!!!", "!!!", "!!!", "!!!", "!!!"], 
          [" ↑ ", "calc", " ↓ ", "!!!", "!!!", "!!!"], 
          ["!!!", " ↑ ", "calc", " ↓ ", " ↓ ", "!!!"], 
          ["!!!", "!!!", " ↑ ", "calc", " ↓ ", "!!!"], 
          ["!!!", "!!!", " ↑ ", " ↑ ", "calc", " ↓ "], 
          ["!!!", "!!!", "!!!", "!!!", " ↑ ", '⇄']
        ]
        var r1, r2;

        switch (thisRank.charAt(0)) {
          case 'Y': r1 = 0; break;
          case 'O': r1 = 1; break;
          case 'S': r1 = 2; break;
          case 'K': r1 = 3; break;
          case 'M': r1 = 4; break;
          default:  r1 = 5;
        }
        switch (targetCellRank.charAt(0)) {
          case 'Y': r2 = 0; break;
          case 'O': r2 = 1; break;
          case 'S': r2 = 2; break;
          case 'K': r2 = 3; break;
          case 'M': r2 = 4; break;
          default:  r2 = 5;
        }

        if (change[r1][r2] != "calc") 
          thisChg = change[r1][r2];
        else {
          var thisRankNum   = parseInt(thisRank.slice(1, -1)), 
              targetRankNum = parseInt(targetCellRank.slice(1, -1));
          
          if (thisRank.slice(-1) == 'w')       thisRankNum += 0.5;
          if (targetCellRank.slice(-1) == 'w') targetRankNum += 0.5;

          thisChg = thisRankNum - targetRankNum;

          if (thisChg > 0) 
            thisChg = '+' + thisChg;
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
  if (confirm("Reset the banzuke? This will not reset your save in Google Drive") == true) {
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

if (window.addEventListener)
  window.addEventListener("load", redips.init, false);
else if (window.attachEvent)
  window.attachEvent("onload", redips.init);
