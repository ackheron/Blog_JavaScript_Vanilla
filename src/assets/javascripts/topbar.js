console.log("hello from topbar");

const iconMobile = document.querySelector(".header-menu-icon");

iconMobile.addEventListener("click", (event) => {
    event.preventDefault();
    console.log(event);
});
