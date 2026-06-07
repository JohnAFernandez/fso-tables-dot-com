let awaitingItemSubmissionResult = false;

function initiateItemEdit(id) {
    /*
    item${id}
    item${id}-text
    item${id}-major-version
    item${id}-deprecation-area
    item${id}-variable-type
    item${id}-illegal-values-area
    item${id}-alias-area
    item${id}-documentation
    item${id}-save-button
    */

    // name
    let current_element = document.getElementById(`item${id}-item-text`);
    let target_element = document.getElementById(`item${id}-edit-name`);
    target_element.value = current_element.innerText;
    toggleContents(false, `item${id}-item-text-area`); 
    toggleContents(true, `item${id}-edit-name-group`);

    // version 
    current_element = document.getElementById(`item${id}-major-version`);
    changeContents(`item${id}-edit-major-version`, current_element.innerText);
    toggleContents(false, `item${id}-major-version-area`); 
    toggleContents(true, `item${id}-edit-major-version-group`);

    // Deprecations
    current_element = document.getElementById(`item${id}-major-version`);
    changeContents(`item${id}-edit-major-version`, current_element.innerText);
    toggleContents(false, `item${id}-major-version-area`); 
    toggleContents(true, `item${id}-edit-major-version-group`);

    // type
    current_element = document.getElementById(`item${id}-variable-type`);
    changeContents(`item${id}-edit-variable-type`, current_element.innerText);
    toggleContents(false, `item${id}-type-area`); 
    toggleContents(true, `item${id}-edit-variable-type-group`);

    // Illegal Values


    // Alias


    // Description

//    changeContents("item-edit-description-area", )

    return false;
}

function saveItemEditChanges(id){
    console.log(`Call to editing function done. id ${id}`)
}

function awaitingNewItemResult(waiting){
    awaitingItemSubmissionResult = waiting;
}

function setSumbitNewItemErrorText(errorText){
  changeContents("itemSubmissionErrorText", errorText);
  toggleContents(true, "itemSubmissionError");
}

function clearSumbitNewItemErrorText(errorText){
  changeContents("itemSubmissionErrorText", errorText);
  toggleContents(true, "itemSubmissionError");
}

function dismissLoginModal() {
  $('#addItemModal').modal("hide");
}

function send_submit_new_item(){
  if (awaitingItemSubmissionResult === true) {
    return;
  }

  clearSumbitNewItemErrorText();
  awaitingNewItemResult(true);

  const tableField = document.getElementById("new-item-table");
  const textField = document.getElementById("new-item-name");
  const docField = document.getElementById("new-item-documentation");
  const majorVersionField = document.getElementById("new-item-major");
  const parentIdField = document.getElementById("parent-item");
  const infoTypeField = document.getElementById("new-item-type");
  //const tableIndexField = document.getElementById(""); one day this will work, just not today.
  const defaultValueField = document.getElementById("new-item-default-value");

  const addItemRequest = {

    item_text: textField.value,
    documentation: docField.value,
    major_version: majorVersionField.value,
    parent_id: Number(parentIdField.value),
    table_id: Number(tableField.value),
    deprecation_id: Number(-1),
    restriction_id: Number(-1),
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
      dismissLoginModal();
    } else {
      response.json().then(responseJSON => { 
        // if we didn't have a success then, there was an error from the server, and we should be displaying what it sent. 
        throw responseJSON.Error;}
      ).catch(
        error => { 
          console.log(`Submitting item failed. The error encountered was: ${error}`);
          awaitingNewItemResult(false);
          setSumbitNewItemErrorText(`${error}`);
      })
    }
  }).catch ( 
    error => { 
      console.log(`Submission failed due to some server or network error. The error encountered was: ${error}`);
      awaitingNewItemResult(false);
      setSumbitNewItemErrorText("Submission Failed, Server or Network Error");
    }
  );
   
}