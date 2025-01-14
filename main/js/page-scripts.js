let Contribution_Count = "-1";
let Active = false;
let Role = "Uninitialized";
let API_ROOT = "https://www.fsotables.com/api/";
// const cache = await caches.open('fso-local-database-copy');
let Current_Table = 0;
let Ui_Update_Needed = false;

let Updating_tables = false;
let Updating_table_items = false;
let Updating_parse_behaviors = false;
let Updating_restrictions = false;
let Updating_deprecations = false;
let Updating_table_aliases = false;
let Fetching_info_error = "";

// Regularly check for updates.
window.setInterval(check_for_update, 100);
function check_for_update() {
  if (Ui_Update_Needed && !Updating_tables && !Updating_table_items && !Updating_parse_behaviors && !Updating_restrictions && !Updating_deprecations && !Updating_table_aliases ){
    console.log("Updating UI");
    // UPDATE THE UI HERE!
    apply_table(Current_Table);
    Ui_Update_Needed = false;
  } 
}

// Run at the start of the page (called from the html) with our best guess at Architecture
function initPage(){
  console.log("Initializing Page... v0.8");

  console.log("Getting the mode cookie...")
  const modeCookie = getCookie("mode");
  console.log(`Found "${modeCookie}", continuing...`);

  if (modeCookie === "welcome" || modeCookie ==="about") {
    console.log("Setting welcome page...");
    setPageMode("welcome");
  } else if (modeCookie === "tables") {
    console.log("Setting tables page...");
    setPageMode("tables");
  } else if (modeCookie === "account") {
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
    console.log("Setting welcome page...");
    setPageMode("welcome");
  }

  console.log("Checking login status...");
  check_login_status_and_update();

  console.log("Resetting table display");
  apply_table(-1);

  console.log("Removing the pre-load cover as the UI initialization is finished.")
  toggleContents(false, "cover");

  console.log("Getting current Table");
  const tableIndexCookie = getCookie("table");
  console.log(`Found "${tableIndexCookie}"`);

  if (tableIndexCookie == undefined || tableIndexCookie === ""){
    setCookie("table", "0");
  }

  console.log("Getting Table Data");
  update_local_data();
  
  console.log("End of initialization function");
}

// Switch the download link contents on or off.
function toggleContents(enable, id)
{
  if (id === "" || !id){
    throw "EMPTY ID!!";
  }
  const element = document.getElementById(id);

  if (enable === true){
    element.style.display = '';
  } else if (enable === false){
    element.style.display = 'none';
  }
}

function enableItemViaClass(enable, id)
{
  if (id === "" || !id){
    throw "EMPTY ID!!";
  }

  const element = document.getElementById(id);

  if (enable === true){
    element.classList.remove(`disabled`);
  } else {
    element.classList.add(`disabled`);
  }
}

function changeContents(id, content)
{
  if (id === "" || !id){
    throw "EMPTY ID!!";
  }

  const element = document.getElementById(id);
  element.textContent = content;
}

function showWelcome()
{
  toggleContents(false, "account-text-area");
  toggleContents(false, "tables-text-area");
  toggleContents(true, "welcome-text-area");
  toggleContents(true, "welcome-text-area2");
  toggleContents(true, "welcome-text-area3")
}

function showAccount()
{
  toggleContents(false, "welcome-text-area");
  toggleContents(false, "welcome-text-area2");
  toggleContents(false, "welcome-text-area3");  
  toggleContents(false, "tables-text-area");
  toggleContents(true, "account-text-area");

  if (UpArrow) {
    switchArrow();

    let accordion = document.getElementById("passwordChangeAccordion");

    accordion.classList.remove("active");
    accordion.nextElementSibling.style.maxHeight = null;
  }

  get_user_details();
}

// This one will probably take some time.
function showTables()
{
  toggleContents(false, "welcome-text-area");
  toggleContents(false, "welcome-text-area2");
  toggleContents(false, "welcome-text-area3");  
  toggleContents(false, "account-text-area");
  toggleContents(true, "tables-text-area");
}

