let search_targets = [];
let foundItemsSet = []; // for "quick" culling of known objects
let searchResultRowCount = 0;

let result_template = {
  table_index : -1,
  item_index : -1,
  matchText : ""
}

// Async signals
let cancelSearchSignal = false;

async function newSearch (){
  let search_bar = document.getElementById(`search_bar`);
  let text = search_bar.value;
//  ShowNoResultsInProgress = false;

  // tell everything else to cancel
  cancelSearchSignal = true;

  if (text.length > 0){
    end_search(true);
  } else {
    if (SearchUpArrow !== true){
      expand_contract_search_results();
    }
    end_search(false);
    return;
  }

  if (SearchUpArrow === true){
    await expand_contract_search_results();
  }

  // wait for them to receive the signal
  await new Promise((resolve) => setTimeout(resolve, 5));
  
  // clear out global
  search_targets = [];
  foundItemsSet = [];
  
  cancelSearchSignal = false;

  toggleContents(true, "search-link-area");

  searchForText(text);

}

// not indexes plug into local copies, ids would be inefficient
async function addFoundItem(table_index, item_index, id, text){
  foundItemsSet[foundItemsSet.length] = id;

  let new_target = {
    table_index : table_index,
    item_index : item_index,
    matchText : text
  };
  
  search_targets[search_targets.length] = new_target;

  update_search_results_ui();
}

async function searchForText (text){
  if (text === undefined || typeof text != "string" || database_tables === undefined){
    return;
  }
  
  text = text.toLowerCase();

  for (let i = 0; i < database_tables.length; i++) {
    if (database_tables[i].items === undefined){
      continue;
    }
  
    for (let j = 0; j < database_tables[i].items.length; j++){
      if (foundItemsSet.includes(database_tables[i].items[j].item_id)){
        continue;
      }

      if (database_tables[i].items[j].item_text.toLowerCase().startsWith(text)){
        // j + 1 because database is 1 indexed for some reason
        addFoundItem(i, j + 1, database_tables[i].items[j].item_id, `${database_tables[i].name.replace(" Table", "")}-> ${database_tables[i].items[j].item_text}`);
      }

      if (cancelSearchSignal === true){
        return;
      }
    }
  }

  for (let i = 0; i < database_tables.length; i++) {
    if (database_tables[i].items === undefined){
      continue;
    }
    
    for (let j = 0; j < database_tables[i].items.length; j++){
      if (foundItemsSet.includes(database_tables[i].items[j].item_id)){
        continue;
      }

      if (database_tables[i].items[j].item_text.toLowerCase().includes(text)){
        addFoundItem(i, j + 1, database_tables[i].items[j].item_id, `${database_tables[i].name.replace(" Table", "")}-> ${database_tables[i].items[j].item_text}`);
      }

      if (cancelSearchSignal === true){
        return;
      }
    }
  }

  for (let i = 0; i < database_tables.length; i++) {
    if (database_tables[i].items === undefined){
      continue;
    }
    
    for (let j = 0; j < database_tables[i].items.length; j++){
      if (foundItemsSet.includes(database_tables[i].items[j].item_id)){
        continue;
      }
      
      if (database_tables[i].items[j].documentation.toLowerCase().startsWith(text)){
        addFoundItem(i, j + 1, database_tables[i].items[j].item_id, `In documentation for ${database_tables[i].name.replace(" Table", "")}-> ${database_tables[i].items[j].item_text}`);
      }

      if (cancelSearchSignal === true){
        return;
      }
    }
  }

  for (let i = 0; i < database_tables.length; i++) {
    if (database_tables[i].items === undefined){
      continue;
    }
    
    for (let j = 0; j < database_tables[i].items.length; j++){
      if (foundItemsSet.includes(database_tables[i].items[j].item_id)){
        continue;
      }

      if (database_tables[i].items[j].documentation.toLowerCase().includes(text)){
        addFoundItem(i, j + 1, database_tables[i].items[j].item_id, `In documentation for ${database_tables[i].name.replace(" Table", "")}-> ${database_tables[i].items[j].item_text}`);
      }

      if (cancelSearchSignal === true){
        return;
      }
    }
  }

  if (search_targets.length < 1){
    update_search_results_ui();
  }
}


