const botonMenu = document.querySelector(".menu");
const menuLateral = document.querySelector("#menuLateral");

botonMenu.addEventListener("click", function() {
    menuLateral.classList.toggle("abierto");
});

/* API DE JUEGOS */

fetch('https://vj.interfaces.jima.com.ar/api/v2')
.then(response => response.json())
.then(juegos => {

    const secciones = document.querySelectorAll(".game-category");

    let indiceJuego = 0;

    secciones.forEach(seccion => {

        const cards = seccion.querySelectorAll(".card-juego");

        cards.forEach(card => {

            const juego = juegos[indiceJuego % juegos.length];

            const imagen = card.querySelector("img");

            imagen.src = juego.background_image_low_res;
            imagen.alt = juego.name;

            const overlay = document.createElement("div");

            overlay.classList.add("overlay");

            const esPago = card.querySelector(".pago");

            const textoBoton = esPago ? "Comprar" : "Jugar";

            overlay.innerHTML = `
                <h3>${juego.name}</h3>

                <button class="btn-jugar">
                    ${textoBoton}
                </button>

                <button class="fav tooltip-acento"
                    data-tooltip="Añadir a favoritos">

                    <span>Añadir a favoritos</span>

                    <i class="fa-regular fa-heart"></i>

                </button>
            `;

            card.appendChild(overlay);

            const botonFavorito = card.querySelector(".fav");

            botonFavorito.addEventListener("click", function() {

                const corazon = this.querySelector("i");

                corazon.classList.toggle("fa-regular");
                corazon.classList.toggle("fa-solid");

            });

            indiceJuego++;

        });

    });

})
.catch(error => {
    console.error("Error al obtener los juegos:", error);
});

/* RECOMENDADOS */
const listaRecomendados = document.querySelector(".recommended .game-list");

let cardsRecomendadas = Array.from(
    listaRecomendados.querySelectorAll(".card-recomendado")
);

const espacio = 12;

function obtenerAnchoCard() {
    return cardsRecomendadas[0].offsetWidth;
}

function actualizarPosiciones(animar = true) {
    const cantidad = cardsRecomendadas.length;
    const centro = Math.floor(cantidad / 2);

    const anchoCard = obtenerAnchoCard();
    const paso = anchoCard + espacio;

    cardsRecomendadas.forEach((card, indice) => {
        let posicion = indice - centro;

        if (posicion > cantidad / 2) {
            posicion -= cantidad;
        }

        if (posicion < -cantidad / 2) {
            posicion += cantidad;
        }

        const izquierda = `calc(50% + ${posicion * paso - anchoCard / 2}px)`;

        if (!animar) {
            card.style.transition = "none";
        } else {
            card.style.transition =
                "left 0.8s ease, transform 0.8s ease, opacity 0.8s ease, filter 0.8s ease";
        }

        card.style.left = izquierda;

        if (
            posicion === -Math.floor(cantidad / 2) ||
            posicion === Math.floor(cantidad / 2)
        ) {
            card.classList.add("fondo");
        } else {
            card.classList.remove("fondo");
        }
    });
}

function rotarRecomendados() {
    const primera = cardsRecomendadas.shift();

    cardsRecomendadas.push(primera);

    actualizarPosiciones(true);
}

actualizarPosiciones(false);

setTimeout(() => {
    actualizarPosiciones(true);
}, 50);

setInterval(rotarRecomendados, 7000);

/* CARRUSELES GRANDES */

const carruselesGrandes = document.querySelectorAll(
    ".game-category .carousel"
);

carruselesGrandes.forEach(carousel => {

    const lista = carousel.querySelector(".game-list");
    const botonIzquierda = carousel.querySelector(".carousel-arrow:first-child");
    const botonDerecha = carousel.querySelector(".carousel-arrow:last-child");

    const card = lista.querySelector(".card-grande");

    if (!card) return;

    const espacio = 12;
    const paso = card.offsetWidth + espacio;
    const cantidadMovimiento = 3;

    botonDerecha.addEventListener("click", function() {

        lista.classList.add("animando");

        lista.scrollBy({
            left: paso * cantidadMovimiento,
            behavior: "smooth"
        });

        setTimeout(() => {
            lista.classList.remove("animando");
        }, 500);

    });

    botonIzquierda.addEventListener("click", function() {

        lista.classList.add("animando");

        lista.scrollBy({
            left: -(paso * cantidadMovimiento),
            behavior: "smooth"
        });

        setTimeout(() => {
            lista.classList.remove("animando");
        }, 500);

    });

});

/* CARRUSELES CHICAS */

const carruselesChicas = document.querySelectorAll(
    ".game-category .game-list.chicas"
);

carruselesChicas.forEach(lista => {

    const carousel = lista.parentElement;

    const botonIzquierda =
        carousel.querySelector(".carousel-arrow:first-child");

    const botonDerecha =
        carousel.querySelector(".carousel-arrow:last-child");

    const card = lista.querySelector(".card-chica");

    if (!card) return;

    const espacio = 25;
    const paso = card.offsetWidth + espacio;
    const cantidadMovimiento = 2;

    botonDerecha.addEventListener("click", function() {

        lista.classList.add("animando");

        lista.scrollBy({
            left: paso * cantidadMovimiento,
            behavior: "smooth"
        });

        setTimeout(() => {
            lista.classList.remove("animando");
        }, 500);

    });

    botonIzquierda.addEventListener("click", function() {

        lista.classList.add("animando");

        lista.scrollBy({
            left: -(paso * cantidadMovimiento),
            behavior: "smooth"
        });

        setTimeout(() => {
            lista.classList.remove("animando");
        }, 500);

    });

});