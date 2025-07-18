let Contribution_Count = "-1";
let Active = false;
let Role = "Uninitialized";
let API_ROOT = "https://www.fsotables.com/api/";
// const cache = await caches.open('fso-local-database-copy');
let Current_Table = 0;
let Ui_Update_Needed = false;

let Updating_table_array = false;
let Updating_table_item_array = false;
let Updating_parse_behavior_array = false;
let Updating_restrictions_array = false;
let Updating_deprecations_array = false;
let Updating_table_aliases_array = false;
let Fetching_info_error = "";

// Regularly check for updates.
window.setInterval(check_for_update, 100);
async function check_for_update() {
  if (Ui_Update_Needed && !Updating_table_array && !Updating_table_item_array && !Updating_parse_behavior_array && !Updating_restrictions_array && !Updating_deprecations_array && !Updating_table_aliases_array ){
    Ui_Update_Needed = false;
    console.log("Updating UI");
    apply_table(Current_Table).catch(error => { console.log("Apply Table has failed.");});
  } 
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

  Updating_table_array = true;

  await fetch(API_ROOT + "tables", { 
    method: "GET" 
  })
  .then((response) => response.json())
  .then(responseJSON => {
    database_tables = responseJSON;
    enableItemViaClass(true, "tables-link");
    // Setting the table object items within the drowpdown that the tables page is going to have its own rendering function.
    Updating_table_array = false;
  }).catch ( 
    error => {
      Fetching_info_error += error;
      Fetching_info_error += " ";
      Updating_table_array = false;
    }
  );
}

function get_item_data() {
  Updating_table_item_array = true;  

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

    Updating_table_item_array = false;
  }).catch ( 
    error => {
      Updating_table_item_array = false;
      Fetching_info_error += error;
      Fetching_info_error += " ";
    }
  );
}

function get_table_aliases() {
  Updating_table_aliases_array = true;

  fetch(API_ROOT + "tables/aliases", { 
    method: "GET" 
  })
  .then((response) => response.json())
  .then(responseJSON => {
    database_aliases = responseJSON;

    Updating_table_aliases_array = false;
  }).catch ( 
    error => {
      Fetching_info_error += error;
      Fetching_info_error += " ";
      Updating_table_aliases_array = false;
    }
  );
}

function get_parse_behaviors() {  
  Updating_parse_behavior_array = true;

  fetch(API_ROOT + "tables/parse-types", { 
    method: "GET" 
  })
  .then((response) => response.json())
  .then(responseJSON => {
    database_parse_behaviors = responseJSON;

    Updating_parse_behavior_array = false;
  }).catch ( 
    error => {
      Fetching_info_error += error;
      Fetching_info_error += " ";
      Updating_parse_behavior_array = false;
    }
  );
}

// TODO! Don't forget to rework restrictions on the database side so that it is text based!!
function get_restrictions() {
  Updating_restrictions_array = true;

  fetch(API_ROOT + "tables/restrictions", { 
    method: "GET" 
  })
  .then((response) => response.json())
  .then(responseJSON => {
    database_restrictions = responseJSON;

    Updating_restrictions_array = false;
  }).catch ( 
    error => {
      Fetching_info_error.concat(error);
      Fetching_info_error.concat(" ");
      Updating_restrictions_array = false;
    }
  );
}

