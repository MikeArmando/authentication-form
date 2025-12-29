const signupSection = document.getElementById("signup-section");
const loginSection = document.getElementById("login-section");

const linkToLogin = document.getElementById("link-to-login");
const linkToSignup = document.getElementById("link-to-signup");

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

// ------------------------- Event Listeners -------------------------
linkToLogin.addEventListener("click", (event) => {
  event.preventDefault();

  signupSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
});

linkToSignup.addEventListener("click", (event) => {
  event.preventDefault();

  loginSection.classList.add("hidden");
  signupSection.classList.remove("hidden");
});

if (signupForm) {
  signupForm.addEventListener("submit", handleSignup);
}

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

// ------------------------- Logic for Sign Up -------------------------
function handleSignup(event) {
  event.preventDefault();

  const form = event.target;
  if (!form.checkValidity()) {
    showErrors(form);
    return;
  }

  const formData = new FormData(form);
  const userData = Object.fromEntries(formData);

  if (userData.password !== userData["confirm-password"]) {
    showCustomError(form);
    return;
  }
}

// ------------------------- Logic for Log In -------------------------
function handleLogin(event) {
  event.preventDefault();

  const form = event.target;
  if (!form.checkValidity()) {
    showErrors(form);
    return;
  }

  const formData = new FormData(form);
  const userData = Object.fromEntries(formData);
}

// ------------------------- Show Errors -------------------------
function showErrors(form) {
  Array.from(form.elements).forEach((input) => {
    if (!input.checkValidity()) {
      const errorSpan = input.nextElementSibling;
      if (errorSpan) {
        errorSpan.textContent = "Invalid";
        input.classList.add("invalid-input");
      }
    }
  });
}

// ------------------------------------------------------------
function showCustomError(form) {
  const errorSpan = form["confirm-password"].nextElementSibling;
  errorSpan.textContent = "Passwords do not match!";
  errorSpan.classList.add("invalid-input");
}
