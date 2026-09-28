const botonMenu = document.querySelector(".menu");
const menuLateral = document.querySelector("#menuLateral");

botonMenu.addEventListener("click", function() {
    menuLateral.classList.toggle("abierto");
});

const modalCompra = document.querySelector("#modalCompra");
const modalImagen = document.querySelector("#modalImagen");
const modalTitulo = document.querySelector("#modalTitulo");
const modalDescripcion = document.querySelector("#modalDescripcion");
const btnCancelar = document.querySelector("#btnCancelar");

btnCancelar.addEventListener("click", function() {
    modalCompra.classList.remove("abierto");
});

const selectorPago = document.querySelector("#selectorPago");
const metodosPago = document.querySelector("#metodosPago");

selectorPago.addEventListener("click", function() {
    modalCompra.classList.add("metodo-abierto");
    metodosPago.classList.add("abierto");
});

const metodos = document.querySelectorAll(".metodo-pago");

const compraExitosa = document.querySelector("#compraExitosa");

metodos.forEach(metodo => {

    metodo.addEventListener("click", function() {

        metodosPago.classList.remove("abierto");
        modalCompra.classList.remove("metodo-abierto");

        const contenidoCompra =
            modalCompra.querySelector(".modal-compra");

        contenidoCompra.style.opacity = "0";

        setTimeout(() => {

            contenidoCompra.style.display = "none";

            compraExitosa.classList.add("abierto");

        }, 500);

        setTimeout(() => {

            compraExitosa.classList.remove("abierto");

        }, 2500);

        setTimeout(() => {

            modalCompra.classList.remove("abierto");

            contenidoCompra.style.display = "block";
            contenidoCompra.style.opacity = "1";

            selectorPago.innerHTML = `
                Elegir método de pago
                <i class="fa-solid fa-chevron-down"></i>
            `;

        }, 3000);

    });

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

            if (esPago) {

                const botonComprar = overlay.querySelector(".btn-jugar");
            
                botonComprar.addEventListener("click", function() {
            
                    modalImagen.src = juego.background_image_low_res;
                    modalImagen.alt = juego.name;
            
                    modalTitulo.textContent = juego.name;
            
                    const descripcion = juego.description || "Breve descripción del juego";
                    modalDescripcion.textContent =
                        descripcion.length > 120
                            ? descripcion.substring(0, 120) + "..."
                            : descripcion;
            
                    modalCompra.classList.add("abierto");
            
                });
            }

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
        }, 700);

    });

    botonIzquierda.addEventListener("click", function() {

        lista.classList.add("animando");

        lista.scrollBy({
            left: -(paso * cantidadMovimiento),
            behavior: "smooth"
        });

        setTimeout(() => {
            lista.classList.remove("animando");
        }, 700);

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