let LOGIN_COOKIE_NAME = "username";
let API_ROOTB = "https://www.fsotables.com/api/";

function onLoginModalOpen() {
  const passwordField = document.getElementById("loginPassword")
  const checkbox = document.getElementById("loginPasswordToggleShowPassword");

  // When the modal is reloaded, make sure to erase the password so that it's not 
  // some rando gaining access to the accidentally abandoned password
  passwordField.value = "";
  passwordField.type = "password";
  checkbox.checked = false;
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
  const checkbox = document.getElementById("loginPasswordToggleShowPassword");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    checkbox.checked = true;
  } else {
    passwordField.type = "password";
    checkbox.checked = false;
  }
}

function awaitingLoginResponse(awaiting) {
  toggleContents(!awaiting, "loginButton");
  toggleContents(awaiting, "login-loader-anim")
}

function setLoginErrorText(errorText){
  changeContents("loginErrorText", errorText);
  toggleContents(true, "loginErrorMessage");
}

function clearLoginErrorText(){
  toggleContents(false, "loginErrorMessage"); 
}

function attemptLogin() {
  // Yes, I'm lazy, redirect to new function if sending a password reset
  if (Password_Reset){
    sendResetPasswordRequest();
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
      return;
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

function sendResetPasswordRequest(){
  console.log("Now at Green River Password Reset.");
 
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
      changeToCodeConfirmChoosePasswordLol();
      awaitingLoginResponse(false);
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
      setLoginErrorText("Password Reset Request Failed, Server or Network Error");
    }
  );  
}

function dismissLoginModal() {
  $('#loginModal').modal("hide");
}

let Password_Reset = false;

function passwordResetToggle() {
  Password_Reset = !Password_Reset;

  clearLoginErrorText();
  toggleContents(true, "loginButton");
  toggleContents(false, "login-loader-anim");
  
  toggleContents(!Password_Reset, "loginPasswordGroup");
  toggleContents(!Password_Reset, "showPasswordLoginArea");

  const bottomContents = document.getElementById("loginFooterGroup");
  const passwordField = document.getElementById("loginPassword");

  if (Password_Reset){
    replace_text_contents(`loginButton`, `Send Reset Link`);
    replace_text_contents(`resetPasswordLink`, `Back to Login`);
    bottomContents.style.justifyContent = `center`; 
    passwordField.required = false;

  } else {
    replace_text_contents(`loginButton`, `Login`);
    replace_text_contents(`resetPasswordLink`, `Forgot my Password`);
    bottomContents.style.justifyContent = `space-between`;
    passwordField.required = true;
  }
}
