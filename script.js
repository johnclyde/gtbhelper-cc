
var theSekitori = [
  "Y1e Terunofuji 0-0", 
  "",
  "O1e Takakeisho 0-0", 
  "O1w Shodai 0-0", 
  "S1e Wakatakakage 0-0", 
  "S1w Hoshoryu 0-0", 
  "",
  "S2w Mitakeumi 0-0", 
  "K1e Tamawashi 0-0", 
  "K1w Kiribayama 0-0", 
  "K2e Tobizaru 0-0", 
  "K2w Daieisho 0-0", 
  "M1e Takayasu 0-0", 
  "M1w Kotonowaka 0-0", 
  "M2e Meisei 0-0", 
  "M2w Ichinojo 0-0", 
  "M3e Ura 0-0", 
  "M3w Midorifuji 0-0", 
  "M4e Wakamotoharu 0-0", 
  "M4w Sadanoumi 0-0", 
  "M5e Hokutofuji 0-0", 
  "M5w Nishikifuji 0-0", 
  "M6e Nishikigi 0-0", 
  "M6w Ryuden 0-0", 
  "M7e Endo 0-0", 
  "M7w Myogiryu 0-0", 
  "M8e Takarafuji 0-0", 
  "M8w Tochinoshin 0-0", 
  "M9e Takanosho 0-0", 
  "M9w Abi 0-0", 
  "M10e Aoiyama 0-0", 
  "M10w Chiyoshoma 0-0", 
  "M11e Onosho 0-0", 
  "M11w Kotoshoho 0-0", 
  "M12e Kotoeko 0-0", 
  "M12w Chiyotairyu 0-0", 
  "M13e Okinoumi 0-0", 
  "M13w Oho 0-0", 
  "M14e Ichiyamamoto 0-0", 
  "M14w Azumaryu 0-0", 
  "M15e Kagayaki 0-0", 
  "M15w Atamifuji 0-0", 
  "M16e Terutsuyoshi 0-0", 
  "M16w Hiradoumi 0-0", 
  "J1e Tohakuryu 0-0", 
  "J1w Chiyomaru 0-0", 
  "J2e Churanoumi 0-0", 
  "J2w Bushozan 0-0", 
  "J3e Tsurugisho 0-0", 
  "J3w Mitoryu 0-0", 
  "J4e Hidenoumi 0-0", 
  "J4w Yutakayama 0-0", 
  "J5e Akua 0-0", 
  "J5w Chiyonokuni 0-0", 
  "J6e Hokuseiho 0-0", 
  "J6w Kitanowaka 0-0", 
  "J7e Tochimusashi 0-0", 
  "J7w Kinbozan 0-0", 
  "J8e Shimanoumi 0-0", 
  "J8w Kotokuzan 0-0", 
  "J9e Daiamami 0-0", 
  "J9w Daishoho 0-0", 
  "J10e Chiyosakae 0-0", 
  "J10w Kaisho 0-0", 
  "J11e Enho 0-0", 
  "J11w Takakento 0-0", 
  "J12e Tokushoryu 0-0", 
  "J12w Oshoma 0-0", 
  "J13e Shimazuumi 0-0", 
  "J13w Roga 0-0", 
  "J14e Tsushimanada 0-0", 
  "J14w Gonoyama 0-0"
];

