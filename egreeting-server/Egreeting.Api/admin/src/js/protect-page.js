const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "Admin") {
    window.location.href = "/layout/login.html";
}
