function end_search(){
  const element = document.getElementById(`search-dropdown`);
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

  element.dropdown('toggle');

}

function start_search(){
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

//  const element = document.getElementById(`search-dropdown`);
//  element.style.zIndex = 1021; // Any smaller will not work.
//  element.style.x = document.getElementById("floating-link-container").style.x - 100;
  // 951 - 793  = 158
}

// search-dropdown
// search-item-0 
