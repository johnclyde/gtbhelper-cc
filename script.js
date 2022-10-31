
var rikishi = [
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
  
  var currentBanzuke = document.getElementById("currentBanzuke");
  var c = 0, maePos1 = 0;
  
  for (let row of currentBanzuke.rows) {
    for (let cell of row.cells) {
      if (cell.innerText === "") {
        if (rikishi[c] !== "") {
          var holder = document.createElement("span");
          
          holder.innerHTML = rikishi[c];
          holder.style.display = "none";
          cell.appendChild(holder);

          var card = document.createElement("div");
          var rank = rikishi[c].split(' ')[0];

          card.setAttribute("id", rank);
          switch (Array.from(rank)[0]) {
              case "M":
                card.setAttribute("class", "redips-drag card");
                card.setAttribute("data-pos", maePos1);
                maePos1++;
                break;
              case "J":
                card.setAttribute("class", "redips-drag ju");
                card.setAttribute("data-pos", "");
                break;
              default:
                card.setAttribute("class", "redips-drag card");
                card.setAttribute("data-pos", "");
          }
          card.setAttribute("onclick", "cardDrop()");
          card.innerHTML = rikishi[c];
          cell.appendChild(card);
        }
        c++;
      }
    }
  }

  var nextBanzuke = document.getElementById("nextBanzuke");
  var maePos2 = 0;
  
  for (let row of nextBanzuke.rows) {
    for (let cell of row.cells) {
      if (cell.className === "redips-only next" && cell.parentElement.className !== "san") {
        cell.setAttribute("data-pos", maePos2);
        maePos2++;
      }
      else 
        cell.setAttribute("data-pos", "");
    }
  }

  var currBanzukeContent = document.getElementById("currentBanzuke").innerHTML;
  localStorage.setItem("table1", currBanzukeContent);

  var nextBanzukeContent = document.getElementById("nextBanzuke").innerHTML;
  localStorage.setItem("table2", nextBanzukeContent);
}


function cardDrop() {
  var cells = document.getElementsByTagName("td");
  
  for (var i = 0; i < cells.length; i++) {
    if (cells[i].className === "redips-only " + event.target.getAttribute("id")) {
      if (cells[i].children.length > 1) 
        cells[i].children[0].style.display = "none";
      else 
        cells[i].children[0].style.display = "block";
    }
  }

  var nextCells = document.getElementsByClassName("redips-only next");
  var posCells = document.getElementsByClassName("mvmt");

  for (var i = 18; i < nextCells.length; i++) {
    if (nextCells[i].style.backgroundColor === "yellow") {
      if (event.target.getAttribute("data-pos") !== "") {
        var change = (event.target.getAttribute("data-pos") - nextCells[i].getAttribute("data-pos"))/2;
        
        if (change >= 0) 
          posCells[i].innerHTML = "+" + change.toString();
        else 
          posCells[i].innerHTML = change;
      }
      else if (event.target.getAttribute("data-pos") === "")
        posCells[i].innerHTML = " ";
    }
  }
  for (var i = 18; i < nextCells.length; i++) {
    if (nextCells[i].children.length > 0) {
      for (var j = 0; j < nextCells[i].children.length; j++) {
        var change = (nextCells[i].children[j].getAttribute("data-pos") - nextCells[i].getAttribute("data-pos"))/2;

        if (nextCells[i].children[j].getAttribute("data-pos") !== "") {
          if (j == 0) {
            if (change >= 0)
              posCells[i].innerHTML = "+" + change.toString();
            else 
              posCells[i].innerHTML = change;
          }
          else if (change >= 0)
              posCells[i].innerHTML = posCells[i].innerHTML + "<br>+" + change.toString();
          else 
            posCells[i].innerHTML = posCells[i].innerHTML + "<br>" + change.toString();
        }
        else if (nextCells[i].children[j].getAttribute("data-pos") === "") {
          if (j == 0) 
            posCells[i].innerHTML = " ";
          else 
            posCells[i].innerHTML = posCells[i].innerHTML + "<br> ";
        }
      }
    }
    else 
      posCells[i].innerHTML = " ";
  }
}

'use strict';

let redips = {};

redips.init = function () {
  let rd = REDIPS.drag;
  
  rd.init();
  rd.hover.colorTd = "yellow";
  rd.dropMode = "single";

  for (var i = 0; i < rikishi.length; i++) {
    if (rikishi[i] !== "") {
      var rank = rikishi[i].split(' ')[0];

      rd.only.div[rank] = rank;
      rd.only.divClass.card = "next";
      rd.only.divClass.ju = "next";

      /*rd.only.divClass.yok = "next";
      rd.only.divClass.oz = "next";
      rd.only.divClass.seki = "next";
      rd.only.divClass.ko = "next";
      rd.only.divClass.mae = "next";
      rd.only.divClass.ju = "next";*/
    }
  }

  
};

redips.setMode = function (radioButton) {
  let rd = REDIPS.drag;

  rd.event.moved = function () {
    // find parent table of element
    var tbl = rd.findParent("TABLE", rd.obj);

    // if table id is currentBanzuke
    if (tbl.id === "currentBanzuke") 
      rd.dropMode = "single";
    else 
      rd.dropMode = radioButton.value;
  };
};

if (window.addEventListener)
  window.addEventListener('load', redips.init, false);
else if (window.attachEvent)
  window.attachEvent('onload', redips.init);
