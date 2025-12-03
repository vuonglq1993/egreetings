// api.js

// Hàm gọi GET API kèm token
export async function apiGet(url) {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5288/" + url, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText.substring(0, 100)}`);
    }
    
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return res.json();
    } else {
        const text = await res.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
    }
}

// Hàm gọi POST API
export async function apiPost(url, data) {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5288/" + url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    });
    
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText.substring(0, 100)}`);
    }
    
    // Kiểm tra nếu response rỗng (204 No Content)
    if (res.status === 204) {
        return { success: true };
    }
    
    // Đọc response text trước
    const text = await res.text();
    
    // Nếu response rỗng, trả về success
    if (!text || text.trim() === "") {
        return { success: true };
    }
    
    // Thử parse JSON
    try {
        return JSON.parse(text);
    } catch (e) {
        // Nếu không parse được JSON, trả về success
        return { success: true };
    }
}

// Hàm login (gọi API auth/login)
export async function login(email, password) {
    const res = await fetch("http://localhost:5288/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    return res.json();
}

// Kiểm tra role Admin
export function checkAdmin() {
    const role = localStorage.getItem("role");
    return role && role.toLowerCase() === "admin";
}

// Logout
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/layout/login.html";
}

export async function getCount(entity) {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5288/api/${entity}/count`, {
        headers: { "Authorization": "Bearer " + token }
    });
    return res.json();
}
// Hàm gọi PUT API
export async function apiPut(url, data) {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5288/" + url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    });
    
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText.substring(0, 100)}`);
    }
    
    // Kiểm tra nếu response rỗng (204 No Content)
    if (res.status === 204) {
        return { success: true };
    }
    
    // Đọc response text trước
    const text = await res.text();
    
    // Nếu response rỗng, trả về success
    if (!text || text.trim() === "") {
        return { success: true };
    }
    
    // Thử parse JSON
    try {
        return JSON.parse(text);
    } catch (e) {
        // Nếu không parse được JSON, trả về success
        return { success: true };
    }
}

// Hàm gọi DELETE API
export async function apiDelete(url) {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5288/" + url, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText.substring(0, 100)}`);
    }
    
    // Kiểm tra nếu response rỗng (204 No Content)
    if (res.status === 204) {
        return { success: true };
    }
    
    // Đọc response text trước
    const text = await res.text();
    
    // Nếu response rỗng, trả về success
    if (!text || text.trim() === "") {
        return { success: true };
    }
    
    // Thử parse JSON
    try {
        return JSON.parse(text);
    } catch (e) {
        // Nếu không parse được JSON, trả về success
        return { success: true };
    }
}



async function loadDashboardCounts() {
    const user = await getCount("users");
    document.getElementById("userCount").textContent = user.total;

    const category = await getCount("categories");
    document.getElementById("categoryCount").textContent = category.total;

    const template = await getCount("templates");
    document.getElementById("templateCount").textContent = template.total;

    const transaction = await getCount("transactions");
    document.getElementById("transactionCount").textContent = transaction.total;

    const packageCount = await getCount("packages");
    document.getElementById("packageCount").textContent = packageCount.total;

    const subscription = await getCount("subscriptions");
    document.getElementById("subscriptionCount").textContent = subscription.total;

    const feedback = await getCount("feedbacks");
    document.getElementById("feedbackCount").textContent = feedback.total;

    const report = await getCount("reports");
    document.getElementById("reportCount").textContent = report.total;
}

loadDashboardCounts();
