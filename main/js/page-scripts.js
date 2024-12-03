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

function setPageMode(mode){
  const validModes = ['welcome', 'about', 'tables', 'account'];
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

  setCookie("mode", validModes[mode_index], 24*365*10);
  const bob = getCookieDetails("mode");
  console.log(bob);
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

// NOT FULLY TESTED ON LONG COOKIES.  The assumption is that cookies will have 6 usable fields.
function getCookieDetails(cookieName) {
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');

  console.log(ca);

  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];

    // This is the edited block.  Instead of substringing every time an empty character is found,
    // do the correct substring from the first *non* space character.
    for (let j = 0; j < c.length; j++){
      if (c.charAt(j) != ' ') {
        // and only if we're not at the first character
        if (j > 0){
          c = c.substring(j);
        }
        break;
      }
    }

    if (c.indexOf(name) == 0) {
      if (ca.length > i + 5){
        return ca.slice(i, i+5);
      } else {
        return ca.slice(i);
      }
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

  console.log(`${name}=${value};SameSite=strict;expires=${d.toUTCString()};Secure`);
  document.cookie = `${name}=${value};SameSite=strict;expires=${d.toUTCString()};Secure`;
}

// status should be a bool with true value meaning not logged in
function setLoginStatus(status) {
/*  toggleContents(status, "LOGIN-LINK");
  toggleContents(status, "RESGISTER-LINK");
  toggleContents(!status, "MY-ACCOUNT");
  toggleContents(!status, "LOG-OUT");*/
  console.log("Set login status not yet ready.");
}

function check_login_status_and_update() {
  const token = getCookie("ganymede-token");

  setLoginStatus(token == "");
}
