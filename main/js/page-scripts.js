// Run at the start of the page (called from the html) with our best guess at Architecture
function initPage(){
  console.log("Initializing Page... v0.1");

  console.log("Getting the mode cookie...")
  const ourCookie = getCookie("mode");
  console.log(`Found "${ourCookie}", continuing...`);

  if (ourCookie != "tables") {
    console.log("Setting welcome page...");
    setPageMode("welcome");
  } else {
    console.log("Setting tables page");
    setPageMode("tables");
  }

  console.log("Finally, removing the pre-load cover...")
  toggleContents(false, "cover");

  console.log("Pre-load cover removed.  Initialization successfully completed!")
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


function setPageTheme(theme){
  const validThemes = [ "Knet", "Classic", "Vishnan", "Ancients", "Nightmare", "Ae" ];

  if ( !validThemes.includes(theme) ) return;

  document.body.setAttribute('data-theme', theme);
  document.cookie = `theme=${theme}`;
}
*/

function setPageMode(mode){
  const validModes = ['welcome', 'about', 'tables'];
  const mode_index = validModes.indexOf(mode);

  if ( mode_index < 0 ) { 
    console.log()
    return;
  }
  else if ( mode_index == 0 ) {
    showWelcome();
  } else if (mode_index == 1) {
    showAbout();
  } else {
    showTables();
  }

  document.cookie = `mode=${validModes[mode_index]}; SameSite=strict`;
}

// Borrowed from w3schools, but I made it slightly more efficient in edge cases.
function getCookie(cookieName) {
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];

    // This is the edited block.  Instead of substringing every time an empty character is found,
    // do the correct substring from the first *non* space character.
    for (let j = 0; j < c.length; j++){
      if (c.charAt(j) != ' ') {
        c = c.substring(j);
        break;
      }
    }

    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}