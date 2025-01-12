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
    setChangePasswordErrorText("Password confirm does not match.");
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
      return;
    }
  }) 
  .catch ( 
    error => {
      console.log(`Logout failed. The error encountered was: ${error}`);
    }
  );


}

function awaitingPaswordChangeResponse(bool){
  toggleContents(bool, "registrationLoaderAnim");
  toggleContents(!bool, "registrationSumbitButton");
}


function setChangePasswordErrorText(errorText){
    changeContents("changePasswordErrorText", errorText);
    toggleContents(true, "changePasswordErrorMessage");
  }
  
  function clearChangePasswordErrorText(){
    toggleContents(false, "changePasswordErrorMessage"); 
    changeContents("changePasswordErrorText", " ");
  }
  