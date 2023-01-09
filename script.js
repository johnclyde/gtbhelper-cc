/* To make this, enable "One Column" option in SumoDB, copy & paste the tables 
 * as plain text and then turn them into array like this. Don't forget to add 
 * the empty spots in the banzuke (as empty string ""). Put the character ' ' 
 * in between the record and special letter Y, S, DK ... As ' ' 
 * is not considered a regular whitespace, it will not expand.
 */ 
var theSekitori = [
  "Y1e Terunofuji 0-0-15", 
  "", 
  "O1e Takakeisho 12-3 D", 
  "O1w Shodai 6-9", 
  "S1e Wakatakakage 8-7", 
  "S1w Hoshoryu 11-4 G", 
  "",
  "S2w Mitakeumi 6-9", 
  "K1e Tamawashi 6-9", 
  "K1w Kiribayama 8-7", 
  "K2e Tobizaru 7-8", 
  "K2w Daieisho 7-8", 
  "M1e Takayasu 12-3 DS", 
  "M1w Kotonowaka 9-6", 
  "M2e Meisei 9-6", 
  "M2w Ichinojo 4-11", 
  "M3e Ura 4-11", 
  "M3w Midorifuji 8-7", 
  "M4e Wakamotoharu 10-5", 
  "M4w Sadanoumi 8-7", 
  "M5e Hokutofuji 7-8", 
  "M5w Nishikifuji 9-6", 
  "M6e Nishikigi 8-7", 
  "M6w Ryuden 9-6", 
  "M7e Endo 6-9", 
  "M7w Myogiryu 8-7", 
  "M8e Takarafuji 3-12", 
  "M8w Tochinoshin 6-9", 
  "M9e Takanosho 7-8", 
  "M9w Abi 12-3 YK", 
  "M10e Aoiyama 7-8", 
  "M10w Chiyoshoma 7-8", 
  "M11e Onosho 9-6", 
  "M11w Kotoshoho 7-8", 
  "M12e Kotoeko 7-8", 
  "M12w Chiyotairyu 2-6", 
  "M13e Okinoumi 8-7", 
  "M13w Oho 10-5", 
  "M14e Ichiyamamoto 7-8", 
  "M14w Azumaryu 7-8", 
  "M15e Kagayaki 9-6", 
  "M15w Atamifuji 4-11", 
  "M16e Terutsuyoshi 0-15", 
  "M16w Hiradoumi 10-5", 
  "J1e Tohakuryu 5-10", 
  "J1w Chiyomaru 8-7", 
  "J2e Churanoumi 4-11", 
  "J2w Bushozan 8-7", 
  "J3e Tsurugisho 10-5", 
  "J3w Mitoryu 9-6", 
  "J4e Hidenoumi 4-11", 
  "J4w Yutakayama 5-10", 
  "J5e Akua 10-5", 
  "J5w Chiyonokuni 6-9", 
  "J6e Hokuseiho 10-5", 
  "J6w Kitanowaka 6-9", 
  "J7e Tochimusashi 7-8", 
  "J7w Kinbozan 8-7", 
  "J8e Shimanoumi 7-8", 
  "J8w Kotokuzan 8-7", 
  "J9e Daiamami 11-4 D", 
  "J9w Daishoho 8-7", 
  "J10e Chiyosakae 7-8", 
  "J10w Kaisho 5-10", 
  "J11e Enho 10-5", 
  "J11w Takakento 7-8", 
  "J12e Tokushoryu 4-11", 
  "J12w Oshoma 11-4 Y", 
  "J13e Shimazuumi 8-7", 
  "J13w Roga 9-6", 
  "J14e Tsushimanada 7-8", 
  "J14w Gonoyama 9-6"
];

/* Enable "No Rank Colouring" and "One Column" options and then open the 
 * browser's inspector (F12). Find the table and copy & paste the <tbody> node. 
 * The rikishi ID is located right after "Rikishi.aspx?r=". Turn the IDs into an 
 * array (add the empty spots as 0). This array should have the same length as 
 * theSekitori array.
 */
