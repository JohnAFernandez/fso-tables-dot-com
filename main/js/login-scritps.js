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

function onLogout() {
  const ourCookie = getCookie("mode");
  if (ourCookie === "account"){
    showWelcome();
  }

  setCookie("username", "", 7*24);
  check_login_status_and_update();

}

// TODO! FINISH ME!
function onRegisterModalOpen(){
  return;
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

function attemptLogin(email, password) {
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
      clearLoginErrorText();
      check_login_status_and_update();
      dismissLoginModal();
      return;
    } else {
      response.json().then(responseJSON => { 
        // if we didn't have a success then, there was an error from the server, and we should be displaying what it sent. 
        throw responseJSON.Error;}
      ).catch(
        error => { 
          console.log(`Login in failed after 200 response. The error encountered was: ${error}`);
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

function dismissLoginModal() {
  let modal = getElementById("loginModal");

  if (modal != undefined) {
    modal.modal("hide");
  }
}
