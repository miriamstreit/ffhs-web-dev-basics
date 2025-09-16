const mql = window.matchMedia("(min-width: 1080px)");
const mobileNav = document.getElementById("mobile-navigation");
const mobileNavBarButton = document.getElementById("mobileNavBarButton");

mql.addEventListener("change", resetMobileNav)
mobileNavBarButton.addEventListener("click", toggleMenu);

function toggleMenu(){
    if(mobileNav.style.display !== "block") {
        mobileNav.style.display = "block";
    } else {
        mobileNav.style.display = "none";
    }
}

function resetMobileNav(mql) {
    if (mql.matches) { // If media query matches
        mobileNav.style.display = "none";
    }
}