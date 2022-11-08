
var theSekitori = [
  "Y1e Terunofuji 5-5-5",
  "",
  "O1e Takakeisho 10-5",
  "O1w Shodai 4-11",
  "",
  "O2w Mitakeumi 4-11",
  "S1e Wakatakakage 11-4 JG",
  "S1w Hoshoryu 8-7",
  "S2e Daieisho 7-8",
  "",
  "K1e Abi 0-0-15",
  "K1w Ichinojo 6-9",
  "",
  "K2w Kiribayama 9-6",
  "M1e Tobizaru 10-5 S",
  "M1w Midorifuji 7-8",
  "M2e Kotonowaka 8-7",
  "M2w Meisei 8-7",
  "M3e Tamawashi 13-2 YS",
  "M3w Ura 8-7",
  "M4e Nishikigi 6-9",
  "M4w Takayasu 11-4 JK",
  "M5e Takarafuji 5-10",
  "M5w Sadanoumi 9-6",
  "M6e Wakamotoharu 10-5",
  "M6w Endo 7-8",
  "M7e Aoiyama 6-9",
  "M7w Onosho 5-10",
  "M8e Tochinoshin 7-8",
  "M8w Hokutofuji 10-5",
  "M9e Myogiryu 8-7",
  "M9w Kotoeko 6-9",
  "M10e Nishikifuji 10-5",
  "M10w Takanosho 8-7",
  "M11e Kotoshoho 7-8",
  "M11w Chiyotairyu 6-9",
  "M12e Okinoumi 6-9",
  "M12w Ryuden 11-4 J",
  "M13e Ichiyamamoto 6-9",
  "M13w Oho 7-8",
  "M14e Chiyoshoma 9-6",
  "M14w Yutakayama 4-11",
  "M15e Terutsuyoshi 6-9",
  "M15w Tsurugisho 5-10",
  "M16e Mitoryu 5-10",
  "M16w Hiradoumi 7-8",
  "J1e Shimanoumi 4-11",
  "J1w Chiyomaru 7-8",
  "J2e Chiyonokuni 6-9",
  "J2w Azumaryu 9-6",
  "J3e Atamifuji 8-7",
  "J3w Tohakuryu 8-7",
  "J4e Kagayaki 9-6",
  "J4w Bushozan 8-7",
  "J5e Hidenoumi 8-7",
  "J5w Asanowaka 0-1-14",
  "J6e Akua 8-7",
  "J6w Churanoumi 9-6",
  "J7e Kotokuzan 7-8",
  "J7w Enho 6-9",
  "J8e Daiamami 7-8",
  "J8w Daishoho 7-8",
  "J9e Hokuseiho 9-6",
  "J9w Kaisho 7-8",
  "J10e Shimazuumi 6-9",
  "J10w Tokushoryu 7-8",
  "J11e Chiyosakae 8-7",
  "J11w Kitanowaka 10-5",
  "J12e Gonoyama 6-9",
  "J12w Kinbozan 10-5",
  "J13e Oshoma 8-7",
  "J13w Tochimaru 2-13",
  "J14e Tochimusashi 11-4 Y",
  "J14w Takakento 9-6"
];


window.onload = function() {
  if (window.localStorage.getItem("banzuke1") === null) {
    var banzuke1 = document.getElementById("banzuke1");
    var c = 0, maePos1 = 0;
    
    for (let row of banzuke1.rows) {
      for (let cell of row.cells) {
        if (cell.innerHTML === "") {
          if (theSekitori[c] !== "") {
            var holder = document.createElement("span");
            holder.innerHTML = theSekitori[c];
            cell.appendChild(holder);
            holder.style.display = "none";

            var card = document.createElement("div");
            var rank = theSekitori[c].split(' ')[0];

            card.setAttribute("id", rank);
            switch (Array.from(rank)[0]) {
              case "M":
                card.setAttribute("class", "redips-drag ma");
                card.setAttribute("data-pos", maePos1);
                maePos1++;
                break;
              case "J":
                card.setAttribute("class", "redips-drag ju");
                card.setAttribute("data-pos", "ju");
                break;
              default:
                card.setAttribute("class", "redips-drag ma");
                card.setAttribute("data-pos", "sa");
            }

            card.setAttribute("onmouseup", "cardDrop()");
            card.setAttribute("ontouchend", "cardDrop()");
            card.innerHTML = theSekitori[c];
            cell.appendChild(card);
          }
          c++;
        }
      }
    }

    var banzuke2 = document.getElementById("banzuke2");
    var maePos2 = 0;
    
    for (let row of banzuke2.rows) {
      for (let cell of row.cells) {
        if (cell.className === "redips-only b2" && cell.parentElement.className !== "san") {
          cell.setAttribute("data-pos", maePos2);
          maePos2++;
        }
        else 
          cell.setAttribute("data-pos", "");
      }
    }
  }
  else {
    document.getElementById("banzuke1").innerHTML = window.localStorage.getItem("banzuke1");
    document.getElementById("banzuke2").innerHTML = window.localStorage.getItem("banzuke2");
  }
}

