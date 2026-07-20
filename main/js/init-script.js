  const event = new Event("search_function");

// Run at the start of the page (called from the html)
async function initPage(){
  // Pre-load check for correct domain to avoid login and security issues
  if (!window.location.href.startsWith("https://www.fsotables.com")){
    let replacement = "https://www.fsotables.com";

    let post_strings = window.location.href.split("#");

    for (let i = 1; i < post_strings.length; i++){
      replacement += post_strings[i];
    }

    window.location.replace(replacement);
  }

  console.log("Initializing Page... v0.9");
  Previous_URL = window.location.href;


  console.log("Getting the mode cookie...");
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

  console.log("Adjusting Floating Link Holder")
  adjustFloater();

  console.log("Adding Floater Links")
  populate_floater_links();

  console.log("Removing the pre-load cover as the UI initialization is finished.")
  toggleContents(false, "cover");

  console.log("Getting Table Data");
  update_all_local_data();

  console.log("Applying previous table or table from url");
  if (!check_url()){
    const tableIndexCookie = getCookie("table");
    if (tableIndexCookie == undefined || tableIndexCookie === ""){
      setCookie("table", "0");
    }
  }

  console.log("Initializing Search");
  init_search();  
  
  console.log("End of initialization function");
}


