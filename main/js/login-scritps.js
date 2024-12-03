const API_ROOT = "https://api.fsotables.com/";
const LOGIN_COOKIE_NAME = "ganymede-token";

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
  console.log("starting login attempt! V3");
  const emailField = document.getElementById("loginEmail");
  const passwordField = document.getElementById("loginPassword");

  console.log("login attempt2!");

  const loginRequest = {
    email: emailField.value,
    password: passwordField.value,
  }

  console.log("login attempt3!");
  console.log(API_ROOT + "users/login");
  console.log(loginRequest);

  fetch(API_ROOT + "users/login", {
    method: "POST",
    body: JSON.stringify(loginRequest)
  })
  .then((response) => response.json())
  .then(responseJSON => { 
    if (responseJSON.token != undefined){
      // Default login time of a week.
      setCookie("ganymede-token", responseJSON.token, 7*24);
    } else {
      throw responseJSON.error;
    }

   })
  .catch ( 
    error => {console.log(`Loggin in failed. The error encountered was: ${error}`);
    }
  );

  check_login_status_and_update();
}

