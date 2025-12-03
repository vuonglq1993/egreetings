document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/layout/login.html";
});
document.getElementById("sidebar-container").innerHTML =
    await (await fetch("../layout/sidebar.html")).text();

document.getElementById("topbar-container").innerHTML =
    await (await fetch("../layout/topbar.html")).text();
