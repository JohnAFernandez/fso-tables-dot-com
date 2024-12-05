const API_ROOT = "https://api.fsotables.com/";
const LOGIN_COOKIE_NAME = "username";

const tables = [];

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
    console.log("Setting visible.");

    passwordField.type = "text";
    checkbox.checked = true;
  } else {
    console.log("Setting hidden.");
    passwordField.type = "password";
    checkbox.checked = false;
  }
}

function attemptLogin(email, password) {
  const emailField = document.getElementById("loginEmail");
  const passwordField = document.getElementById("loginPassword");

  const loginRequest = {
    email: emailField.value,
    password: passwordField.value,
  }

  fetch(API_ROOT + "users/login", {
    method: "POST",
    body: JSON.stringify(loginRequest)
  })
  .then((response) => response.json())
  .then(responseJSON => { 
    if (responseJSON.error === undefined){
      // Default login time of a week.
      setCookie("username", loginRequest.email, 7*24)
    } else {
      throw responseJSON.Error;
    }

   })
  .catch ( 
    error => {console.log(`Login in failed. The error encountered was: ${error}`);
    }
  );

  check_login_status_and_update();
}

