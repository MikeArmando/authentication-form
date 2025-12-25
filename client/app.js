const signupSection = document.getElementById("signup-section");
const loginSection = document.getElementById("login-section");

const linkToLogin = document.getElementById("link-to-login");
const linkToSignup = document.getElementById("link-to-signup");

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

linkToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  signupSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
});

linkToSignup.addEventListener("click", (e) => {
  e.preventDefault();
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
}

// ------------------------- Logic for Log In -------------------------
function handleLogin(event) {
  event.preventDefault();
}
