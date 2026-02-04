document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    // Toggle visibility of logged-in/logged-out elements
    document.querySelectorAll(".logged-in")
        .forEach(el => el.style.display = token ? "block" : "none");

    document.querySelectorAll(".logged-out")
        .forEach(el => el.style.display = token ? "none" : "block");

    // Logout button handler
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "index.html";
        };
    }

    // Only redirect to login if:
    // 1. User is not logged in
    // 2. Current page is a protected page (not index, login, or register)
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const publicPages = ['index.html', 'login.html', 'register.html', ''];
    const isPublicPage = publicPages.includes(currentPage);

    if (!token && !isPublicPage) {
        window.location.href = "login.html";
    }
});