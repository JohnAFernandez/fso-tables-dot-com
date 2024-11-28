// Run at the start of the page (called from the html) with our best guess at Architecture
function initPage(){
  toggleContents(false, "cover");
  
  if (getCookie("mode") != "about") {
    showWelcome();
    document.cookie = `mode=welcome`;  
  }
  
}

// Switch the download link contents on or off.
function toggleContents(enable, id)
{
  const element = document.getElementById(id);

  if (enable === true){
    element.style.display = '';
  } else if (enable === false){
    element.style.display = 'none';
  }
}

function showWelcome()
{
    toggleContents(true, "welcome-text-area");
    toggleContents(false, "about-text-area")
}

function showAbout()
{
  toggleContents(false, "welcome-text-area");
  toggleContents(true, "about-text-area")
}

// This one will probably take some time.
function showTables()
{
  toggleContents(false, "welcome-text-area");
  toggleContents(true, "about-text-area")
}

/*

// Change the appearance of the tab based on whether it's selected.
function toggleSelectedTab(enable, id2){
  const element = document.getElementById(id2);

  if (enable === true){
    element.style.fontWeight = 'bold';
    element.style.backgroundColor = "#121212";
  } else if (enable === false){
    element.style.fontWeight = 'normal';
    element.style.backgroundColor = "#080808";
  }
}
*/
/*
// Disable the auto detected downoad because we are not confident enough to have the correct choice.
function disableTheButton(){
  toggleContents(false, "downLinks");
  toggleContents(false, "downloadTab");
}




function setPageTheme(theme){
  const validThemes = [ "Knet", "Classic", "Vishnan", "Ancients", "Nightmare", "Ae" ];

  if ( !validThemes.includes(theme) ) return;

  document.body.setAttribute('data-theme', theme);
  document.cookie = `theme=${theme}`;
}
*/

function setPageMode(mode){
  const validModes = ['welcome', 'about', 'tables'];
  const mode_index = validModes.findIndex(mode);

  if ( mode_index < 0 ) return;
  else if ( mode_index == 0 ) {
    showWelcome();
  } else if (mode_index == 1) {
    showAbout();
  } else {
    showTables();
  }

  document.cookie = `mode=${validModes[mode]}`;
}

// Borrowed from w3schools
function getCookie(cookieName) {
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}