function setPageMode(mode){
  const validModes = ['welcome', 'tables', 'account', 'apihelp'];
  const mode_index = validModes.indexOf(mode);

  if ( mode_index < 0 ) { 
    console.log("Invalid mode set, setting to welcome.");
    showWelcome();
    return;
  }
  else if ( mode_index == 0 ) {
    showWelcome();
  } else if (mode_index == 1) {
    showTables();
  } else if (mode_index == 2) {
    showAccount();
  } else {
    //todo! show API options should be here, but that's not written yet
    showWelcome();
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
    toggleContents(false, "user-info-row");
    changeContents("account-role-text", " ");
    changeContents("contribution-count-text", " ");      

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

// this function and its fetch need to be awaited so that the other functions do not run until we get this information.
// Otherwise the response from this function will overwrite other table info.
async function get_table_data() {
  // TODO, make sure this gets into long term storage and can be pulled to avoid unneccessary API calls.

  Updating_tables = true;

  await fetch(API_ROOT + "tables", { 
    method: "GET" 
  })
  .then((response) => response.json())
  .then(responseJSON => {
    database_tables = responseJSON;
    enableItemViaClass(true, "tables-link");
    // Setting the table object items within the drowpdown that the tables page is going to have its own rendering function.
    Updating_tables = false;
  }).catch ( 
    error => {
      Fetching_info_error += error;
      Fetching_info_error += " ";
      Updating_tables = false;
    }
  );
}

function get_item_data() {
  Updating_table_items = true;  

  fetch(API_ROOT + "tables/items", { 
    method: "GET" 
  }).then((response) => response.json())
  .then(responseJSON => {    
    // TODO!  Sort the SQL output to save on computation?
    // Or again, implement outputting a specific table's items. 

    // TODO! You know what, we definitely have to sort the SQL output for tables at least.
    for (item in responseJSON){
      // make sure there's a matching table.
      if (database_tables[responseJSON[item].table_id - 1] == undefined) {
        console.log(`Orphaned table item: ${item}`);
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

    Updating_table_items = false;
  }).catch ( 
    error => {
      Updating_table_items = false;
      Fetching_info_error += error;
      Fetching_info_error += " ";
    }
  );
}

function get_table_aliases() {
  Updating_table_aliases = true;

  fetch(API_ROOT + "tables/aliases", { 
    method: "GET" 
  })
  .then((response) => response.json())
  .then(responseJSON => {
    database_aliases = responseJSON;

    Updating_table_aliases = false;
  }).catch ( 
    error => {
      Fetching_info_error += error;
      Fetching_info_error += " ";
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
      Fetching_info_error += error;
      Fetching_info_error += " ";
      Updating_parse_behaviors = false;
    }
  );
}

// TODO! Don't forget to rework restrictions on the database side so that it is text based!!
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
      Fetching_info_error.concat(error);
      Fetching_info_error.concat(" ");
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
      Fetching_info_error.concat(error);
      Fetching_info_error.concat(" ");
      Updating_deprecations = false;
    }
  );
}

function replace_text_contents(element_id, contents){
  try {
    let element = document.getElementById(element_id);
    element.textContent = contents;
  }
  catch{ console.log(`Trying to enter "${contents}" into "${element_id}" failed...` );}
}

function replace_inner_html(element_id, contents){
  try {
    let element = document.getElementById(element_id);
    element.innerHTML = contents;
  }
  catch{ console.log(`Trying to enter "${contents}" into "${element_id}" failed...` );}

}

// Put the current table into the UI
function apply_table(table) {
  console.log("Running Apply Table");

  // if there was an error, tell the user
  if (Fetching_info_error != ""){
    toggleContents(false, "tables-loader-main-anim");
    replace_text_contents("tables-loader-message", Fetching_info_error);
    Fetching_info_error = "";
    return;
  }

  // We'll start doing this during the polishing phase where we need to make sure the UI makes sense while things are fetched.
  if (table < 0 || table >= database_tables.length){

    toggleContents(true, "tables-loader-main");
    toggleContents(false, "table-info-area");

    try{  
      for (let i = 0 ; i < 301; i++){
        toggleContents(false, `item${i}`);
      }
    } catch {}

    return;
  }
  
  // at this point everything should be fine, so tell the user we're switching to rendering.
  toggleContents(false, "tables-loader-main");
  toggleContents(true, "table-info-area");

  Current_Table = table;

  replace_text_contents("table-title", database_tables[Current_Table].name);
  replace_text_contents("table-filename-content", database_tables[Current_Table].filename);
  replace_text_contents("table-modular-extension-content", database_tables[Current_Table].modular_extension);
  replace_text_contents("table-version-introduced-content", "");
  
  replace_text_contents("table-description-content", database_tables[Current_Table].description);

  replace_text_contents("table-aliases-content1", "");
  replace_text_contents("table-aliases-label", "");
  
  let parent_item = document.getElementById(``);
  let template_item = document.getElementById(``);

  for (let i = 0; i < database_tables[Current_Table].items.length; i++){
    let temporary_item = document.getElementById(`item${i}`);
    
    if (temporary_item === undefined){
      for (; i < database_tables[Current_Table].items.length; i++){
        let new_div = document.createElement("div"); 
        
        

        new_div.setAttribute("class","");
        element.appendChild();
      }

    }

    /*
    replace_inner_html(`item${i}`, `<div id="${i}a" class="row">
          <div id="${i}a-1" class="col-8">
            <h3><b>${database_tables[Current_Table].items[i].item_text}</b></h3><br>
          </div>
        </div>
        <div id="${i}a" class="row">
          <div id="${i}a-2" class="col-3">
            <h5>Minimum Version: &#9;<b>${database_tables[Current_Table].items[i].major_version}</b></h5>
          </div>
            <br>
          <div id="${i}a-3" class="col-3">
            <!--<h5>Deprecation Version: &#9;<b>24.130.0</b></h5>-->
          </div>
        </div>
        <br>
        <div id="${i}b" class="row">
          <div id="${i}b-1" class="col-3">
            <h5>Type: &#9;<b>${database_tables[Current_Table].items[i].info_type}</b></h5>
          </div>
          <br>
          <div id="${i}b-2" class="col-6">
            <!--<h5>Illegal Values: &#9;<b>&lt; 500</b></h5>-->
          </div>

        </div>
        <div id="${i}b" class="row">
          <div id="${i}b-1" class="col-3">
            <!--<h5>Aliases: &#9;<b>$Best-Option-Name:</b></h5>-->
          </div>
          <br>
          <div id="${i}b-2" class="col-6">
            <!--<h5>Alias Version: &#9;<b> 24.129.7</b></h5>-->
          </div>

        </div>        
        <div id="${i}c" class="row indented-row">
          <div class="col-9">
            <h4>
              <br>
              ${database_tables[Current_Table].items[i].documentation}
              <br>
              <br>
            </h4>
          </div>
        </div>`)

    toggleContents(true, `item${i}`);
*/
  }

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

const REGISTRATION_STATES = ["returningConfirmation", "chooseEmail", "choosePassword", "closing"];
let CurrentState = 1;

$(window).on('shown.bs.modal', onRegisterModalOpen);

function onRegisterModalOpen() {
  CurrentState = 1;

  clearRegistrationErrorText();
  awaitingRegistrationResponse(false);
  
  const passwordField = document.getElementById("registerPassword");
  const passwordField2 = document.getElementById("registerPasswordConfirm");
  const confirmationCodeField = document.getElementById("registerConfirmationCode");
  const checkbox = document.getElementById("registerPasswordToggleShowPassword");
  const bottomCotents = document.getElementById("registrationCheckBoxAndSubmitArea");

  // When the modal is reloaded, make sure to erase the password so that it's not 
  // some rando gaining access to the accidentally abandoned password
  passwordField.value = "";
  passwordField.type = "password";
  passwordField.required = false;
  passwordField2.value = "";
  passwordField2.type = "password";
  passwordField2.required = false;
  confirmationCodeField.value = "";
  confirmationCodeField.required = false;
  checkbox.checked = false;
  bottomCotents.style.justifyContent = `center`;


  toggleContents(true, "emailGroup");
  toggleContents(true, "registrationModalFooter");

  toggleContents(false, "confirmationCodeGroup");
  toggleContents(false, "passwordGroup");
  toggleContents(false, "passwordConfirmGroup");
  toggleContents(false, "registerPasswordToggleArea");

}

async function setRegistrationState(state){
  console.log(`setting registration state: ${state}!`);
  awaitingRegistrationResponse(true);
  let next_state = -1;
  let request = false;

  if (state === `nextRequest`){
    console.log("Path A");
    if (CurrentState === 0) {
      next_state = 2;
    } else if (CurrentState === 3) {
      next_state = 3;
    } else {
      next_state = CurrentState + 1;
    }
    
    request = true;
  } else {
    console.log("Path B");
    // no request sent here
    next_state = REGISTRATION_STATES.findIndex( (contents) => state === contents);
  }

  // something went wrong here, start over.
  if (next_state === -1){
    console.log("Registration error state, returning");
    CurrentState = 4;
    dismissRegistrationModal();
    awaitingRegistrationResponse(false);
    return;
  }

  console.log(`next state is ${next_state}`);
  // Now let's perform our request and state change
  if (next_state === 0){
    setModalUiChoosePassword();
    next_state = 2; // which really means that Current State will be 2
  } else if (next_state === 1) {
    setModalUiEmail();
  } else if (next_state === 2){

    if (request){

      const emailRegistrationResult = await sendNewEmailRegistration().catch({}); 
      if (emailRegistrationResult !== true){
        awaitingRegistrationResponse(false);
        return;
      }  
    }

    setModalUiChoosePassword();

  } else if (next_state === 3){

    if (request){

      const passwordResult = await sendNewPassword().catch({}); 
      if (passwordResult !== true){
        awaitingRegistrationResponse(false);
        return;
      }  
      
    }

    dismissRegistrationModal();
  } 

  awaitingRegistrationResponse(false);
  CurrentState = next_state;
}

function setModalUiEmail(){
  toggleContents(true, "emailGroup");
  toggleContents(true, "registrationModalFooter");
  toggleContents(true, "registrationModalFooter");

  toggleContents(false, "confirmationCodeGroup");
  toggleContents(false, "passwordGroup");
  toggleContents(false, "passwordConfirmGroup");
  toggleContents(false, "registerPasswordToggleArea");
  toggleContents(false, "registerPasswordToggleShowPassword");

  const bottomCotents = document.getElementById("registrationCheckBoxAndSubmitArea");
  const confirmationCodeField = document.getElementById("registerConfirmationCode");
  const passwordField = document.getElementById("registerPassword");
  const passwordField2 = document.getElementById("registerPasswordConfirm");

  bottomCotents.style.justifyContent = `center`;
  passwordField.required = false;
  passwordField2.required = false;
  confirmationCodeField.required = false;

}

function setModalUiChoosePassword(){
  toggleContents(true, "passwordGroup");
  toggleContents(true, "passwordConfirmGroup");
  toggleContents(true, "registerPasswordToggleArea");
  toggleContents(true, "emailGroup");
  toggleContents(true, "confirmationCodeGroup");
  toggleContents(true, "registerPasswordToggleShowPassword")

  toggleContents(false, "registrationModalFooter");

  const bottomCotents = document.getElementById("registrationCheckBoxAndSubmitArea");
  const passwordField = document.getElementById("registerPassword");
  const passwordField2 = document.getElementById("registerPasswordConfirm");
  const confirmationCodeField = document.getElementById("registerConfirmationCode");

  bottomCotents.style.justifyContent = `space-between`;
  passwordField.required = true;
  passwordField2.required = true;
  confirmationCodeField.required = true;
} 

// response to the checkbox being clicked
function togglePasswordRegister() {
  const passwordField = document.getElementById("registerPassword");
  const passwordField2 = document.getElementById("registerPasswordConfirm");
  const checkbox = document.getElementById("registerPasswordToggleShowPassword");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    checkbox.checked = true;
  } else {
    passwordField.type = "password";
    checkbox.checked = false;
  }

  if (passwordField2.type === "password") {
    passwordField2.type = "text";
    checkbox.checked = true;
  } else {
    passwordField2.type = "password";
    checkbox.checked = false;
  }
}

function awaitingRegistrationResponse(bool){
  toggleContents(bool, "registrationLoaderAnim");
  toggleContents(!bool, "registrationSumbitButton");
}


async function sendNewEmailRegistration(){

  const emailField = document.getElementById("registerEmail");

  const newEmailRegistrationRequest = {
    email: emailField.value,
  }

  const result = await fetch(API_ROOTB + "users/register", {
    method: "POST",
    body: JSON.stringify(newEmailRegistrationRequest)
  })
  .then((response) => { 
    if (response.status === 200) {      
      return true;
    } else {
      response.json().then(responseJSON => { 
        // if we didn't have a success then, there was an error from the server, and we should be displaying what it sent. 
        throw responseJSON.Error;}
      ).catch(
        error => { 
          console.log(`Registration request failed. The error encountered was: ${error}`);
          setRegistrationModalError(`${error}`);
          return false;
        }
      )
    }
  }).catch ( 
    error => { 
      console.log(`Registration request failed. The error encountered was: ${error}`);
      setRegistrationModalError("Registration request failed, Network or Website Error");
      return false;
    }
  );    

  return result;
}

async function sendNewPassword(){

  const confirmationCode = document.getElementById("registerConfirmationCode");
  const email = document.getElementById("registerEmail").value;
  const passwordField = document.getElementById("registerPassword");
  const passwordField2 = document.getElementById("registerPasswordConfirm");

  if (passwordField.value !== passwordField2.value){
    setRegistrationModalError("Passwords don't match");
    return false;
  }

  awaitingRegistrationResponse(true);

  const emailConfirmRequest = {
    code: confirmationCode.value,
  }

  const result = await fetch(API_ROOTB + `validation/${email}`, {
    method: "POST",
    body: JSON.stringify(emailConfirmRequest),
    headers: { "password" : passwordField.value,
    },

  })
  .then((response) => { 
    if (response.status === 200) {
      setCookie("username", email);
      return true;
    } else {
      response.json().then(responseJSON => { 
        // if we didn't have a success then, there was an error from the server, and we should be displaying what it sent. 
        throw responseJSON.Error;}
      ).catch(
        error => { 
          console.log(`Registration request failed. The error encountered was: ${error}`);
          setRegistrationModalError(`${error}`);
          return false;
        }
      )
    }
  }).catch ( 
    error => { 
      console.log(`Registration request failed. The error encountered was: ${error}`);
      setRegistrationModalError("Registration request failed, Network or Website Error");
      return false;
    }
  );

  return result;
}

function dismissRegistrationModal(){
  $('#registerModal').modal("hide");
}

function setRegistrationModalError(errorText){
  changeContents("registrationErrorText", errorText);
  toggleContents(true, "registrationErrorMessageArea");
}

function clearRegistrationErrorText(){
  toggleContents(false, "registrationErrorMessageArea"); 
  changeContents("registrationErrorText", " ");
}

let UpArrow = false;

function switchArrow(){
  UpArrow = !UpArrow;
  toggleContents(UpArrow, "passwordChangeArrow1");
  toggleContents(!UpArrow, "passwordChangeArrow2");  
}