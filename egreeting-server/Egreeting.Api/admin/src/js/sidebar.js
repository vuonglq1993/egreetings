const btnToggle = document.getElementById("btnToggle");
const sidebar = document.getElementById("sidebar");
const content = document.querySelector(".content");

btnToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    content.classList.toggle("full");
});