function cardDrop() {
  var rdCell = document.querySelectorAll(".redips-only");         // All droppable cells
  var chCell = document.getElementsByClassName("ch");             // Cells which show rikishi's rank change
  var b2Cell = document.getElementsByClassName("redips-only b2"); // Droppable cells in banzuke 2

  for (var i = 0; i < rdCell.length; i++) {
    if (rdCell[i].style.backgroundColor === "yellow") {
      if (rdCell[i].className === "redips-only b2")                  // if dropping to banzuke 2
        event.target.parentNode.children[0].style.display = "block"; // show placeholder text in banzuke 1
      else 
        rdCell[i].children[0].style.display = "none";
    }
  }

  for (var i = 0; i < theSekitori.length; i++) {
    if (rdCell[i].className.split(' ')[1] === event.target.id) {
      if (rdCell[i].style.backgroundColor !== "yellow") {
        for (var j = 0; j < b2Cell.length; j++) {
          if (b2Cell[j].style.backgroundColor === "yellow") {
            var pos = event.target.getAttribute("data-pos"),
                change;

            if (j < 18) {
              switch (pos) {
                case "sa":
                  change = "";
                  break;
                case "ju":
                  change = "!!!";
                  break;
                default:
                  change = "↑";
              }
            }
            else if (j < 54) {
              switch (pos) {
                case "sa":
                  change = "↓";
                  break;
                case "ju":
                  change = "↑";
                  break;
                default:
                  change = (pos - b2Cell[j].getAttribute("data-pos"))/2;
                  if (change > 0)       change = "+" + change;
                  else if (change == 0) change = "─";
              }
            }
            else {
              switch (pos) {
                case "sa":
                  change = "!!!";
                  break;
                case "ju":
                  change = "";
                  break;
                default:
                  change = "↓"
              }
            }
            chCell[i].innerHTML = change;
          }
        }
      }
      else 
        chCell[i].innerHTML = "";
    }
  }
}

'use strict';

let redips = {};

redips.init = function () {
  let rd = REDIPS.drag;
  
  rd.init();
  rd.hover.colorTd = "yellow";
  rd.dropMode = "single";

  for (var i = 0; i < theSekitori.length; i++) {
    if (theSekitori[i] !== "") {
      var rank = theSekitori[i].split(' ')[0];

      rd.only.div[rank] = rank;
      rd.only.divClass.ma = "b2";
      rd.only.divClass.ju = "b2";
    }
  }
};

redips.setMode = function (radioButton) {
  let rd = REDIPS.drag;

  /*rd.event.moved = function () {
    var tbl = rd.findParent("TABLE", rd.obj);

    if (tbl.id === "banzuke1") 
      rd.dropMode = "single";
    else */
  rd.dropMode = radioButton.value;
};


function saveTable() {
  var banzuke1Content = document.getElementById("banzuke1").innerHTML;
  window.localStorage.setItem("banzuke1", banzuke1Content);

  var banzuke2Content = document.getElementById("banzuke2").innerHTML;
  window.localStorage.setItem("banzuke2", banzuke2Content);
}

function deleteLs() {
  window.localStorage.removeItem("banzuke1");
  window.localStorage.removeItem("banzuke2");
}

if (window.addEventListener)
  window.addEventListener('load', redips.init, false);
else if (window.attachEvent)
  window.attachEvent('onload', redips.init);
