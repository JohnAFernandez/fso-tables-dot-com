  const event = new Event("search_function");

// Run at the start of the page (called from the html)
function initPage(){
  console.log("Initializing Page... v0.9");

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

function check_url(){
  let url = window.location.href;
  let index = url.indexOf("#");
  
  if (!(index > 1)){
    return false;
  } 
  
  let url2 = url.substring(index + 1);
  let index2 = url2.indexOf(":");

  if (!(index2 > 1)){
    window.location.href = url.substring(0, index + 1) + "could-not-find-table";
    return false;
  }

  let table = url2.replace("-", " ").replace("_", " ").substring(0, index2);
  let i = 0;

  for (i = 0; i < database_tables.length; i++){
    if (database_tables[i].name.replace(" Table", "").toLowerCase() === table){
      setCookie("table", "0");
      break;
    }
  }

  if (i === database_tables.length){
    window.location.href = url.substring(0, index + 1) + "could-not-find-table";
    return false;
  }

  apply_table(i);

  try { 
    let item = url2.substring(index2 + 1).replace("-"," ").replace("_", " ").toLowerCase(); 

    for (let j = 0; j < database_tables[i].items.length; j++){
      if (database_tables[i].items[j].item_text.toLowerCase() === item){
        let k = 0;
        do {
          let element = document.getElementById(`item${k}`);
          
          if (!element || !database_tables[i].items[j]){
            break;
          } 
          
          k++;
          if (database_tables[i].items[j].item_id == element.getAttribute('data-item-id')){
            y = element.getBoundingClientRect().top + window.scrollY;
              window.scroll({
              top: y - 50,
              behavior: 'smooth'});      
              
            return true;
          }
        } while (true)
      }
    }
  } catch { 
    window.location.href = url + "/"+ table + ":item-not-found";
    return true;
  }
}
