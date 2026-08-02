let awaitingItemSubmissionResult = false;
let awaitingEditItemResult = false;
let EditId = -1;

function initiateItemEdit(id) {
  if (Edit_In_Progress) {
      return;
  }

  EditId = id;
  Edit_In_Progress = true;
  
  // Change Active Buttons
  toggleContents(false, `item${id}-edit-button-col`);
  toggleContents(true, `item${id}-save-button-col`);
  toggleContents(true, `item${id}-cancel-button-col`);

  // name
  let current_element = document.getElementById(`item${id}-item-text`);
  let target_element = document.getElementById(`item${id}-edit-name`);
  target_element.value = current_element.innerText;
  toggleContents(false, `item${id}-item-text-area`); 
  toggleContents(true, `item${id}-edit-name-group`);

  // version 
  current_element = document.getElementById(`item${id}-major-version`);
  target_element = document.getElementById(`item${id}-edit-major-version`);
  target_element.value = current_element.innerText;
  toggleContents(false, `item${id}-major-version-area`); 
  toggleContents(true, `item${id}-edit-major-version-group`);

  // Description
  toggleContents(true, `item${id}-edit-description-area`);
  current_element = document.getElementById(`item${id}-documentation`);
  target_element = document.getElementById(`item${id}-edit-description`);
  target_element.value = current_element.innerText;
  toggleContents(false, `item${id}-documentation`);

  // type
  current_element = document.getElementById(`item${id}-variable-type`);
  target_element = document.getElementById(`item${id}-edit-type`);
  target_element.value = current_element.innerText;
  toggleContents(false, `item${id}-type-area`);
  toggleContents(true, `item${id}-edit-type-group`);

  // Default value -- Copying the value should still work because no default value is empty in the item.
  current_element = document.getElementById(`item${id}-default-value`);
  target_element = document.getElementById(`item${id}-edit-default-value`);
  target_element.value = current_element.innerText;
  toggleContents(false, `item${id}-default-value-display-area`);
  toggleContents(true, `item${id}-default-value-edit-area`);

  //Item Ordering
  toggleContents(true, `item${id}-edit-ordering-area`);
  itemSetOrderingOptions(id);

  //Item Parent
  toggleContents(false, `item${id}-parent-area`);
  toggleContents(true, `item${id}-parent-editing-area`);
  itemSetParentItemOptions(id);


  // TODO!
  // Illegal Values

  // Alias

  // Deprecations
  //current_element = document.getElementById(`item${id}-deprecations`);
  //changeContents(`item${id}-edit-deprecation`, current_element.innerText);
  //toggleContents(false, `item${id}-major-version-area`); 
  //toggleContents(true, `item${id}-edit-major-version-group`);


  // Small formatting changes
  current_element = document.getElementById(`item${id}-description-row`);
  current_element.classList.remove(`indented-row`);
  toggleContents(false, `item${id}-template-description-header`);
}

function turnOffItemEdit(id) {
  toggleContents(true, `item${id}-edit-button-col`);
  toggleContents(false, `item${id}-save-button-col`);
  toggleContents(false, `item${id}-cancel-button-col`);
  toggleContents(true, `item${id}-item-text-area`); 
  toggleContents(false, `item${id}-edit-name-group`);
  toggleContents(true, `item${id}-major-version-area`); 
  toggleContents(false, `item${id}-edit-major-version-group`);
  toggleContents(true, `item${id}-documentation`);
  toggleContents(false, `item${id}-edit-description-area`);
  toggleContents(true, `item${id}-type-area`);
  toggleContents(false, `item${id}-edit-type-group`);
  toggleContents(true, `item${id}-template-description-header`);
  toggleContents(false, `item${id}-edit-ordering-area`);
  toggleContents(true, `item${id}-default-value-display-area`);
  toggleContents(false, `item${id}-default-value-edit-area`);
  toggleContents(true, `item${id}-parent-area`);
  toggleContents(false, `item${id}-parent-editing-area`);

  let current_element = document.getElementById(`item${id}-description-row`);
  current_element.classList.add(`indented-row`);

  Edit_In_Progress = false;
}

function setAwaitingNewItemResult(waiting){

    awaitingItemSubmissionResult = waiting;
}

function setSumbitNewItemErrorText(errorText){
  changeContents("itemSubmissionErrorText", errorText);
  toggleContents(true, "itemSubmissionError");
}

function clearSumbitNewItemErrorText(){
  changeContents("itemSubmissionErrorText", "");
  toggleContents(true, "itemSubmissionError");
}

function dismissNewItemModal() {
  $('#addItemModal').modal("hide");
}

function clearNewItemUniqueInfo() {
  let element = document.getElementById(`new-item-name`);
  element.value = "";
  element = document.getElementById(`new-item-documentation`);
  element.value = "";
  element = document.getElementById(`new-item-default-value`);
  element.value = "";
}

