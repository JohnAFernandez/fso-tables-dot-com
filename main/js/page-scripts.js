// Run at the start of the page (called from the html) with our best guess at Architecture
function initPage(){
  console.log("Initializing Page... v0.1");

  console.log("Getting the mode cookie...")
  const ourCookie = getCookie("mode");
  console.log(`Found "${ourCookie}", continuing...`);

  if (ourCookie === "welcome") {
    console.log("Setting welcome page...");
    setPageMode("welcome");
  } else if (ourCookie === "tables") {
    console.log("Setting tables page...");
    setPageMode("tables");
  } else if (ourCookie === "account") {
    console.log("Setting account page...");
    setPageMode("account");
  } else {
    console.log("Setting about page...");
    setPageMode("about");
  }

  check_login_status_and_update();

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
  toggleContents(false, "account-text-area")
  toggleContents(false, "tables-text-area")
}

function showAbout()
{
  toggleContents(false, "welcome-text-area");
  toggleContents(true, "about-text-area")
  toggleContents(false, "account-text-area")
  toggleContents(false, "tables-text-area")
}

function showAccount()
{
  toggleContents(false, "welcome-text-area");
  toggleContents(false, "about-text-area")
  toggleContents(true, "account-text-area")
  toggleContents(false, "tables-text-area")
}

// This one will probably take some time.
function showTables()
{
  toggleContents(false, "welcome-text-area");
  toggleContents(false, "about-text-area")
  toggleContents(false, "account-text-area")
  toggleContents(true, "tables-text-area")
}

function setPageMode(mode){
  const validModes = ['welcome', 'about', 'tables', 'account'];
  const mode_index = validModes.indexOf(mode);

  if ( mode_index < 0 ) { 
    console.log("Invalid mode set, setting to welcome.");
    showWelcome();
    return;
  }
  else if ( mode_index == 0 ) {
    showWelcome();
  } else if (mode_index == 1) {
    showAbout();
  } else if (mode_index == 2) {
    showTables();
  } else {
    showAccount();
  }

  setCookie("mode", validModes[mode_index], 24*365*10);
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
        if (j > 0){
          c = c.substring(j);
        }
        break;
      }
    }

    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}

// all cookies in this context are going to use SameSite=strict. duration is in hours.
function setCookie(name, value, duration){
  const d = new Date();
  d.setTime(d.getTime() + (duration*60*60*1000));

  // Domain seems not to be settable unless in a live environment, and cannot be cross-ite for security reasons.  This is problematic, and I
  // think the teacher app will have to be more integrated.  Less about static sites and closer to a react setup, where subdomains are not needed.

  document.cookie = `${name}=${value};SameSite=strict;expires=${d.toUTCString()};Secure`;
}

// status should be a bool with true value meaning not logged in
function setLoginStatus(status) {
  toggleContents(status, "nav-login");
  toggleContents(status, "nav-register");
  toggleContents(!status, "nav-account");
  toggleContents(!status, "nav-logout");
}

function check_login_status_and_update() {
  const token = getCookie("ganymede-token");

  setLoginStatus(token == "");
}
