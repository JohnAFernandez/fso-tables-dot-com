let search_targets = [];
let foundItemsSet = []; // for "quick" culling of known objects

let result_template = {
  table_index : -1,
  item_index : -1,
  matchText : ""
}

async function update_search_results() {
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

  end_search();

  // wait for them to receive the signal
  await new Promise((resolve) => setTimeout(resolve, 5));
  
  // clear out global
  search_targets = [];
  foundItemsSet = [];
  
  cancelSearchSignal = false;
  canceledSearch = false;

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

  update_search_results();
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
        addFoundItem(i, j, database_tables[i].items[j].item_id, `${database_tables[i].name}\\${database_tables[i].items[j].item_text}`);
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
        addFoundItem(i, j, database_tables[i].items[j].item_id, `${database_tables[i].name}\\${database_tables[i].items[j].item_text}`);
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
        addFoundItem(i, j, database_tables[i].items[j].item_id, `In documentation for ${database_tables[i].name}\\${database_tables[i].items[j].item_text}`);
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
        addFoundItem(i, j, database_tables[i].items[j].item_id, `In documentation for ${database_tables[i].name}\\${database_tables[i].items[j].item_text}`);
      }

      if (cancelSearchSignal === true){
        return;
      }
    }
  }

  console.log("Search completed successfully.");
}

// this is UI side, only
function end_search(){
  toggleContents(false, `search-item-0`);
  toggleContents(false, `search-item-1`);  
  toggleContents(false, `search-item-2`);  
  toggleContents(false, `search-item-3`);  
  toggleContents(false, `search-item-4`);


  const element1 = document.getElementById(`search-item-0`);
  const element2 = document.getElementById(`search-item-1`);
  const element3 = document.getElementById(`search-item-2`);
  const element4 = document.getElementById(`search-item-3`);
  const element5 = document.getElementById(`search-item-4`);

  element1.textContent = "...";
  element2.textContent = "...";
  element3.textContent = "...";
  element4.textContent = "...";
  element5.textContent = "...";
}

function update_search_results(){
  if (search_targets === undefined) {
    return;
  }

  if (search_targets.length < 1){
    end_search();
    toggleContents(true, `search-item-0`);
    const element = document.getElementById(`search-item-0`);
    element.textContent = "No Results...";
    return;
  }

  for (let i = 0; i < Math.min(10, search_targets.length); i++){
    toggleContents(true, `search-item-${i}`);
    const element = document.getElementById(`search-item-${i}`);

    element.textContent = search_targets[i].matchText;
  }

//  element.style.zIndex = 1021; // Any smaller will not work.
//  element.style.x = document.getElementById("floating-link-container").style.x - 100;
  // 951 - 793  = 158
}

function goToSearchResult(index){

}

// search-dropdown
// search-item-0 