var sekitoriID = [
  11927, 
  0, 
  12191, 
  12130, 
  12370, 
  12451, 
  0, 
  12210, 
  5944, 
  12231, 
  12203, 
  11985, 
  6480, 
  12270, 
  11946, 
  12107, 
  12226, 
  12352, 
  11980, 
  2879, 
  12239, 
  12351, 
  6596, 
  6594, 
  12055, 
  11784, 
  11728, 
  6599, 
  11855, 
  12094, 
  11786, 
  11785, 
  12043, 
  12449, 
  7153, 
  11934, 
  6463, 
  12453, 
  12362, 
  11723, 
  11845, 
  12664, 
  11868, 
  12314, 
  12575, 
  7240, 
  12320, 
  12117, 
  12113, 
  12406, 
  12026, 
  12292, 
  11918, 
  6642, 
  12646, 
  12548, 
  12674, 
  12721, 
  12024, 
  11809, 
  12273, 
  12040, 
  11736, 
  12075, 
  12412, 
  12114, 
  11726, 
  12717, 
  12013, 
  12516, 
  12342, 
  12688
];

//***** Just update the "basho" variable and you're all done. *****

window.onload = function() {

  var basho = "202211"; // The date of the basho just ended

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
      document.getElementById("progressText").innerHTML = "";
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
      messageLine.innerHTML = "Save or load your banzuke";
      document.getElementById("progressText").innerHTML = "";
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
      }
    })
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
          })
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
      return response.json();
    }).then(function (value) {
      //console.log(value);
      //showSave();
    });
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
    }).then(value => {
      //console.log("Saved progress to Drive successfully");
      //showSave();
    }).catch(err => console.error(err))
  }

  function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
  }

  saveToDriveButton.addEventListener("click", function() {
    if (window.localStorage.getItem("banzuke") !== null) {
      document.getElementById("progressText").innerHTML = "Please wait...";

      if (messageLine.innerHTML == "No save") 
        uploadSave();
      else 
        updateSave();

      messageLine.innerHTML = "From " + moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a");
      document.getElementById("progressText").innerHTML = "Saved!";
      setTimeout(function() {
        document.getElementById("progressText").innerHTML = "";
      }, 1000);
    }
  });

  loadSaveButton.addEventListener("click", function() {
    var saveId = messageLine.getAttribute("data-saveId");

    document.getElementById("progressText").innerHTML = "Please wait...";

    gapi.client.drive.files.get({
      fileId: saveId, 
      alt: "media"
    }).then(function (res) {
      var banzukeHtml = b64_to_utf8(btoa(res.body));

      document.getElementById("tableLiner").innerHTML = banzukeHtml;
      window.localStorage.setItem("banzuke", banzukeHtml);
      redips.init();
      document.getElementById("progressText").innerHTML = "";
    });
  });

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
    
    for (var i = 0; i < theSekitori.length; i++) {
      if (theSekitori[i] !== "") {
        var card     = document.createElement("div"), 
            rikiData = theSekitori[i].split(' ');

        card.setAttribute("id", rikiData[0]);
        card.className = "redips-drag se";
        card.setAttribute("data-rid", sekitoriID[i]);

        if (rikiData[2].split('-')[0] < 8) 
          card.style.backgroundColor = "#ffd2d2";
        else 
          card.style.backgroundColor = "#c2ff9f";

        rikiData[2] = '<a href="https://sumodb.sumogames.de/Rikishi_basho.aspx?r=' + 
                      sekitoriID[i] + "&b=" + basho + '" target="_blank">' + rikiData[2] + "</a>";

        card.innerHTML = rikiData.join(' ');

        rikiData[1] = '<a href="https://sumodb.sumogames.de/Rikishi.aspx?r=' + 
                      sekitoriID[i] + '" target="_blank">' + rikiData[1] + "</a>";

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
          ["calc", " ↓ ", "!!!", "!!!", "!!!", "!!!"], 
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
