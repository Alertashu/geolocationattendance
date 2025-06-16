// For Firebase v8
document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();

  // Signup
  const signupBtn = document.getElementById("signup-btn");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          alert("Signup successful!");
          window.location.href = "dashboard.html";
        })
        .catch(error => {
          document.getElementById("signup-error").textContent = error.message;
        });
    });
  }

  // Login
  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          alert("Login successful!");
          window.location.href = "dashboard.html";
        })
        .catch(error => {
          document.getElementById("login-error").textContent = error.message;
        });
    });
  }
});