async function update_search_results_ui(){
  if (search_targets === undefined) {
    toggleContents(false, `search-link-area`);
    return;
  }

  if (search_targets.length < 1){
    end_search(false);
    await show_no_results();
    return;
  }

  let i = 0;
  for (; i < search_targets.length; i++){
    let element = document.getElementById(`search-result-${i}`);
    if (element === null){
      do {
        append_search_row();
        element = document.getElementById(`search-result-${i}`);
      } while (element === null)
    }
    toggleContents(true, `search-result-${i}`);
    changeContents(`search-item-${i}`, search_targets[i].matchText);
  }

  for (; i < searchResultRowCount; i++){
    toggleContents(false, `search-result-${i}`);
  }

//  element.style.zIndex = 1021; // Any smaller will not work.
//  element.style.x = document.getElementById("floating-link-container").style.x - 100;
  // 951 - 793  = 158
}

// this is UI side, only
function end_search(restarting){
// This causes flickering
  /*  let i = 0;
  let element1 = document.getElementById(`search-item-0`);
  
  if (element1 === null){
    return;
  }

  while (element1 !== null){
    element1.textContent = "...";
    toggleContents(false, `search-result-${i}`);
    i++;
    element1 = document.getElementById(`search-item-${i}`);
  }
*/
  if (!restarting){
    toggleContents(false, `search-link-area`);
  }
}

function init_search(){
  end_search(false);
  let search_bar = document.getElementById(`search_bar`);
  search_bar.value = "";
  search_bar.setAttribute("oninput", "newSearch();")
  append_search_row();
  toggleContents(false, `search-link-area`);
}

function append_search_row(){
  let parent_item = document.getElementById(`search-link-container`);
  let temporary_item = document.getElementById(`searchResultRowTemplate`).content.cloneNode(true);

  let child = temporary_item.querySelector(".search-target-row");

  if (child !== null){
    child.setAttribute("id", `search-result-${searchResultRowCount}`)
  }

  child = temporary_item.querySelector(".search-target-link");

  if (child !== null){
    child.setAttribute("onclick", `goToSearchResult(${searchResultRowCount})`);
    child.setAttribute("id", `search-item-${searchResultRowCount}`)
  }

  parent_item.appendChild(temporary_item);
  searchResultRowCount += 1;
}


let SearchUpArrow = true;
//let ShowNoResultsInProgress = false;

async function expand_contract_search_results(){
  if (document.getElementById(`search_bar`).value.length < 1 && SearchUpArrow){
    return;
  }

  SearchUpArrow = !SearchUpArrow;
  toggleContents(!SearchUpArrow, "searchChangeArrow1");
  toggleContents(SearchUpArrow, "searchChangeArrow2");  
  toggleContents(!SearchUpArrow, "search-link-area");

  if (!SearchUpArrow && search_targets.length < 1){
    await show_no_results();
  }
}

async function show_no_results(){
  toggleContents(true, `search-link-area`);
  toggleContents(true, `search-result-0`);
  let element = document.getElementById(`search-item-0`);
  element.textContent = "No Results...";

  let i = 1;
  let element1 = document.getElementById(`search-item-1`);
  
  if (element1 === null){
    return;
  }

  while (element1 !== null){
    element1.textContent = "...";
    toggleContents(false, `search-result-${i}`);
    i++;
    element1 = document.getElementById(`search-item-${i}`);
  }

// This ended up causing more trouble than it was worth.  Let the user decide what to do!
  //  ShowNoResultsInProgress = true;
//  await new Promise((resolve) => setTimeout(resolve, 4000));
//  if (ShowNoResultsInProgress === true){
//    expand_contract_search_results();
//  }
}

const MaintainOpenTarget1 = document.querySelector('#search-link-area')
const MaintainOpenTarget2 = document.querySelector('#search-bar')
const MaintainOpenTarget3 = document.querySelector('#collapse-search-button')


document.addEventListener('click', (event) => {
  const withinBoundaries = (event.composedPath().includes(MaintainOpenTarget1) || event.composedPath().includes(MaintainOpenTarget2) || event.composedPath().includes(MaintainOpenTarget3));

  if (!withinBoundaries && !SearchUpArrow) {
    console.log(event.composedPath());
    expand_contract_search_results();
    console.log("contracting thingy.");
  }
})


function goToSearchResult(index){
  showTables();
  if (Current_Table !== search_targets[index].table_index){
    apply_table(search_targets[index].table_index);
  }

  let i = 0;

  do {
    let element = document.getElementById(`item${i}`);
    i++;
    
    if (!element){
      break;
    } 

    if (search_targets[index].item_index === element.getAttribute('data-item-id')){
      y = element.getBoundingClientRect().top + window.scrollY;
        window.scroll({
        top: y,
        behavior: 'smooth'});      
        
      return;
    }
  } while (true)
}

// For the search item_id is what we loop through and data-item-id