function get_deprecations() {
  Updating_deprecations_array = true;

  fetch(API_ROOT + "tables/deprecations", { 
    method: "GET" 
  })
  .then((response) => response.json())
  .then(responseJSON => {
    database_deprecations = responseJSON;

    Updating_deprecations_array = false;
  }).catch ( 
    error => {
      Fetching_info_error.concat(error);
      Fetching_info_error.concat(" ");
      Updating_deprecations_array = false;
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
async function apply_table(table) {
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
      for (let i = 0 ; i < 200; i++){
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
  
  let parent_item = document.getElementById(`table-info-supercontainer`);
  let template_item = document.getElementById(`dataRowTemplate`);
  let i = 0;

  if (database_tables[Current_Table].items){
    for (i = 0; i < database_tables[Current_Table].items.length; i++){
      let temporary_item = document.getElementById(`item${i}`);
      let data_item = database_tables[Current_Table].items[i];
      let new_copy = false;
  
      if (!temporary_item){
        temporary_item = template_item.content.cloneNode(true);
        new_copy = true;
      } else {
        temporary_item.style.display = "";
      }
          // We need to cover these        
          // template-item-name       
          // template-major-version         
          // template-deprecation-version    deprecation-area
          // template-variable-type
          // template-illegal-values        template-illegal-values-area
          // template-alias-name            template-alias-area
          // template-alias-version
          // template-description
  
           // Clone the new row and insert it into the table
  
      let child = temporary_item.querySelector(".data-item");
      if (child) { 
        child.setAttribute("id", `item${i}`);
        child.setAttribute("data-item-id", `${data_item.item_id}`);
      }

      // Form
      child = temporary_item.querySelector(".edit-item-form");
      if (child) { 
        child.setAttribute("id", `item${i}-form`);
        child.setAttribute("onsubmit", `submitItemChanges(${i}); false;`);
      }

      
      // Edit Button
      child = temporary_item.querySelector(".edit-button");
      if (child) {
        child.setAttribute("id", `item${i}-edit-button`);
        child.setAttribute("onclick", `initiateItemEdit(${i}); return false;`);
      }

      // Item Name
      child = temporary_item.querySelector(".template-item-area")
      if (child) {
        child.setAttribute("id", `item${i}-item-text-area`);
      }

      child = temporary_item.querySelector(".template-item-name");
      if (child) { 
        child.textContent = data_item.item_text;
        child.setAttribute("id", `item${i}-item-text`);
      }
  
      if (new_copy){

        child = temporary_item.querySelector(".item-edit-name-group");
        if (child) {
          child.setAttribute("id", `item${i}-edit-name-group`);
        }

        child = temporary_item.querySelector(".item-edit-name");
        if (child) {
          child.setAttribute("id", `item${i}-edit-name`);
        }
      }

      // Initial Version
      if (new_copy){
        child = temporary_item.querySelector(".major-version-area");
        if (child){
          child.setAttribute("id", `item${i}-major-version-area`)
        }
      }

      child = temporary_item.querySelector(".template-major-version");
      if (child) { 
        child.textContent = data_item.major_version;

        if (new_copy){
          child.setAttribute("id", `item${i}-major-version`);
        }
      }        
  
      if (new_copy){

        child = temporary_item.querySelector(".item-edit-major-version-group");
        if (child) {
          child.setAttribute("id", `item${i}-edit-major-version-group`);
        }

        child = temporary_item.querySelector(".item-edit-major-version");
        if (child) {
          child.setAttribute("id", `item${i}-edit-major-version`);
        }
      }


      // TODO! Make sure that the info has deprecations in the future
      // Deprecations
      child = temporary_item.querySelector(".template-deprecation-area");
      if (child) { 
        child.style.display = "none";
        child.setAttribute("id", `item${i}-deprecation-area`);        
      }        
  
      // TODO! Need to make sure that we are not editing any entries when tables are switched
      if (new_copy){

        child = temporary_item.querySelector(".item-edit-deprecation-group");
        if (child) {
          child.setAttribute("id", `item${i}-edit-deprecation-group`);
        }

        child = temporary_item.querySelector(".item-edit-deprecation");
        if (child) {
          child.setAttribute("id", `item${i}-edit-deprecation`);
        }
      }


      // TODO! Clean user facing version of this, probably during processing
      // Type

      child = temporary_item.querySelector(".template-variable-type");
      if (child) { 
        child.textContent = data_item.info_type;
        if (new_copy){
          child.setAttribute("id", `item${i}-variable-type`);             
        }
      }        

      if (new_copy){
        child = temporary_item.querySelector(".template-type-area");
        if (child) {
          child.setAttribute("id", `item${i}-type-area`)
        }

        child = temporary_item.querySelector(".item-edit-variable-type-group");
        if (child) {
          child.setAttribute("id", `item${i}-edit-variable-type-group`);
        }

        child = temporary_item.querySelector(".item-edit-variable-type");
        if (child) {
          child.setAttribute("id", `item${i}-edit-variable-type`);
        }
      }

      // Illegal Values
      child = temporary_item.querySelector(".template-illegal-values-area");
      if (child) { 
        child.style.display = "none";
        child.setAttribute("id", `item${i}-illegal-values-area`);
      }
      
      if (new_copy){
        child = temporary_item.querySelector(".item-edit-illegal-values-group");
        if (child) {
          child.setAttribute("id", `item${i}-edit-illegal-values-group`);
        }

        child = temporary_item.querySelector(".item-edit-illegal-values");
        if (child) {
          child.setAttribute("id", `item${i}-edit-illegal-values`);
        }
      }

      // Alias
      child = temporary_item.querySelector(".template-alias-area");
      if (child) { 
        child.style.display = "none";
        child.setAttribute("id", `item${i}-alias-area`);
      }        
      
      // TODO! Alias does not have an edit section, and we probably need to do more for it anyway.

      // Description
      child = temporary_item.querySelector(".template-description");
      if (child) { 
        child.textContent = data_item.documentation;
        child.setAttribute("id", `item${i}-documentation`);      
      }

      if (new_copy){
        child = temporary_item.querySelector(".item-edit-description-area");
        if (child) {
          child.setAttribute("id", `item${i}-edit-description-area`);
        }

        child = temporary_item.querySelector(".item-edit-description");
        if (child) {
          child.setAttribute("id", `item${i}-edit-description`);
        }
      }

      // save button
      if (new_copy){

        child = temporary_item.querySelector("save-item-button");
        if (child) {
          // child.style.display = none;
          child.setAttribute("onclick", `saveItemEditChanges(${i})`);
          child.setAttribute("id", `item${i}-save-button`);
        }
      }

      if (new_copy){
        parent_item.appendChild(temporary_item);
      }
    }
  }

  for(; i < 2000 ; i++){
    let theoretical_item = document.getElementById(`item${i}`);
    if (theoretical_item){
      theoretical_item.style.display = "none";
    } else {
      break;
    }
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

  const result = await fetch(API_ROOT + "users/register", {
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

  const result = await fetch(API_ROOT + `validation/${email}`, {
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


function testNewItemModal(){
 $('#addItemModal').modal("show"); 
}
