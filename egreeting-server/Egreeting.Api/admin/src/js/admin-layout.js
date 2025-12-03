export async function loadAdminLayout() {
try {
// Lấy layout từ file index.html
const res = await fetch('../layout/index.html');
const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Lấy sidebar và topbar
    const sidebar = doc.querySelector(".sidebar");
    const topbar = doc.querySelector("nav");

    if (!sidebar || !topbar) {
        console.error("Không tìm thấy layout trong index.html!");
        return;
    }

    // Chèn sidebar vào container
    const sidebarContainer = document.getElementById("sidebar-container");
    sidebarContainer.innerHTML = "";
    const sidebarClone = sidebar.cloneNode(true);
    sidebarContainer.appendChild(sidebarClone);

    // Chèn topbar vào container
    const topbarContainer = document.getElementById("topbar-container");
    topbarContainer.innerHTML = "";
    const topbarClone = topbar.cloneNode(true);
    topbarContainer.appendChild(topbarClone);

    // Gắn sự kiện logout trên topbarClone
    const logoutBtn = topbarClone.querySelector("#logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/layout/login.html";
        });
    }

    // Highlight menu active
    highlightActiveMenu(sidebarClone);

    // Toggle sidebar responsive
    initSidebarToggle(sidebarClone);

} catch (err) {
    console.error("Lỗi khi load admin layout:", err);
}


}

// Highlight menu active dựa trên sidebar clone
function highlightActiveMenu(sidebarEl) {
const current = window.location.pathname.split("/").pop();
sidebarEl.querySelectorAll("a").forEach(a => {
const link = a.getAttribute("href")?.split("/").pop();
if (link === current) {
a.classList.add("active");
} else {
a.classList.remove("active");
}
});
}

// Toggle sidebar responsive
function initSidebarToggle(sidebarEl) {
const toggleBtn = document.querySelector(".sidebar-toggle");
const contentEl = document.querySelector(".content");


if (toggleBtn && sidebarEl) {
    toggleBtn.addEventListener("click", () => {
        sidebarEl.classList.toggle("collapsed");
        if (contentEl) contentEl.classList.toggle("collapsed");
    });
}


}
