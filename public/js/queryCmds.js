const currentUrl = "http://localhost:3000"; // Or whatever your port is

//=====================================================================================
// FETCH METHOD
// This function uses the fetch API to make a request to the server.
//=====================================================================================
function fetchMethod(endpoint, callback, method = "GET", data = null, token = null) {
    const url = currentUrl + endpoint;

    // Auto-pull token if not explicitly passed
    if (!token) {
        token = localStorage.getItem("token");
    }

    const headers = {};

    if (data) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const options = {
        method: method.toUpperCase(),
        headers
    };

    if (method.toUpperCase() !== "GET" && data !== null) {
        options.body = JSON.stringify(data);
    }

    fetch(url, options)
        .then(response => {
            // 🔐 JWT expired / invalid
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = "login.html";
                return;
            }

            if (response.status === 204) {
                callback(response.status, {});
            } else {
                response.json().then(data => callback(response.status, data));
            }
        })
        .catch(error =>
            console.error(`Error from ${method} ${url}:`, error)
        );
}

