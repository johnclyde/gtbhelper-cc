
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

window.onload = function() {

  document.getElementById("resetChanges").addEventListener("click", function() {
    if (confirm("Reset the banzuke?") == true) {
      window.localStorage.removeItem("banzuke1");
      window.localStorage.removeItem("banzuke2");
      location.reload();
    }
  });
/*
  document.getElementById("saveBanzuke").addEventListener("click", function() {

    window.localStorage.setItem("banzuke1", 
      document.getElementById("banzuke1").innerHTML);
    window.localStorage.setItem("banzuke2", 
      document.getElementById("banzuke2").innerHTML);

    var table = document.getElementsByTagName("table");

    table[0].style.border = "2px solid lightgreen"
    table[1].style.border = "2px solid lightgreen";
    setTimeout(changeBorder, 300);
    function changeBorder() {
      table[0].style.border = "2px solid dimgray";
      table[1].style.border = "2px solid dimgray";
    }
  
  });*/

  if (window.localStorage.getItem("banzuke1") === null) {
    var cell = document.querySelectorAll(".redips-only");
    
    for (var i = 0; i < theSekitori.length; i++) {
      if (theSekitori[i] !== "") {
        var holder = document.createElement("span");
        holder.innerHTML = theSekitori[i];
        cell[i].appendChild(holder);
        holder.style.display = "none";

        var card = document.createElement("div");
        var rikiData = theSekitori[i].split(' ');

        card.innerHTML = theSekitori[i];
        card.setAttribute("id", rikiData[0].toLowerCase());
        card.setAttribute("class", "redips-drag se");
        if (rikiData[1] == "Chiyotairyu" || rikiData[1] == "Yutakayama") {
          card.style.background = "linear-gradient(#acacac, #e9e9e9 25%)";
          card.style.cursor = "default";
          card.setAttribute("class", "redips-nodrag");
          card.setAttribute("title", "Retired");
        }
        else if (rikiData[2].split('-')[0] < 8) 
          card.style.background = "linear-gradient(#acacac, #ffd9cc 25%)";
        else 
          card.style.background = "linear-gradient(#acacac, #d3ffa5 25%)";
        cell[i].appendChild(card);
      }
    }
  }
  else {
    document.getElementById("banzuke1").innerHTML = 
    window.localStorage.getItem("banzuke1");

    document.getElementById("banzuke2").innerHTML = 
    window.localStorage.getItem("banzuke2");
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll(".redips-drag"));

  cards.forEach(card => {

    card.addEventListener("touchstart", cardDown);
    card.addEventListener("mousedown", cardDown);

    card.addEventListener("mouseup", cardUp);
    card.addEventListener("touchend", cardUp);
  });
  function cardDown() {
    var style = this.getBoundingClientRect();
    //console.log(style.top);
    //console.log(style.left);
    this.parentNode.style.backgroundImage = "url(shadow.png)";
  }
  function cardUp() {
    this.parentNode.style.removeProperty("background-image");

    var rdCell = document.querySelectorAll(".redips-only");
    var chCell = document.getElementsByClassName("ch");
    var b2Cell = document.getElementsByClassName("redips-only b2");
    var makRik = document.getElementById("makRik");

    for (var i = 0; i < b2Cell.length; i++) {
      if (b2Cell[i] === this.parentNode && 
        this.style.position === "fixed") {
        chCell[i].innerHTML = "";
        if (b2Cell[i].children.length > 0) {
          for (var j = 0; j < b2Cell[i].children.length; j++) {
            var rank = b2Cell[i].children[j].id,
                chg;

            if (b2Cell[i].children[j] !== this) {
              if (i < 18) {
                switch (rank.charAt(0)) {
                  case 'm': chg = "↑"; break;
                  case 'j': chg = "!!!"; break;
                  default: chg = " "; break;
                }
              }
              else {
                switch (rank.charAt(0)) {
                  case 'm': 
                    var maPos = rank.slice(1, -1)*2-2;
                    
                    if (rank.slice(-1) == 'w') 
                      maPos++;
                    chg = (maPos-i+18)/2;
                    if (chg > 0) 
                      chg = "+" + chg;
                    else if (chg == 0) 
                      chg = "─";
                    break;
                  case 'j': chg = "↑"; break;
                  default: chg = "↓";
                }
              }

              if (chCell[i].innerHTML.length == 0) 
                chCell[i].innerHTML = chg;
              else 
                chCell[i].innerHTML += "<br>" + chg;
            }
          }
        }
      }
    }

    for (var i = 0; i < rdCell.length; i++) {
      if (rdCell[i].style.backgroundColor === "yellow") {
        if (rdCell[i].className === "redips-only b2" && 
        this.parentNode.className !== "redips-only b2") {
          this.parentNode.children[0].style.display = "block";
          makRik.innerHTML++;
        }
        else if (rdCell[i].className !== "redips-only b2" && 
          rdCell[i] !== this.parentNode) {
          rdCell[i].children[0].style.display = "none";
          rdCell[i].appendChild(this);
          rdCell[i].removeAttribute("style");
          makRik.innerHTML--;
        }
      }
    }

    for (var i = 0; i < b2Cell.length; i++) {
      if (b2Cell[i].style.backgroundColor === "yellow") {
        chCell[i].innerHTML = "";
        b2Cell[i].appendChild(this);
        for (var j = 0; j < b2Cell[i].children.length; j++) {
          var rank = b2Cell[i].children[j].id,
              chg;

          if (i < 18) {
            switch (rank.charAt(0)) {
              case 'm': chg = "↑"; break;
              case 'j': chg = "!!!"; break;
              default: chg = " "; break;
            }
          }
          else {
            switch (rank.charAt(0)) {
              case 'm': 
                var maPos = rank.slice(1, -1)*2-2;
                
                if (rank.slice(-1) == 'w') 
                  maPos++;
                chg = (maPos-i+18)/2;
                if (chg > 0) 
                  chg = "+" + chg;
                else if (chg == 0) 
                  chg = "─";
                break;
              case 'j': chg = "↑"; break;
              default: chg = "↓";
            }
          }

          if (chCell[i].innerHTML.length == 0) 
            chCell[i].innerHTML = chg;
          else 
            chCell[i].innerHTML += "<br>" + chg;
        }
        b2Cell[i].removeAttribute("style");
      }
    }
    this.style.removeProperty("z-index");
    this.style.removeProperty("position");
    this.style.removeProperty("top");
    this.style.removeProperty("left");

    //if (document.getElementById("autosave").checked) {
      window.localStorage.setItem("banzuke1", 
        document.getElementById("banzuke1").innerHTML);
      window.localStorage.setItem("banzuke2", 
        document.getElementById("banzuke2").innerHTML);
    //}
  }
}

'use strict';

let redips = {};

redips.init = function () {
  let rd = REDIPS.drag;
  
  rd.init();
  rd.hover.colorTd = "yellow";
  rd.dropMode = "multiple";

  rd.only.divClass.se = "b2";
  for (var i = 0; i < theSekitori.length; i++) {
    if (theSekitori[i] !== "") {
      var rank = theSekitori[i].split(' ')[0].toLowerCase();

      rd.only.div[rank] = rank;
    }
  }
};

if (window.addEventListener)
  window.addEventListener('load', redips.init, false);
else if (window.attachEvent)
  window.attachEvent('onload', redips.init);
