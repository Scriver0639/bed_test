document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const msg = document.getElementById("msg");

    // --- UI EFFECTS ---
    // Handle the icon animations previously in the HTML script tag
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('focus', function () {
            const icon = this.parentElement.querySelector('.input-icon');
            if (icon) {
                icon.style.transform = 'translateY(-50%) scale(1.2)';
                icon.style.color = 'var(--neon-blue)';
            }
        });

        input.addEventListener('blur', function () {
            const icon = this.parentElement.querySelector('.input-icon');
            if (icon) {
                icon.style.transform = 'translateY(-50%) scale(1)';
                icon.style.color = 'var(--neon-green)';
            }
        });
    });

    // --- FORM SUBMISSION ---
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            // 1. Register User
            fetch("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })
                .then(res => res.json().then(data => ({ status: res.status, data })))
                .then(result => {
                    if (result.status !== 201) {
                        msg.textContent = result.data.message || "Registration failed";
                        msg.className = "text-danger";
                        throw new Error("Registration failed");
                    }

                    // Registration success
                    msg.textContent = "Registered successfully! Logging you in...";
                    msg.className = "text-success";

                    // 2. Auto-login
                    return fetch("http://localhost:3000/users/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, password })
                    });
                })
                .then(res => res ? res.json().then(data => ({ status: res.status, data })) : null)
                .then(result => {
                    if (!result) return;

                    if (result.status !== 200) {
                        msg.textContent = "Login failed after registration";
                        msg.className = "text-danger";
                        return;
                    }

                    // 💾 Save login info
                    localStorage.setItem("token", result.data.token);
                    localStorage.setItem("user", JSON.stringify(result.data.user));

                    // 🚀 Go to home
                    setTimeout(() => {
                        window.location.href = "home.html";
                    }, 1500); // Slight delay so user sees the success message
                })
                .catch(error => {
                    console.error("Register/Login error:", error);
                    if (msg.className !== "text-danger") {
                        msg.textContent = "Something went wrong. Is the server running?";
                        msg.className = "text-danger";
                    }
                });
        });
    }
});