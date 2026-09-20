function cambiarFavorito(boton) {
    const icono = boton.querySelector("i");

    icono.classList.toggle("fa-regular");
    icono.classList.toggle("fa-solid");
}
