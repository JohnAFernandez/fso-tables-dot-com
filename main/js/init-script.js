  const event = new Event("search_function");

    let Out_string = "Initializing Page... v0.9";


// Run at the start of the page (called from the html)
async function initPage(){
  // Pre-load check for correct domain to avoid login and security issues
  if (!window.location.href.startsWith("https://www.fsotables.com")){
    let replacement = "https://www.fsotables.com";

    let post_strings = window.location.href.split("#");

    for (let i = 1; i < post_strings.length; i++){
      replacement += "#"
      replacement += post_strings[i];
    }

    window.location.replace(replacement);
  }

  Previous_URL = window.location.href;


  Out_string += "Getting the mode cookie...";
  const modeCookie = getCookie("mode");
  Out_string += `Found "${modeCookie}", continuing...`;

  if (modeCookie === "welcome" || modeCookie ==="about") {
    Out_string += "Setting welcome page...";
    setPageMode("welcome");
  } else if (modeCookie === "tables") {
    Out_string += "Setting tables page...";
    setPageMode("tables");
  } else if (modeCookie === "account") {
    Out_string += "Setting account page...";

    const username = getCookie("username");

    // the internal check to send back to the welcome page can't differentiate between intended failure
    // and unintended failure, so divert here.
    if (username == ""){
      setPageMode("welcome");
    } else {
      setPageMode("account");
    }
  } else {
    Out_string += "Setting welcome page...";
    setPageMode("welcome");
  }

  Out_string += "Checking login status...";
  check_login_status_and_update();

  Out_string += "Resetting table display";
  apply_table(-1);

  Out_string += "Adjusting Floating Link Holder";
  adjustFloater();

  Out_string += "Adding Floater Links";
  populate_floater_links();

  Out_string += "Removing the pre-load cover as the UI initialization is finished.";
  toggleContents(false, "cover");

  Out_string += "Getting Table Data";
  update_all_local_data();

  Out_string += "Applying previous table or table from url";
  if (!check_url()){
    const tableIndexCookie = getCookie("table");
    if (tableIndexCookie == undefined || tableIndexCookie === ""){
      setCookie("table", "0");
    }
  }

  Out_string += "Initializing Search...";
  init_search();  
  
  Out_string += "Initialization complete";
}


