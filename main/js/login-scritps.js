function onLoginModalOpen() {
  const loginForm = document.getElementById("login-form");
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

}


