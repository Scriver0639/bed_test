document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
        .then(function (res) {
            return res.json().then(function (data) {
                return { status: res.status, data: data };
            });
        })
        .then(function (result) {
            if (result.status !== 200) {
                document.getElementById("errorMsg").textContent =
                    result.data.message;
                return;
            }

            localStorage.setItem("token", result.data.token);
            window.location.href = "home.html";
        })
        .catch(function (error) {
            console.error("Login error:", error);
        });
});
