let search_targets = [];
let foundItemsSet = []; // for "quick" culling of known objects
let searchResultRowCount = 0;

let result_template = {
  table_index : -1,
  item_index : -1,
  matchText : ""
}

async function update_search_results_ui() {
  console.log("Update Search results called");
}

// Async signals
let cancelSearchSignal = false;
let canceledSearch = false;

async function newSearch (){
  let search_bar = document.getElementById(`search_bar`);
  let text = search_bar.value;

  // tell everything else to cancel
  cancelSearchSignal = true;

  end_search(text.length > 0);

  // wait for them to receive the signal
  await new Promise((resolve) => setTimeout(resolve, 5));
  
  // clear out global
  search_targets = [];
  foundItemsSet = [];
  
  cancelSearchSignal = false;
  canceledSearch = false;

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
    canceledSearch = true;
    return;
  }
  
  for (let i = 0; i < database_tables.length; i++) {
    if (database_tables[i].items === undefined){
      continue;
    }
  
    for (let j = 0; j < database_tables[i].items.length; j++){
      if (foundItemsSet.includes(database_tables[i].items[j].item_id)){
        continue;
      }

      if (database_tables[i].items[j].item_text.startsWith(text)){
        addFoundItem(i, j, database_tables[i].items[j].item_id, `${database_tables[i].name.replace(" Table", "")}-> ${database_tables[i].items[j].item_text}`);
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

      if (database_tables[i].items[j].item_text.includes(text)){
        addFoundItem(i, j, database_tables[i].items[j].item_id, `${database_tables[i].name.replace(" Table", "")}-> ${database_tables[i].items[j].item_text}`);
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
      
      if (database_tables[i].items[j].documentation.startsWith(text)){
        addFoundItem(i, j, database_tables[i].items[j].item_id, `In documentation for ${database_tables[i].name.replace(" Table", "")}-> ${database_tables[i].items[j].item_text}`);
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

      if (database_tables[i].items[j].documentation.includes(text)){
        addFoundItem(i, j, database_tables[i].items[j].item_id, `In documentation for ${database_tables[i].name.replace(" Table", "")}-> ${database_tables[i].items[j].item_text}`);
      }

      if (cancelSearchSignal === true){
        return;
      }
    }
  }
}


async function update_search_results_ui(){
  if (search_targets === undefined) {
    return;
  }

  if (search_targets.length < 1){
    end_search(false);
    let element = document.getElementById(`search-result-0`);
    if (!element){
      append_search_row();
    }
    
    toggleContents(true, `search-result-0`);
    element.textContent = "No Results...";
    await new Promise((resolve) => setTimeout(resolve, 4000));
    toggleContents(false, `search-link-area`);
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
  let i = 0;
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

  if (!restarting){
    toggleContents(false, `search-link-area`)
  }
}

function init_search(){
  end_search(false);
  let search_bar = document.getElementById(`search_bar`);
  search_bar.value = "";
  search_bar.setAttribute("oninput", "newSearch();")
  toggleContents(false, `search-link-area`)
}

function append_search_row(){
  let parent_item = document.getElementById(`search-link-container`);
  let temporary_item = document.getElementById(`searchResultRowTemplate`).content.cloneNode(true);

  let child = temporary_item.querySelector(".row");

  if (child !== null){
    child.setAttribute("on-click", `goToSearchResult(${searchResultRowCount})`);
    child.setAttribute("id", `search-result-${searchResultRowCount}`)
  }

  child = temporary_item.querySelector(".search-target-link");

  if (child !== null){
    child.setAttribute("id", `search-item-${searchResultRowCount}`)
  }

  parent_item.appendChild(temporary_item);
  searchResultRowCount += 1;
}



function goToSearchResult(index){
  apply_table(search_targets[index].table_index);
}

let SearchUpArrow = true;
function expand_search_results(){
  SearchUpArrow = !SearchUpArrow;
  toggleContents(SearchUpArrow, "searchChangeArrow1");
  toggleContents(!SearchUpArrow, "searchChangeArrow2");  
  toggleContents(SearchUpArrow, "search-link-area")
}