function send_submit_new_item(){
  if (awaitingItemSubmissionResult === true) {
    return;
  }

  setAwaitingNewItemResult(true);
  clearSumbitNewItemErrorText();

  const tableField = document.getElementById("new-item-table");
  const textField = document.getElementById("new-item-name");
  const docField = document.getElementById("new-item-documentation");
  const majorVersionField = document.getElementById("new-item-major");
  const parentIdField = document.getElementById("parent-item-select");
  const infoTypeField = document.getElementById("new-item-type");
  const tableIndexField = document.getElementById("item-ordering-select"); 
  const defaultValueField = document.getElementById("new-item-default-value");

  const addItemRequest = {

    item_text: textField.value,
    documentation: docField.value,
    major_version: majorVersionField.value,
    parent_id: Number(parentIdField.value),
    table_id: Number(tableField.value),
    info_type: infoTypeField.value,
    default_value: defaultValueField.value,
    table_index: Number(-1)
  }

  fetch(API_ROOTB + "tables/items", {
    method: "POST",
    body: JSON.stringify(addItemRequest),
    credentials: "include",
    headers: {
    "username": getCookie("username")
      }
  })
  .then((response) => { 
    if (response.status === 200) {
      setAwaitingNewItemResult(false);
      clearNewItemUniqueInfo();
      dismissNewItemModal();
    } else {
      response.json().then(responseJSON => { 
        // if we didn't have a success then, there was an error from the server, and we should be displaying what it sent. 
        throw responseJSON.Error;}
      ).catch(
        error => { 
          console.log(`Submitting item failed. The error encountered was: ${error}`);
          setAwaitingNewItemResult(false);
          setSumbitNewItemErrorText(`${error}`);
      })
    }
  }).catch ( 
    error => { 
      console.log(`Submission failed due to some server or network error. The error encountered was: ${error}`);
      setAwaitingNewItemResult(false);
      setSumbitNewItemErrorText("Submission Failed, Server or Network Error");
    }
  );
   
}

function setAwaitingEditItemResult(waiting){
  awaitingEditItemResult = waiting;
}

const No_Change = "~!*$%";

function saveItemEditChanges(id){
  if (awaitingEditItemResult === true) {
    return;
  }

  setAwaitingEditItemResult(true);
  clearSumbitNewItemErrorText();

  let item_index = document.getElementById(`item${id}`).getAttribute("data-item-id");
  let text = document.getElementById(`item${id}-edit-name`).value;
  let docField = document.getElementById(`item${id}-edit-description`).value;
  let majorVersionField = document.getElementById(`item${id}-edit-major-version`).value;
  let parentIdField = document.getElementById(`item${id}-edit-parent-select`).value;
  let infoTypeField = document.getElementById(`item${id}-edit-type`).value;
  let tableIndexField = document.getElementById(`item${id}-ordering-select`).value; 
  let defaultValueField = document.getElementById(`item${id}-edit-default-value`).value;

  let i;

  // we need to check for changes to the values before automatically submitting them.  Saves database work and keeps changes cleaner
  for (i = 0; i < database_tables[Current_Table].items.length; i++){
    let item = database_tables[Current_Table].items[i];

    if(item_index == database_tables[Current_Table].items[i].item_index){
      if (text === item.text){
        text = No_Change;
      }

      if (docField === item.documentation){
        docField = No_Change;
      }
      if (majorVersionField === item.major_version){
        majorVersionField = No_Change;
      }
      if (parentIdField === item.parent_id){
        parentIdField = No_Change;
      }
      if (infoTypeField === item.info_type){
        infoTypeField = No_Change;
      }
      if (tableIndexField === item.table_index){
        tableIndexField = No_Change;
      }
      if (defaultValueField === item.default_value){
        defaultValueField = No_Change;
      }

      break;
    }
  }

  const patchItemRequest = {
    item_id: Number(item_index),
    item_text: text,
    documentation: docField,
    major_version: majorVersionField,
    parent_id: parentIdField,
    info_type: infoTypeField,
    default_value: defaultValueField,
    table_index: tableIndexField
  }

  fetch(API_ROOTB + "tables/items", {
    method: "PATCH",
    body: JSON.stringify(patchItemRequest),
    credentials: "include",
    headers: {
    "username": getCookie("username")
      }
  })
  .then((response) => { 
    if (response.status === 200) {
      setAwaitingEditItemResult(false);
    } else {
      response.json().then(responseJSON => { 
        // if we didn't have a success then, there was an error from the server, and we should be displaying what it sent. 
        throw responseJSON.Error;}
      ).catch(
        error => { 
          console.log(`Submitting item failed. The error encountered was: ${error}`);
          setAwaitingEditItemResult(false);
          //setSumbitNewItemErrorText(`${error}`);
      })
    }
  }).catch ( 
    error => { 
      console.log(`Submission failed due to some server or network error. The error encountered was: ${error}`);
      setAwaitingEditItemResult(false);
      //setSumbitNewItemErrorText("Submission Failed, Server or Network Error");
    }
  );   
}