function cambiarFavorito(boton) {
    const icono = boton.querySelector("i");

    icono.classList.toggle("fa-regular");
    icono.classList.toggle("fa-solid");
}

let progreso = 0;

const barra = document.querySelector(".progreso");
const porcentaje = document.querySelector("#porcentaje");

const pantallaCarga = document.querySelector("#pantallaCarga");
const pantallaFinal = document.querySelector("#pantallaFinal");

const intervalo = setInterval(() => {
    progreso += 20;

    barra.style.width = progreso + "%";
    porcentaje.textContent = progreso + "%";

    if (progreso >= 100) {
        clearInterval(intervalo);

        setTimeout(() => {
            pantallaCarga.style.display = "none";
            pantallaFinal.style.display = "block";
        }, 500);
    }
}, 1000);


const favoritos = document.querySelectorAll(".favorito");

favoritos.forEach(boton => {
    boton.addEventListener("click", () => {
        const corazon = boton.querySelector("i");

        corazon.classList.toggle("fa-regular");
        corazon.classList.toggle("fa-solid");
    });
});
