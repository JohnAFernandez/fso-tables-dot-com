let Contribution_Count = "-1";
let Active = false;
let Role = "Uninitialized";
let API_ROOT = "https://www.fsotables.com/api/";
// const cache = await caches.open('fso-local-database-copy');
let Ui_Update_Needed = false;

let Updating_tables = false;
let Updating_table_items = false;
let Updating_parse_behaviors = false;
let Updating_restrictions = false;
let Updating_deprecations = false;
let Updating_table_aliases = false;


window.setInterval(check_for_update, 10000);

function check_for_update() {
  if (Ui_Update_Needed && !Updating_tables && !Updating_table_items && !Updating_parse_behaviors && !Updating_restrictions && !Updating_deprecations && !Updating_table_aliases ){
    console.log("Running Check for UI Update, update needed")
  } else {
    console.log("Running Check for UI Update, No update needed");
  }
}

// Run at the start of the page (called from the html) with our best guess at Architecture
function initPage(){
  console.log("Initializing Page... v0.4");

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

    const username = getCookie("username");

    // the internal check to send back to the welcome page can't differentiate between intended failure
    // and unintended failure, so divert here.
    if (username == ""){
      setPageMode("welcome");
    } else {
      setPageMode("account");
    }
  } else {
    console.log("Setting about page...");
    setPageMode("about");
  }

  console.log("Checking login status...");
  check_login_status_and_update();

  console.log("Removing the pre-load cover as the UI initialization is finished.")
  toggleContents(false, "cover");

  console.log("Getting Table Data");
  get_table_data();

  console.log("End of initialization function");
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

function enableItemViaClass(enable, id)
{
  const element = document.getElementById(id);

  if (enable === true){
    element.classList.remove(`disabled`);
  } else {
    element.classList.add(`disabled`);
  }
}

function changeContents(id, content)
{
  const element = document.getElementById(id);
  element.textContent = content;
}

function showWelcome()
{
  toggleContents(false, "about-text-area")
  toggleContents(false, "account-text-area")
  toggleContents(false, "tables-text-area")
  toggleContents(true, "welcome-text-area");
}

function showAbout()
{
  toggleContents(false, "welcome-text-area");
  toggleContents(false, "account-text-area")
  toggleContents(false, "tables-text-area")
  toggleContents(true, "about-text-area")
}

function showAccount()
{
  toggleContents(false, "welcome-text-area");
  toggleContents(false, "about-text-area")
  toggleContents(false, "tables-text-area")
  toggleContents(true, "account-text-area")
  get_user_details();
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
  const token = getCookie("username");

  setLoginStatus(token == "");
}

function get_user_details() {
  // set it to loading...
  toggleContents(true, "account-loader");
  toggleContents(false, "user-info-row");
  toggleContents(false, "username-row");

  const username = getCookie("username");

  if (username == "") {
    alert("You are not logged in, returning to the home page.");
    setPageMode("welcome");
    return;
  }
  
  // fetch retrieves username, role, contribution_count, and active, for some reason.  Any login process should reactivate an account. (or at least it should when everything is as it should be) 
  fetch(API_ROOT + "users/myaccount", { 
    method: "GET", 
    headers: { "username" : username,
    },
    credentials: 'include'
  })
  .then((response) => response.json())
  .then(responseJSON => {
    // Check that we have expected output.... 
    if (responseJSON.username != undefined){

      Contribution_Count = `${responseJSON.contribution_count}`;
      
      switch (responseJSON.role){
        case 0: {
          Role = "Owner";
          break;
        }
        case 1: {
          Role = "Administrator";
          break;
        }
        case 2: {
          Role = "Maintainer";
          break;
        }
        case 3: 
          Role = "Viewer";
          break;
        default:
          Role = "[Bad Data]";
          break;
      }
      
      if (responseJSON.active === 1) {
        Active = true;
      } else {
        Active = false;
      } 

    } else {
      throw responseJSON.Error;
    }

      update_myaccount_items(false);
    })
  .catch ( 
    error => {
      console.log(`Fetching user details failed. The error encountered was: ${error}`);
      update_myaccount_items(true);
    }
  );
}

function update_myaccount_items(error_present) {
  if (error_present) {
    changeContents("account-name-text", "Unknown Error, Cannot Update");
    toggleContents(false, "account-loader");
    toggleContents(true, "username-row");
    changeContents("account-role-text", "");
    changeContents("contribution-count-text", "");      

    return;
  }

  let ourCookie = getCookie("username");

  changeContents("account-name-text", ourCookie);
  changeContents("account-role-text", Role);
  changeContents("contribution-count-text", Contribution_Count);
  toggleContents(false, "account-loader");
  toggleContents(true, "user-info-row");
  toggleContents(true, "username-row");

  return;
}


// Table Item Handling Code 
let database_tables = [];
let database_aliases = [];
let database_parse_behaviors = [];
let database_restrictions = [];
let database_deprecations = [];

