let LOGIN_COOKIE_NAME = "username";
let API_ROOTB = "https://www.fsotables.com/api/";

function onLoginModalOpen() {
  const passwordField = document.getElementById("loginPassword");
  const passwordField2 = document.getElementById("loginPasswordConfirm");
  const checkbox = document.getElementById("loginPasswordToggleShowPassword");
  const confirmationCodeField = document.getElementById("confirmationCode");

  // When the modal is reloaded, make sure to erase the password so that it's not 
  // some rando gaining access to the accidentally abandoned password
  passwordField.value = "";
  passwordField.type = "password";
  passwordField.required = true;
  passwordField2.value = "";
  passwordField2.type = "password";
  passwordField2.required = false;
  confirmationCodeField.value = "";
  confirmationCodeField.required = false;

  checkbox.checked = false;

  toggleContents(false, "confirmationCodeArea");
  toggleContents(true, "loginEmailArea");
  toggleContents(true, "loginPasswordGroup");
  toggleContents(false, "loginPasswordConfirmGroup");
  toggleContents(true, "loginEmailArea");
  replace_text_contents(`loginButton`, `Login`);

  Email_To_Reset = "";
  
  if (Password_Reset === true) {
    passwordResetToggle();
  }

  clearLoginErrorText();
}

//TODO! We need to send a signal to the server to close out the session there.
function onLogout() {
  const ourCookie = getCookie("mode");
  if (ourCookie === "account"){
    showWelcome();
  }

  setCookie("username", "", 7*24);
  check_login_status_and_update();

}


$(window).on('shown.bs.modal', onLoginModalOpen);

function togglePasswordLogin() {
  const passwordField = document.getElementById("loginPassword");
  const passwordField2 = document.getElementById("loginPasswordConfirm");

  const checkbox = document.getElementById("loginPasswordToggleShowPassword");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    passwordField2.type = "text";
    checkbox.checked = true;
  } else {
    passwordField.type = "password";
    passwordField2.type = "password";
    checkbox.checked = false;
  }
}

function awaitingLoginResponse(awaiting) {
  toggleContents(!awaiting, "loginButton");
  toggleContents(awaiting, "loginLoaderAnim")
}

function setLoginErrorText(errorText){
  changeContents("loginErrorText", errorText);
  toggleContents(true, "loginErrorMessage");
}

function clearLoginErrorText(){
  changeContents("loginErrorText", " ");
  toggleContents(false, "loginErrorMessage"); 
}

function attemptLogin() {
  // Yes, I'm lazy, redirect to new function if sending a password reset
  if (Password_Reset && !Password_Reset_Confirm){
    sendResetPasswordRequest();
    return;
  } else if (Password_Reset_Confirm) {
    sendResetPasswordConfirmRequest();
    return;
  }

  // first make sure that the ui acknowledges a new login attempt
  clearLoginErrorText();
  awaitingLoginResponse(true);

  const emailField = document.getElementById("loginEmail");
  const passwordField = document.getElementById("loginPassword");

  const loginRequest = {
    email: emailField.value,
    password: passwordField.value,
  }

  fetch(API_ROOTB + "users/login", {
    method: "POST",
    body: JSON.stringify(loginRequest)
  })
  .then((response) => { 
    if (response.status === 200) {
      // Default login expiration of a week.
      setCookie("username", loginRequest.email, 7*24)
      if (getCookie("GanymedeToken") == ""){
        console.log("Credential Token Header Not Saved");
      }

      check_login_status_and_update();
      dismissLoginModal();
    } else {
      response.json().then(responseJSON => { 
        // if we didn't have a success then, there was an error from the server, and we should be displaying what it sent. 
        throw responseJSON.Error;}
      ).catch(
        error => { 
          console.log(`Login failed. The error encountered was: ${error}`);
          awaitingLoginResponse(false);
          setLoginErrorText(`${error}`);
      })
    }
  }).catch ( 
    error => { 
      console.log(`Login in failed due to some server or network error. The error encountered was: ${error}`);
      awaitingLoginResponse(false);
      setLoginErrorText("Login Failed, Server or Network Error");
    }
  );

}

let Email_To_Reset = "";

