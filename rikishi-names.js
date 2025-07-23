// Rikishi Names Module - Handles custom name editing functionality

/* To make this, enable "One Column" option in SumoDB, copy & paste the tables 
 * as plain text and then turn them into array like this. Don't forget to add 
 * the empty spots in the banzuke (as empty string ""). Put the character ' ' 
 * in between the record and special letter Y, S, DK ... As ' ' 
 * is not considered a regular whitespace, it will not expand.
 */ 
export const theSekitori = [
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
export const sekitoriID = [
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

// Load custom rikishi names from localStorage
export function load() {
    var customNames = localStorage.getItem('customRikishiNames');
    if (customNames) {
      return JSON.parse(customNames);
    }
    return {};
  }

// Save custom rikishi names to localStorage
export function save(customNames) {
    localStorage.setItem('customRikishiNames', JSON.stringify(customNames));
  }

// Make rikishi names editable
export function makeEditable() {
  var customNames = load();
    
    // Add click event to all rikishi name links
    document.addEventListener('click', function(e) {
      // Check if clicked element is a rikishi name link
      if (e.target.tagName === 'A' && e.target.href.includes('Rikishi.aspx?r=')) {
        e.preventDefault();
        
        // Get the rikishi card
        var card = e.target.closest('.redips-drag');
        if (!card) return;
        
        var rikishiId = card.getAttribute('data-rid');
        var currentName = e.target.textContent;
        
        // Create input field
        var input = document.createElement('input');
        input.type = 'text';
        input.value = customNames[rikishiId] || currentName;
        input.style.width = '80px';
        input.style.fontSize = '12px';
        
        // Replace link with input
        e.target.style.display = 'none';
        e.target.parentNode.insertBefore(input, e.target);
        input.focus();
        input.select();
        
        // Handle input events
        function saveEdit() {
          var newName = input.value.trim();
          if (newName && newName !== currentName) {
            customNames[rikishiId] = newName;
            save(customNames);
            e.target.textContent = newName;
          } else if (newName === '') {
            // If empty, revert to original name
            delete customNames[rikishiId];
            save(customNames);
            e.target.textContent = currentName;
          }
          input.remove();
          e.target.style.display = '';
          
          // Save the entire banzuke state
          import('./banzuke-state.js').then(module => {
            module.saveBanzukeState();
          });
        }
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', function(event) {
          if (event.key === 'Enter') {
            saveEdit();
          } else if (event.key === 'Escape') {
            input.remove();
            e.target.style.display = '';
          }
        });
      }
    });
    
    // Apply custom names on load
    var allLinks = document.querySelectorAll('a[href*="Rikishi.aspx?r="]');
    allLinks.forEach(function(link) {
      var card = link.closest('.redips-drag');
      if (card) {
        var rikishiId = card.getAttribute('data-rid');
        if (customNames[rikishiId]) {
          link.textContent = customNames[rikishiId];
        }
      }
    });
  }
  
