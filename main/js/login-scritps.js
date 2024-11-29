function onLoginModalOpen() {
    const passwordField = document.getElementById("loginPassword");
    const checkbox = document.getElementById("loginPasswordToggleShowPassword");

    passwordField.type = "password";
    checkbox.checked = false;

    passwordField.nodeValue = "";
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



function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
