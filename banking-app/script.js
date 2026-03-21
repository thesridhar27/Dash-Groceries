const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

// Toggle Password
if (togglePassword) {
    togglePassword.addEventListener("click", () => {
        password.type = password.type === "password" ? "text" : "password";
    });
}

// Login Logic
const form = document.getElementById("loginForm");

if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const pass = document.getElementById("password").value;
        const errorMsg = document.getElementById("errorMsg");

        if (username === "admin" && pass === "1234") {
            // Save login state
            localStorage.setItem("isLoggedIn", "true");

            // Redirect to dashboard
            window.location.href = "dashboard.html";
        } else {
            errorMsg.textContent = "Invalid Username or Password ❌";
        }
    });
}

// Protect Dashboard Page
if (window.location.pathname.includes("dashboard.html")) {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
        window.location.href = "index.html";
    }
}

// Logout
function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "index.html";
}