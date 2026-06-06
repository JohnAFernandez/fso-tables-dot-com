let awaitingSubmissionResult = false;

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


}

function saveItemEditChanges(id){
    console.log(`Call to editing function done. id ${id}`)
}

function clearItemSubmitResultText(waiting){
    awaitingSubmissionResult = waiting;
}

function submit_new_item(){
  if (awaitingSubmissionResult === true) {
    return;
  }

  clearItemSubmitResultText();
  awaitingSubmissionRequest(true);

  const textField = document.getElementById("new-item-name");
  const docField = document.getElementById("new-item-documentation");
  const majorVersionField = document.getElementById("new-item-major");
  const parentIdField = document.getElementById("parent-item");
  const tableIdField = document.getElementById("loginEmail");
  const infoTypeField = document.getElementById("new-item-type");
  const defaultValueField = document.getElementById("loginEmail");
  const tableIndexField = document.getElementById("loginEmail");


  const addItemRequest = {
    email: emailField.value,
    password: passwordField.value,
  }

  fetch(API_ROOTB + "users/login", {
    method: "POST",
    body: JSON.stringify(loginRequest),
    credentials: "include"
  })
  .then((response) => { 
    if (response.status === 200) {
      // Default login expiration of a week.
      setCookie("username", loginRequest.email, 7*24)

      check_login_status_and_update();
      dismissLoginModal();
    } else {
      response.json().then(responseJSON => { 
        // if we didn't have a success then, there was an error from the server, and we should be displaying what it sent. 
        throw responseJSON.Error;}
      ).catch(
        error => { 
          console.log(`Login failed. The error encountered was: ${error}`);
          awaitingSubmissionRequest(false);
          setLoginErrorText(`${error}`);
      })
    }
  }).catch ( 
    error => { 
      console.log(`Login in failed due to some server or network error. The error encountered was: ${error}`);
      awaitingSubmissionRequest(false);
      setLoginErrorText("Login Failed, Server or Network Error");
    }
  );
   
}