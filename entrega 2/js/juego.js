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


    
fetch('https://vj.interfaces.jima.com.ar/api/v2')
    .then(response => response.json())
    .then(juegos => {

        const contenedor = document.getElementById('contenedor-juegos');

        juegos.forEach(juego => {

            const card = document.createElement('div');
            card.classList.add('card-juego');

            card.innerHTML = `
                <img src="${juego.background_image_low_res}" alt="${juego.name}">

                <div class="overlay">
                    <h3>${juego.name}</h3>

                    <button class="btn-jugar">Jugar</button>

                    <button class="fav tooltip-acento"
                            data-tooltip="Añadir a favoritos">
                        <span>Añadir a favoritos</span>
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
            `;

            contenedor.appendChild(card);

            const botonFavorito = card.querySelector(".favorito");

            botonFavorito.addEventListener("click", function() {
                const corazon = this.querySelector("i");

                corazon.classList.toggle("fa-regular");
                corazon.classList.toggle("fa-solid");
            });

        });

    })
    .catch(error => {
        console.error('Error al obtener los juegos:', error);
    });
    
const botonAjustes = document.getElementById("boton-ajustes");
const menuAjustes = document.querySelector(".menu-ajustes");

botonAjustes.addEventListener("click", function(event) {
    event.stopPropagation();

    menuAjustes.classList.toggle("abierto");
});

menuAjustes.addEventListener("click", function(event) {
    event.stopPropagation();
});

document.addEventListener("click", function() {
    menuAjustes.classList.remove("abierto");
});