function sendResetPasswordRequest(){
  // first make sure that the ui acknowledges a new login attempt
  clearLoginErrorText();
  awaitingLoginResponse(true);

  const emailField = document.getElementById("loginEmail");
  const emailResetRequest = {
    email: emailField.value,
  }

  fetch(API_ROOTB + "users/reset-password", {
    method: "POST",
    body: JSON.stringify(emailResetRequest)
  })
  .then((response) => { 
    if (response.status === 200) {
      changeToCodeConfirmChoosePassword();
      awaitingLoginResponse(false);
      Email_To_Reset = emailResetRequest.email;
      return;
    } else {
      response.json().then(responseJSON => { 
        // if we didn't have a success then, there was an error from the server, and we should be displaying what it sent. 
        throw responseJSON.Error;}
      ).catch(
        error => { 
          console.log(`Password reset request failed. The error encountered was: ${error}`);
          awaitingLoginResponse(false);
          setLoginErrorText(`${error}`);
          changeToCodeConfirmChoosePassword();
        }
      )
    }
  }).catch ( 
    error => { 
      console.log(`Password reset request failed. The error encountered was: ${error}`);
      awaitingLoginResponse(false);
      setLoginErrorText("Password Reset Request Failed, Server or Network Error");
      changeToCodeConfirmChoosePassword();
    }
  );  
}

function sendResetPasswordConfirmRequest() {
  // first make sure that the ui acknowledges a new login attempt
  clearLoginErrorText();

  // Need to validate that the passwords are the same here
  const passwordField = document.getElementById("loginPassword");
  const passwordField2 = document.getElementById("loginPasswordConfirm");

  if (passwordField.value != passwordField2.value){
    setLoginErrorText("Passwords do not match");
    return;
  }

  awaitingLoginResponse(true);

  const email = Email_To_Reset;
  const codeField = document.getElementById("confirmationCode");

  const emailResetConfrimationRequest = {
    email: email,
    code: codeField.value,
    password: passwordField.value,
  }

  fetch(API_ROOTB + "users/reset-password/confirm", {
    method: "POST",
    body: JSON.stringify(emailResetConfrimationRequest)
  })
  .then((response) => { 
    if (response.status === 200) {
      awaitingLoginResponse(false);
      dismissLoginModal();
      return;
    } else {
      response.json().then(responseJSON => { 
        // if we didn't have a success then, there was an error from the server, and we should be displaying what it sent. 
        throw responseJSON.Error;}
      ).catch(
        error => { 
          console.log(`Password reset request failed. The error encountered was: ${error}`);
          awaitingLoginResponse(false);
          setLoginErrorText(`${error}`);
        }
      )
    }
  }).catch ( 
    error => { 
      console.log(`Password reset request failed. The error encountered was: ${error}`);
      awaitingLoginResponse(false);
      setLoginErrorText("Password Reset Request Failed, Network or Website Error");
    }
  );  
}

function dismissLoginModal() {
  $('#loginModal').modal("hide");
}

let Password_Reset = false;
let Password_Reset_Confirm = false;

function passwordResetToggle() {
  Password_Reset_Confirm = false;
  Password_Reset = !Password_Reset;

  clearLoginErrorText();
  toggleContents(true, "loginButton");
  toggleContents(false, "loginLoaderAnim");
  
  toggleContents(!Password_Reset, "loginPasswordGroup");
  toggleContents(!Password_Reset, "showPasswordLoginArea");

  const bottomContents = document.getElementById("loginFooterGroup");
  const passwordField = document.getElementById("loginPassword");
  const passwordField2 = document.getElementById("loginPasswordConfirm");

  if (Password_Reset){
    replace_text_contents(`loginButton`, `Send Reset Link`);
    replace_text_contents(`resetPasswordLink`, `Back to Login`);
    bottomContents.style.justifyContent = `center`; 
    passwordField.required = false;
    passwordField2.required = false;

  } else {
    replace_text_contents(`loginButton`, `Login`);
    replace_text_contents(`resetPasswordLink`, `Forgot my Password`);
    bottomContents.style.justifyContent = `space-between`;
    passwordField.required = true;
    passwordField2.required = false;
  }
}

function changeToCodeConfirmChoosePassword(){
  Password_Reset_Confirm = true; 
  clearLoginErrorText();

  const bottomContents = document.getElementById("loginFooterGroup");
  const passwordField = document.getElementById("loginPassword");
  const passwordField2 = document.getElementById("loginPasswordConfirm");
  const confirmationCodeField = document.getElementById("confirmationCode");
  const checkbox = document.getElementById("loginPasswordToggleShowPassword");

  replace_text_contents(`loginButton`, `Confirm New Password`);
  replace_text_contents(`resetPasswordLink`, `Back to Login`);
  bottomContents.style.justifyContent = `center`; 
  toggleContents(true, "confirmationCodeArea");
  toggleContents(true, "loginPasswordGroup");
  toggleContents(true, "loginPasswordConfirmGroup");
  toggleContents(true, "showPasswordLoginArea");
  toggleContents(false, "loginEmailArea");

  passwordField.required = true;
  passwordField.type = "password";
  passwordField2.required = true;
  passwordField2.type = "password";

  confirmationCodeField.required = true;
  checkbox.checked = false;
  bottomContents.style.justifyContent = `space-between`;
  // turn on password, code and password 2.  Keep button on.
  // turn off everything else basically.
}
