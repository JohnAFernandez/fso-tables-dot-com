let targets = [["", ""], ["", ""], ["", ""], ["", ""], ["", ""]];


function search_for_text (text){
  for ()
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

  for (thing in targets) {
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
