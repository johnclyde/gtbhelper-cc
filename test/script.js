
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

window.identity = {};

//***** Just update the 'basho' variable and you're all done. *****

window.onload = function() {


// this source code used updated google sign in options 
// after the previous button is deprecated

  var CLIENT_ID = '527214845927-p6ofscooll9ettfc8vpb4f5dqbhome4h.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyBiIfRASPUPjYmDLggGBQKCw63h-5B073o';
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
  var SCOPES = 
  'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.resource';
  var signinButton = document.getElementsByClassName('signin')[0];
  var signoutButton = document.getElementsByClassName('signout')[0];
  var messageLine = document.getElementById("message");
  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

  signinButton.style.display = "none";
  signoutButton.style.display = "none";
  document.getElementById("createFile").style.display = "none";
  
  gapiLoaded();
  gisLoaded();

  function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: DISCOVERY_DOCS,
    });
    gapiInited = true;
    maybeEnableButtons();
  }

  function handleCredentialResponse(response) {
    window.identity = jwt_decode(response.credential);
  }

  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES, 
      prompt: "", 
      callback: handleCredentialResponse
    });
    gisInited = true;
    maybeEnableButtons();
  }

  function maybeEnableButtons() {
    if (gapiInited && gisInited) 
      signinButton.style.display = 'block';
  }

  signinButton.onclick = () => handleAuthClick()
  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      signinButton.style.display = 'none'
      signoutButton.style.display = 'block'
      document.getElementById("createFile").style.display = "block";
      messageLine.innerHTML = "Signed in as <b>" + window.identity.name + "</b>";
      checkFolder();
    };

    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  signoutButton.onclick = () => handleSignoutClick()
  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      signinButton.style.display = 'block'
      signoutButton.style.display = 'none'
      document.getElementById("createFile").style.display = "none";
      messageLine.innerHTML = "Not signed in";
    }
  }

  // check for a Backup Folder in google drive
  function checkFolder() {
    gapi.client.drive.files.list({
      'q': 'name = "GTB Helper Folder"',
    }).then(function (response) {
      var files = response.result.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          window.localStorage.setItem('parent_folder', file.id);
          console.log('Folder Available');
          // get files if folder available
          //showList();
        }
      } else {
              // if folder not available then create
        createFolder();
      }
    })
  }

  document.getElementById("createFile").addEventListener("click", upload);

  function upload() {
    if (window.localStorage.getItem("banzuke1") !== null) {
      const blob = new Blob([window.localStorage.getItem("banzuke1")], { type: 'plain/text' });
        // get parent folder id from localstorage
      const parentFolder = window.localStorage.getItem('parent_folder');
        // set file metadata
      var metadata = {
            // get first two words from the input text and set as file name instead of backup-file
        name: 'banzuke1.txt',
        mimeType: 'plain/text',
        parents: [parentFolder]
      };
      var formData = new FormData();
      formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append("file", blob);

      fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: 'POST',
        headers: new Headers({ "Authorization": "Bearer " + gapi.auth.getToken().access_token }),
        body: formData
      }).then(function (response) {
        return response.json();
      }).then(function (value) {
        console.log(value);
      });
    }
  }

  function createFolder() {
    var access_token = gapi.auth.getToken().access_token;
    var request = gapi.client.request({
      'path': 'drive/v2/files',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token,
      },
      'body': {
        'title': 'GTB Helper Folder',
        'mimeType': 'application/vnd.google-apps.folder'
      }
    });
    request.execute(function (response) {
      localStorage.setItem('parent_folder', response.id);
    })
  }

  var basho      = "202211", // The date of the basho just ended
      bashoYear  = parseInt(basho.substring(0, 4)), 
      bashoMonth = parseInt(basho.slice(-2)), 
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

  if (bashoMonth == 11) 
    tableTitle[1].innerHTML = "Hatsu " + (bashoYear+1) + " Guess - " + tableTitle[1].innerHTML;
  else {
    tableTitle[1].innerHTML = getBashoName(bashoMonth+2) + ' ' + bashoYear + 
                              " Guess - " + tableTitle[1].innerHTML;
  }

  document.getElementById("resetBanzuke").addEventListener("click", function() {
    if (confirm("Reset the banzuke?") == true) {
      window.localStorage.removeItem("banzuke1");
      window.localStorage.removeItem("banzuke2");
      //window.localStorage.removeItem("radioButton");
      location.reload();
    }
  });

  if (window.localStorage.getItem("banzuke1") === null) {
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

        var cardText = document.createElement("span");
        cardText.className = "ctxt";

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
        holder.className = "hold";

        cell[i].appendChild(holder);
        cell[i].appendChild(card);
      }
    }
    var b2Cell = document.querySelectorAll(".b2");

    for (var i = 0; i < b2Cell.length; i++) 
      b2Cell[i].style.border = "1px dashed dimgray"
  }
  else {
    document.getElementById("banzuke1").innerHTML = 
    window.localStorage.getItem("banzuke1");

    document.getElementById("banzuke2").innerHTML = 
    window.localStorage.getItem("banzuke2");
  }

  var radioButton = document.getElementsByClassName("checkbox"), 
      radioLocal  = window.localStorage.getItem("radioButton");

  if (radioLocal === null || radioLocal == "openRikishiPage")
    radioButton[0].checked = true;
  else 
    radioButton[1].checked = true;
}

function saveRadio(radioButton) {
  window.localStorage.setItem("radioButton", radioButton.value);
}

'use strict';

let redips = {}, 
    rd = REDIPS.drag;

redips.init = function () {
  rd.init();
  rd.hover.colorTd = "yellow";
  //rd.hover.borderTd = "2px solid blue";
  rd.dropMode = "multiple";
  rd.only.divClass.se = "b2";
  rd.animation = "off";

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
    else if (!currentCell.classList.contains("b2")) {
      rd.relocate(currentCell, rd.td.previous);
    }
    else 
    for (var i = 0; i < theSekitori.length; i++) {
      if (b1Cell[i].classList.contains(thisRank) && 
        currentCell.classList.contains("b2")) {
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
            window.localStorage.setItem("banzuke1", 
              document.getElementById("banzuke1").innerHTML);
            window.localStorage.setItem("banzuke2", 
              document.getElementById("banzuke2").innerHTML);
          }
        });
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
        targetCell.style.removeProperty("border");
      }
      else 
        targetChgCell.innerHTML += "<br>" + thisChg;
    }

  };

  rd.event.finish = function() {
    window.localStorage.setItem("banzuke1", 
      document.getElementById("banzuke1").innerHTML);
    window.localStorage.setItem("banzuke2", 
      document.getElementById("banzuke2").innerHTML);
  };

};

if (window.addEventListener)
  window.addEventListener('load', redips.init, false);
else if (window.attachEvent)
  window.attachEvent('onload', redips.init);
