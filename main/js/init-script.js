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
  
    console.log("Adjusting Floating Link Holder")
    adjustFloater();
  
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