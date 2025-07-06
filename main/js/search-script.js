let targets = [["", ""], ["", ""], ["", ""], ["", ""], ["", ""]];


function end_search(){
  toggleContents(`search-item-0`, false);
  toggleContents(`search-item-1`, false);  
  toggleContents(`search-item-2`, false);  
  toggleContents(`search-item-3`, false);  
  toggleContents(`search-item-4`, false);


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

function start_search(){
  toggleContents(`search-item-0`, true);
  toggleContents(`search-item-1`, true);  
  toggleContents(`search-item-2`, true);  
  toggleContents(`search-item-3`, true);  
  toggleContents(`search-item-4`, true);


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