window.onload = function() {
  if (window.localStorage.getItem("banzuke1") === null) {
    var cell = document.querySelectorAll(".redips-only");
    var maCardNum = 0;
    
    for (var i = 0; i < theSekitori.length; i++) {
      if (theSekitori[i] !== "") {
        var holder = document.createElement("span");
        holder.innerHTML = theSekitori[i];
        cell[i].appendChild(holder);
        holder.style.display = "none";

        var card = document.createElement("div");

        card.setAttribute("id", theSekitori[i].split(' ')[0]);
        switch (theSekitori[i].charAt(0)) {
          case "M":
            card.setAttribute("class", "redips-drag ma");
            card.setAttribute("data-pos", maCardNum);
            maCardNum++;
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
        card.innerHTML = theSekitori[i];
        cell[i].appendChild(card);
      }
    }

    for (var i = theSekitori.length+18; i < theSekitori.length+66; i++) {
      cell[i].setAttribute("data-pos", i-theSekitori.length-18);
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
      if (rdCell[i].className === "redips-only b2" && 
      event.target.parentNode.className !== "redips-only b2")        // if dropping to banzuke 2
        event.target.parentNode.children[0].style.display = "block"; // show placeholder text in banzuke 1
      else if (rdCell[i].className !== "redips-only b2")
        rdCell[i].children[0].style.display = "none";
    }
  }

  for (var i = 0; i < rdCell.length; i++) {
    if (rdCell[i].className.split(' ')[1] === event.target.id) {
      if (rdCell[i].style.backgroundColor !== "yellow") {
        for (var j = 0; j < b2Cell.length; j++) {
          if (b2Cell[j].style.backgroundColor === "yellow" && 
            b2Cell[j] !== event.target.parentNode) {
            var posDrag = event.target.getAttribute("data-pos"),
                chgDrag;

            if (j < 18) {
              switch (posDrag) {
                case "sa": chgDrag = "";    break;
                case "ju": chgDrag = "!!!"; break;
                default:   chgDrag = "↑";
              }
            }
            else if (j < 54) {
              switch (posDrag) {
                case "sa": chgDrag = "↓"; break;
                case "ju": chgDrag = "↑"; break;
                default:
                  chgDrag = (posDrag - b2Cell[j].getAttribute("data-pos"))/2;
                  if      (chgDrag > 0)  chgDrag = "+" + chgDrag;
                  else if (chgDrag == 0) chgDrag = "─";
              }
            }
            else {
              switch (posDrag) {
                case "sa": chgDrag = "!!!"; break;
                case "ju": chgDrag = "";    break;
                default:   chgDrag = "↓"
              }
            }
            chCell[i].innerHTML = chgDrag;

            if (b2Cell[j].firstChild) { 
              var posSwap = b2Cell[j].firstChild.getAttribute("data-pos"), 
                  chgSwap;

              if (!event.target.parentNode.hasAttribute("data-pos")) {
                switch (posSwap) {
                  case "sa": chgSwap = "";    break;
                  case "ju": chgSwap = "!!!"; break;
                  default:   chgSwap = "↑";
                }
              }
              else if (event.target.parentNode.getAttribute("data-pos") < 36) {
                switch (posSwap) {
                  case "sa": chgSwap = "↓"; break;
                  case "ju": chgSwap = "↑"; break;
                  default:
                    chgSwap = (posSwap - event.target.parentNode.getAttribute("data-pos"))/2;
                    if      (chgSwap > 0)  chgSwap = "+" + chgSwap;
                    else if (chgSwap == 0) chgSwap = "─";
                }
              }
              else {
                switch (posSwap) {
                  case "sa": chgSwap = "!!!"; break;
                  case "ju": chgSwap = "";    break;
                  default:   chgSwap = "↓"
                }
              }

              for (var k = 0; k < rdCell.length; k++) {
                if (rdCell[k].className.split(' ')[1] === b2Cell[j].firstChild.id) 
                  chCell[k].innerHTML = chgSwap;
              }
            }
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

  rd.only.divClass.ma = "b2";
  rd.only.divClass.ju = "b2";

  for (var i = 0; i < theSekitori.length; i++) {
    if (theSekitori[i] !== "") {
      var rank = theSekitori[i].split(' ')[0];

      rd.only.div[rank] = rank;
    }
  }
  rd.event.moved = function () {
    var tbl = rd.findParent("TABLE", rd.obj);

    if (tbl.id === "banzuke1") 
      rd.dropMode = "single";
    else 
      rd.dropMode = "switch";
  };
};

if (window.addEventListener)
  window.addEventListener('load', redips.init, false);
else if (window.attachEvent)
  window.attachEvent('onload', redips.init);

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