// make the function this way so that we can update everything at once, but also update with individual functions later 
function update_local_data() {
  Ui_Update_Needed = true;
  
  get_table_data().then(() => {
      get_item_data();
      get_table_aliases();
      get_parse_behaviors();
      get_restrictions();
      get_deprecations();
    });
}

function get_table_data() {
  // TODO, make sure this gets into long term storage and can be pulled to avoid unneccessary API calls.

  Updating_tables = true;

  fetch(API_ROOT + "tables", { 
    method: "GET" 
  })
  .then((response) => response.json())
  .then(responseJSON => {
    database_tables = responseJSON;
    enableItemViaClass(true, "tables-link");
    // Setting the table object items within the drowpdown that the tables page is going to have its own rendering function.

  }).catch ( 
    error => {
      console.log(`Fetching table data failed. The error encountered was: ${error}`);
      alert("Fetch of table file info failed.");
    }
  );
}

function get_item_data() {
  Updating_table_items = true;  

  fetch(API_ROOT + "tables/items", { 
    method: "GET" 
  }).then((response) => response.json())
  .then(responseJSON => {
    console.log(responseJSON);
    
    // TODO!  Sort the SQL output to save on computation?
    // Or again, implement outputting a specific table's items. 

    // TODO! You know what, we definitely have to sort the SQL output for tables at least.
    for (item in responseJSON){
      // make sure there's a matching table.
      if (database_tables[responseJSON[item].table_id - 1] == undefined) {
        console.log(`Could not find matching table for item ${item}`);
        continue;
      }

      if (database_tables[responseJSON[item].table_id - 1].items == undefined) {
        database_tables[responseJSON[item].table_id - 1].items = [];
      }

      let found = false;
      for (stored_item in database_tables[responseJSON[item].table_id  - 1].items){
        if (database_tables[responseJSON[item].table_id  - 1].items[stored_item].item_id == responseJSON[item].item_id){
          database_tables[responseJSON[item].table_id - 1].items[stored_item] = responseJSON[item];
          found = true;
          break;
        } 
      }

      if (!found){
        database_tables[responseJSON[item].table_id  - 1].items.push(responseJSON[item]);
      }
    }
    console.log(`Table Items Fetched`);

  }).catch ( 
    error => {
      console.log(`Fetching table item data failed. The error encountered was: ${error}`);
    }
  );
}

function get_table_aliases() {
  let Updating_table_aliases = true;

  fetch(API_ROOT + "tables/aliases", { 
    method: "GET" 
  })
  .then((response) => response.json())
  .then(responseJSON => {
    database_aliases = responseJSON;

    Updating_table_aliases = false;
  }).catch ( 
    error => {
      console.log(`Fetching table aliases failed. The error encountered was: ${error}`);
      Updating_table_aliases = false;
    }
  );
}

function get_parse_behaviors() {  
  Updating_parse_behaviors = true;

  fetch(API_ROOT + "tables/parse-types", { 
    method: "GET" 
  })
  .then((response) => response.json())
  .then(responseJSON => {
    database_parse_behaviors = responseJSON;

    Updating_parse_behaviors = false;
  }).catch ( 
    error => {
      console.log(`Fetching restrictions failed. The error encountered was: ${error}`);
      Updating_parse_behaviors = false;
    }
  );
}

function get_restrictions() {
  Updating_restrictions = true;

  fetch(API_ROOT + "tables/restrictions", { 
    method: "GET" 
  })
  .then((response) => response.json())
  .then(responseJSON => {
    database_restrictions = responseJSON;

    Updating_restrictions = false;
  }).catch ( 
    error => {
      console.log(`Fetching restrictions failed. The error encountered was: ${error}`);
      Updating_restrictions = false;
    }
  );
}

function get_deprecations() {
  Updating_deprecations = true;

  fetch(API_ROOT + "tables/deprecations", { 
    method: "GET" 
  })
  .then((response) => response.json())
  .then(responseJSON => {
    database_deprecations = responseJSON;

    Updating_deprecations = false;
  }).catch ( 
    error => {
      console.log(`Fetching restrictions failed. The error encountered was: ${error}`);
      Updating_deprecations = false;
    }
  );
}

// Put the current table into the UI
function apply_table(table) {

}

function populate_table_item(item, location){

}



/* For Later.  We can use this to cache our result.  Also there are alternatives.


const request = indexedDB.open("fso_local_copy");
let db;

request.onupgradeneeded = function() {
  // The database did not previously exist, so create object stores and indexes.
  const db = request.result;
  const store = db.createObjectStore("tables", {keyPath: "tables"});

  // Populate with initial data.
  store.put({title: "Quarry Memories", author: "Fred", isbn: 123456});
  store.put({title: "Water Buffaloes", author: "Fred", isbn: 234567});
  store.put({title: "Bedrock Nights", author: "Barney", isbn: 345678});

  full_update = true;
};

request.onsuccess = function() {
  db = request.result;
};
*/
