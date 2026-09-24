const botonMenu = document.querySelector(".menu");
const menuLateral = document.querySelector("#menuLateral");

botonMenu.addEventListener("click", function() {
    menuLateral.classList.toggle("abierto");
});