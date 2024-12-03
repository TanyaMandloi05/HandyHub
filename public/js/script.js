let sideMenubar = document.querySelector(".hamburger-menu");
let arrow = document.querySelector(".arrow");
let categorySidebar = document.querySelector(".category-sidebar");

sideMenubar.addEventListener("click", () => {
    categorySidebar.classList.toggle("showSidebar");
});

arrow.addEventListener("click", () => {
    categorySidebar.classList.toggle("showSidebar");
});


