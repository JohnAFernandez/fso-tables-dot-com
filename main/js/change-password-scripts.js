// TODO! Change password needs a way to submit the old password via the API.
async function sendChangePasswordRequest(){
  console.log("Running password change request.");
  clearChangePasswordErrorText();  

  const username = getCookie("username");
  if (!username) {
    console.log("Early return bad username cookie.");
    setChangePasswordErrorText("Login Cookies not set up correctly.  Try logging out and then logging back in.");
    return;
  }

  const oldPasswordField = document.getElementById("reenterPassword");
  const passwordField = document.getElementById("passwordChangeA");
  const passwordField2 = document.getElementById("passwordChangeB");

  if (passwordField.value != passwordField2.value) {
    console.log("Early return no password match.");
    setChangePasswordErrorText("New password needs to match");
    return;
  }

  awaitingPaswordChangeResponse(true);

  const passwordBody = {
    old_password: oldPasswordField.value,
    password: passwordField.value,
  }
  await fetch(API_ROOT + "users/myaccount/password", { 
    method: "POST", 
    headers: { "username" : username,
    },
    body: JSON.stringify(passwordBody)
    ,
    credentials: 'include'
  })
  .then((response) => {
    if (response.status !== 200) {      
      response.json().then(responseJSON => { 
        let text = responseJSON.Error;
          console.log(`Password reset request failed. The error encountered was: ${text}`);
          setChangePasswordErrorText(`${text}`);    
          awaitingLoginResponse(false);
        }
      )
      
      return;
    }      
  }) 
  .catch ( 
    error => {
      console.log(`Change password failed. The error encountered was: ${error}`);
      setChangePasswordErrorText("Change password failed, network or website error.");
    }
  );

  awaitingPaswordChangeResponse(false);
}

function awaitingPaswordChangeResponse(bool){
  toggleContents(bool, "changePasswordLoaderAnim");
  toggleContents(!bool, "changePasswordSumbitButton");
}


function setChangePasswordErrorText(errorText){
  toggleContents(true, "changePasswordErrorMessage");
  changeContents("changePasswordErrorText", errorText);
}

function clearChangePasswordErrorText(){
  toggleContents(false, "changePasswordErrorMessage"); 
  changeContents("changePasswordErrorText", " ");
}

function setChangePasswordSuccessText(){
  clearChangePasswordErrorText();
  toggleContents(true, "changePasswordSuccessMessage");
  changeContents("changePasswordSuccessText", "Password Change Successful!")
}

function clearChangePasswordSuccessText(){
  toggleContents(false, "changePasswordSuccessMessage");
  changeContents("changePasswordSuccessText", "");
}