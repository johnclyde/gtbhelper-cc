
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

  var resetButton = document.getElementById("resetChanges");

  resetButton.addEventListener("click", function() {
    if (confirm("Reset the banzuke?") == true) {
      window.localStorage.removeItem("banzuke1");
      window.localStorage.removeItem("banzuke2");
      location.reload();
    }
  })

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

        card.innerHTML = theSekitori[i];
        cell[i].appendChild(card);
      }
    }

    // Adding position attribute to maegashira cells of banzuke2
    for (var i = theSekitori.length+18; i < theSekitori.length+66; i++) 
      cell[i].setAttribute("data-pos", i-theSekitori.length-18);

    // This process removes drop update delay in first column of banzuke2
    var rows = document.getElementsByTagName("tr");

    for (var i = theSekitori.length/2; i < rows.length; i++) {
      var invCell = document.createElement("td");
      
      rows[i].insertBefore(invCell, rows[i].firstChild);
      invCell.style.display = "none";
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

    card.addEventListener("mousedown", function() {
      this.parentNode.style.backgroundImage = "url(shadow.png)";
    });

    card.addEventListener("mouseup", function() {
      this.parentNode.removeAttribute("style");

      var rdCell = document.querySelectorAll(".redips-only");
      var chCell = document.getElementsByClassName("ch");
      var b2Cell = document.getElementsByClassName("redips-only b2");

      for (var i = 0; i < rdCell.length; i++) {
        if (rdCell[i].style.backgroundColor === "yellow") {
          if (rdCell[i].className === "redips-only b2" && 
          this.parentNode.className !== "redips-only b2") 
            this.parentNode.children[0].style.display = "block";
          else if (rdCell[i].className !== "redips-only b2")
            rdCell[i].children[0].style.display = "none";
        }
      }

      for (var i = 0; i < rdCell.length; i++) {
        if (rdCell[i].className.split(' ')[1] === this.id) {
          if (rdCell[i].style.backgroundColor !== "yellow") {
            for (var j = 0; j < b2Cell.length; j++) {
              if (b2Cell[j].style.backgroundColor === "yellow" && 
                b2Cell[j] !== this.parentNode) {
                var posDrag = this.getAttribute("data-pos"),
                    chgDrag;

                if (j < 18) {
                  switch (posDrag) {
                    case "sa": chgDrag = ""; break;
                    case "ju": chgDrag = "!!!"; chCell[i].style.color = "#656565"; break;
                    default:   chgDrag = "↑"; chCell[i].style.color = "forestgreen";
                  }
                }
                else if (j < 54) {
                  switch (posDrag) {
                    case "sa": chgDrag = "↓"; chCell[i].style.color = "red"; break;
                    case "ju": chgDrag = "↑"; chCell[i].style.color = "forestgreen"; break;
                    default:
                      chgDrag = (posDrag - b2Cell[j].getAttribute("data-pos"))/2;
                      if (chgDrag > 0) {
                        chgDrag = "+" + chgDrag;
                        chCell[i].style.color = "forestgreen";
                      }
                      else if (chgDrag == 0) {
                        chgDrag = "─"; 
                        chCell[i].style.color = "#656565";
                      }
                      else chCell[i].style.color = "red"; 
                  }
                }
                else {
                  switch (posDrag) {
                    case "sa": chgDrag = "!!!"; chCell[i].style.color = "#656565"; break;
                    case "ju": chgDrag = ""; break;
                    default: chgDrag = "↓"; chCell[i].style.color = "red";
                  }
                }
                chCell[i].innerHTML = chgDrag;
                

                if (b2Cell[j].firstChild) {                   
                  var posSwap = b2Cell[j].firstChild.getAttribute("data-pos"), 
                      chgSwap;

                  if (!this.parentNode.hasAttribute("data-pos")) {
                    switch (posSwap) {
                      case "sa": chgSwap = "";    break;
                      case "ju": chgSwap = "!!!"; break;
                      default:   chgSwap = "↑";
                    }
                  }
                  else if (this.parentNode.getAttribute("data-pos") < 36) {
                    switch (posSwap) {
                      case "sa": chgSwap = "↓"; break;
                      case "ju": chgSwap = "↑"; break;
                      default:
                        chgSwap = (posSwap - this.parentNode.getAttribute("data-pos"))/2;
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

                  this.parentNode.appendChild(b2Cell[j].firstChild);
                }

                b2Cell[j].appendChild(this);
                b2Cell[j].removeAttribute("style");
              }
            }
          }
          else {
            rdCell[i].appendChild(this);
            rdCell[i].removeAttribute("style");
            chCell[i].innerHTML = "";
          }
        }
      }
      this.removeAttribute("style");

      window.localStorage.setItem("banzuke1", 
        document.getElementById("banzuke1").innerHTML);
      window.localStorage.setItem("banzuke2", 
        document.getElementById("banzuke2").innerHTML);
    });
  });
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
