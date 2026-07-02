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

async function newSearch (text){
  // tell everything else to cancel
  cancelSearchSignal = true;
  
  // wait for them to receive the signal
  await new Promise((resolve) => setTimeout(resolve, 5));
  
  // clear out global
  search_targets = [];
  foundItemsSet = [];
  
  cancelSearchSignal = false;
  canceledSearch = false;
  await update_search_results();

  searchForText(text);
}

// not indexes plug into local copies, ids would be inefficient
async function addFoundItem(table_index, item_index, id, text){
  foundItemsSet[foundItemsSet.length] = id;

  let new_target = result_template;
  new_target.table_index = table_index;
  new_target.item_index = item_index;
  new_target.matchText = text;
  
  search_targets[search_targets.length] = new_target;

  update_search_results();
}

async function searchForText (text){
  if (text === undefined || typeof(text) != String || database_tables === undefined){
    canceledSearch = true;
    return;
  }
  
  for (let i = 0; i < database_tables.length; i++) {
    if (database_tables[i].items === undefined){
      continue;
    }
  
    for (let j = 0; j < database_tables[i].items[j].length; j++){
      if (foundItemsSet.includes(database_tables[i].items[j].item_id)){
        continue;
      }

      if (database_tables[i].items[j].item_text.startsWith(text)){
        addFoundItem(i, j, database_tables[i].items[j].item_id, database_tables[i].item_text);
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
    
    for (let j = 0; j < database_tables[i].items[j].length; j++){
      if (foundItemsSet.includes(database_tables[i].items[j].item_id)){
        continue;
      }

      if (database_tables[i].items[j].item_text.contains(text)){
        addFoundItem(i, j, database_tables[i].items[j].item_id, database_tables[i].item_text);
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
    
    for (let j = 0; j < database_tables[i].items[j].length; j++){
      if (foundItemsSet.includes(database_tables[i].items[j].item_id)){
        continue;
      }
      
      if (database_tables[i].items[j].documentation.startsWith(text)){
        addFoundItem(i, j, database_tables[i].items[j].item_id, database_tables[i].item_text);
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
    
    for (let j = 0; j < database_tables[i].items[j].length; j++){
      if (foundItemsSet.includes(database_tables[i].items[j].item_id)){
        continue;
      }

      if (database_tables[i].items[j].documentation.contains(text)){
        addFoundItem(i, j, database_tables[i].items[j].item_id, database_tables[i].text);
      }

      if (cancelSearchSignal === true){
        return;
      }
    }
  }

  console.log("Search completed successfully.");
  console.log(search_targets);
}

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

  for (thing in search_targets) {
    thing[0] = "";
    thing[1] = "";
  }
}

function display_search_results(){
  toggleContents(true, `search-item-0`);
  toggleContents(true, `search-item-1`);  
  toggleContents(true, `search-item-2`);  
  toggleContents(true, `search-item-3`);  
  toggleContents(true, `search-item-4`);


  const element1 = document.getElementById(`search-item-0`);
  const element2 = document.getElementById(`search-item-1`);
  const element3 = document.getElementById(`search-item-2`);
  const element4 = document.getElementById(`search-item-3`);
  const element5 = document.getElementById(`search-item-4`);

  element1.textContent = "RESULT1...";
  element2.textContent = "RESULT2...";
  element3.textContent = "RESULT3...";
  element4.textContent = "RESULT4...";
  element5.textContent = "RESULT5...";

//  element.style.zIndex = 1021; // Any smaller will not work.
//  element.style.x = document.getElementById("floating-link-container").style.x - 100;
  // 951 - 793  = 158
}

function goToSearchResult(index){

}

// search-dropdown
// search-item-0 
