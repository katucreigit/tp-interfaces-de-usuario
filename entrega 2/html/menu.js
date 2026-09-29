document.addEventListener("DOMContentLoaded", () => {
 // 1. PANTALLA DE CARGA PRINCIPAL   
    const loaderImg = document.querySelector("#loaderImg");
    const barra = document.querySelector(".progreso");
    const porcentaje = document.querySelector("#porcentaje");
    const pantallaCarga = document.querySelector("#pantallaCarga");
    const pantallaFinal = document.querySelector("#pantallaFinal");

    // Animación de latido
    if (loaderImg) {

        setInterval(() => {
            loaderImg.classList.toggle("latido");
        }, 400);

    }

    // Barra de carga
    if (barra) {

        let progresoMain = 0;

        const intervaloCarga = setInterval(() => {

            progresoMain += 20;
            barra.style.width = progresoMain + "%";

            if (porcentaje) {
                porcentaje.textContent = progresoMain + "%";
            }

            if (progresoMain >= 100) {

                clearInterval(intervaloCarga);
                setTimeout(() => {

                    if (pantallaCarga) {
                        pantallaCarga.style.display = "none";
                    }

                    if (pantallaFinal) {
                        pantallaFinal.style.display = "block";
                    }

                }, 500);
            }
        }, 500);
    }

const botonMenu = document.querySelector(".menu");
const menuLateral = document.querySelector("#menuLateral");

botonMenu.addEventListener("click", function() {
    menuLateral.classList.toggle("abierto");
});
const verCategorias = document.querySelector("#verCategorias");

verCategorias.addEventListener("click", function(e) {
    e.preventDefault();
    menuLateral.classList.add("abierto");
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


const juegosHardcodeados = [
    {
        name: "PacMan",
        background_image: "../img/pacman.jpeg"
    },
    {
        name: "Uno",
        background_image: "../img/uno.jpg"
    },
    {
        name: "Dominoes Classic",
        background_image: "../img/domino.jpeg"
    },
    {
        name: "Ludo King",
        background_image: "../img/ludo.jpeg"
    },
    {
        name: "Spider Solitarie",
        background_image: "../img/spidersolitarie.jpeg"
    },
    {
        name: "Monopoly",
        background_image: "../img/monopoly.jpeg"
    },
    {
        name: "Block Puzzle",
        background_image: "../img/blockpuzzle.jpeg"
    }
];


/* =========================================================
   CARGAR JUEGOS
   ========================================================= */

async function cargarJuegos() {

    let juegos;


    /* =====================================================
       API
       ===================================================== */

    try {

        const response = await fetch(
            "https://vj.interfaces.jima.com.ar/api/v2"
        );


        if (!response.ok) {

            throw new Error(
                "La API no respondió correctamente"
            );

        }


        juegos = await response.json();

        console.log(
            "Juegos cargados desde la API"
        );

    }


    /* =====================================================
       FALLBACK
       ===================================================== */

    catch (error) {

        console.error(
            "Error al obtener los juegos desde la API:",
            error
        );


        console.log(
            "Se utilizarán los juegos hardcodeados"
        );


        juegos = juegosHardcodeados;

    }


    /* =====================================================
       RECOMENDADAS
       ===================================================== */

    const cardsRecomendadas =
        document.querySelectorAll(
            ".recommended .card-recomendado"
        );


    cardsRecomendadas.forEach(
        (card, indice) => {

            const juego =
                juegos[indice % juegos.length];


            /* Imagen */

            const imagen =
                card.querySelector("img");


            if (imagen) {

                imagen.src =
                    juego.background_image_low_res ||
                    juego.background_image;


                imagen.alt =
                    juego.name;

            }


            /* Título original */

            const titulo =
                card.querySelector("h2");


            if (titulo) {

                titulo.textContent =
                    juego.name;

            }


            /* =================================================
               OVERLAY
               ================================================= */

            let overlay =
                card.querySelector(".overlay");


            if (!overlay) {

                overlay =
                    document.createElement("div");


                overlay.classList.add(
                    "overlay"
                );


                overlay.innerHTML = `
                    <h3>${juego.name}</h3>

                    <button class="btn-jugar">
                        Jugar
                    </button>

                    <button
                        class="fav tooltip-acento"
                        data-tooltip="Añadir a favoritos"
                    >
                        <span>Añadir a favoritos</span>
                        <i class="fa-regular fa-heart"></i>
                    </button>
                `;


                card.appendChild(
                    overlay
                );

            }


            /* =================================================
               FAVORITOS
               ================================================= */

            const botonFavorito =
                card.querySelector(".fav");


            if (botonFavorito) {

                botonFavorito.addEventListener(
                    "click",
                    function () {

                        const corazon =
                            this.querySelector("i");


                        if (corazon) {

                            corazon.classList.toggle(
                                "fa-regular"
                            );

                            corazon.classList.toggle(
                                "fa-solid"
                            );

                        }

                    }
                );

            }

        }
    );


    /* =====================================================
       RESTO DE LOS JUEGOS
       ===================================================== */

    const cards =
        document.querySelectorAll(
            ".game-category:not(.recommended) .card-juego"
        );


    cards.forEach(
        (card, indice) => {

            const juego =
                juegos[indice % juegos.length];


            /* Imagen */

            const imagen =
                card.querySelector("img");


            if (imagen) {

                imagen.src =
                    juego.background_image_low_res ||
                    juego.background_image;


                imagen.alt =
                    juego.name;

            }


            /* Título */

            const titulo =
                card.querySelector("h3");


            if (titulo) {

                titulo.textContent =
                    juego.name;

            }


            /* =================================================
               OVERLAY
               ================================================= */

            let overlay =
                card.querySelector(".overlay");


            if (!overlay) {

                overlay =
                    document.createElement("div");


                overlay.classList.add(
                    "overlay"
                );


                const esPago =
                    card.querySelector(".pago");


                const textoBoton =
                    esPago
                        ? "Comprar"
                        : "Jugar";


                overlay.innerHTML = `
                    <h3>${juego.name}</h3>

                    <button class="btn-jugar">
                        ${textoBoton}
                    </button>

                    <button
                        class="fav tooltip-acento"
                        data-tooltip="Añadir a favoritos"
                    >
                        <span>Añadir a favoritos</span>
                        <i class="fa-regular fa-heart"></i>
                    </button>
                `;


                card.appendChild(
                    overlay
                );

            }


            /* =================================================
               FAVORITOS
               ================================================= */

            const botonFavorito =
                card.querySelector(".fav");


            if (botonFavorito) {

                botonFavorito.addEventListener(
                    "click",
                    function () {

                        const corazon =
                            this.querySelector("i");


                        if (corazon) {

                            corazon.classList.toggle(
                                "fa-regular"
                            );

                            corazon.classList.toggle(
                                "fa-solid"
                            );

                        }

                    }
                );

            }


            /* =================================================
               JUEGOS PAGOS
               ================================================= */

            const esPago =
                card.querySelector(".pago");


            if (esPago) {

                const botonComprar =
                    overlay.querySelector(
                        ".btn-jugar"
                    );


                if (botonComprar) {

                    botonComprar.addEventListener(
                        "click",
                        function () {

                            if (!modalCompra) {
                                return;
                            }


                            /* Imagen */

                            modalImagen.src =
                                juego.background_image_low_res ||
                                juego.background_image;


                            modalImagen.alt =
                                juego.name;


                            /* Título */

                            modalTitulo.textContent =
                                juego.name;


                            /* Descripción */

                            const descripcion =
                                juego.description ||
                                "Breve descripción del juego";


                            modalDescripcion.textContent =
                                descripcion.length > 120
                                    ? descripcion.substring(
                                        0,
                                        120
                                    ) + "..."
                                    : descripcion;


                            /* Abrir modal */

                            modalCompra.classList.add(
                                "abierto"
                            );

                        }
                    );

                }

            }

        }
    );


    /* =====================================================
       INICIALIZAR CARRUSELES
       ===================================================== */

    inicializarCarruseles();

}


/* =========================================================
   EJECUTAR CARGA
   ========================================================= */

cargarJuegos();


/* =========================================================
   CARRUSELES
   ========================================================= */

function inicializarCarruseles() {


    /* =====================================================
       CARRUSEL RECOMENDADOS
       ===================================================== */

    const listaRecomendados =
        document.querySelector(
            ".recommended .game-list"
        );


    if (listaRecomendados) {

        let cardsRecomendadas =
            Array.from(
                listaRecomendados.querySelectorAll(
                    ".card-recomendado"
                )
            );


        const espacio = 12;


        /* Obtener ancho de card */

        function obtenerAnchoCard() {

            if (
                cardsRecomendadas.length === 0
            ) {

                return 0;

            }


            return cardsRecomendadas[0]
                .offsetWidth;

        }


        /* Actualizar posiciones */

        function actualizarPosiciones(
            animar = true
        ) {

            const cantidad =
                cardsRecomendadas.length;


            if (cantidad === 0) {
                return;
            }


            const centro =
                Math.floor(
                    cantidad / 2
                );


            const anchoCard =
                obtenerAnchoCard();


            const paso =
                anchoCard + espacio;


            cardsRecomendadas.forEach(
                (card, indice) => {

                    let posicion =
                        indice - centro;


                    if (
                        posicion >
                        cantidad / 2
                    ) {

                        posicion -= cantidad;

                    }


                    if (
                        posicion <
                        -cantidad / 2
                    ) {

                        posicion += cantidad;

                    }


                    const izquierda =
                        `calc(50% + ${
                            posicion * paso -
                            anchoCard / 2
                        }px)`;


                    if (!animar) {

                        card.style.transition =
                            "none";

                    } else {

                        card.style.transition =
                            "left 0.8s ease, " +
                            "transform 0.8s ease, " +
                            "opacity 0.8s ease, " +
                            "filter 0.8s ease";

                    }


                    card.style.left =
                        izquierda;


                    if (
                        posicion ===
                            -Math.floor(
                                cantidad / 2
                            ) ||

                        posicion ===
                            Math.floor(
                                cantidad / 2
                            )
                    ) {

                        card.classList.add(
                            "fondo"
                        );

                    } else {

                        card.classList.remove(
                            "fondo"
                        );

                    }

                }
            );

        }


        /* Rotar */

        function rotarRecomendados() {

            const primera =
                cardsRecomendadas.shift();


            cardsRecomendadas.push(
                primera
            );


            actualizarPosiciones(
                true
            );

        }


        /* Posición inicial */

        actualizarPosiciones(
            false
        );


        setTimeout(
            () => {

                actualizarPosiciones(
                    true
                );

            },
            50
        );


        /* Rotación automática */

        setInterval(
            rotarRecomendados,
            7000
        );

    }


    /* =====================================================
       CARRUSELES GRANDES
       ===================================================== */

    const carruselesGrandes =
        document.querySelectorAll(
            ".game-category .carousel"
        );


    carruselesGrandes.forEach(
        carousel => {

            const lista =
                carousel.querySelector(
                    ".game-list"
                );


            const botonIzquierda =
                carousel.querySelector(
                    ".carousel-arrow:first-child"
                );


            const botonDerecha =
                carousel.querySelector(
                    ".carousel-arrow:last-child"
                );


            const card =
                lista
                    ? lista.querySelector(
                        ".card-grande"
                    )
                    : null;


            if (
                !lista ||
                !card ||
                !botonIzquierda ||
                !botonDerecha
            ) {

                return;

            }


            const espacio = 12;


            const paso =
                card.offsetWidth +
                espacio;


            const cantidadMovimiento = 3;


            /* Derecha */

            botonDerecha.addEventListener(
                "click",
                function () {

                    lista.classList.add(
                        "animando"
                    );


                    lista.scrollBy({

                        left:
                            paso *
                            cantidadMovimiento,

                        behavior:
                            "smooth"

                    });


                    setTimeout(
                        () => {

                            lista.classList.remove(
                                "animando"
                            );

                        },
                        700
                    );

                }
            );


            /* Izquierda */

            botonIzquierda.addEventListener(
                "click",
                function () {

                    lista.classList.add(
                        "animando"
                    );


                    lista.scrollBy({

                        left:
                            -(paso *
                            cantidadMovimiento),

                        behavior:
                            "smooth"

                    });


                    setTimeout(
                        () => {

                            lista.classList.remove(
                                "animando"
                            );

                        },
                        700
                    );

                }
            );

        }
    );


    /* =====================================================
       CARRUSELES CHICAS
       ===================================================== */

    const carruselesChicas =
        document.querySelectorAll(
            ".game-category .game-list.chicas"
        );


    carruselesChicas.forEach(
        lista => {

            const carousel =
                lista.parentElement;


            const botonIzquierda =
                carousel.querySelector(
                    ".carousel-arrow:first-child"
                );


            const botonDerecha =
                carousel.querySelector(
                    ".carousel-arrow:last-child"
                );


            const card =
                lista.querySelector(
                    ".card-chica"
                );


            if (
                !card ||
                !botonIzquierda ||
                !botonDerecha
            ) {

                return;

            }


            const espacio = 25;


            const paso =
                card.offsetWidth +
                espacio;


            const cantidadMovimiento = 2;


            /* Derecha */

            botonDerecha.addEventListener(
                "click",
                function () {

                    lista.classList.add(
                        "animando"
                    );


                    lista.scrollBy({

                        left:
                            paso *
                            cantidadMovimiento,

                        behavior:
                            "smooth"

                    });


                    setTimeout(
                        () => {

                            lista.classList.remove(
                                "animando"
                            );

                        },
                        500
                    );

                }
            );


            /* Izquierda */

            botonIzquierda.addEventListener(
                "click",
                function () {

                    lista.classList.add(
                        "animando"
                    );


                    lista.scrollBy({

                        left:
                            -(paso *
                            cantidadMovimiento),

                        behavior:
                            "smooth"

                    });


                    setTimeout(
                        () => {

                            lista.classList.remove(
                                "animando"
                            );

                        },
                        500
                    );

                }
            );

        }
    );

}
 // 5. MENÚ DE AJUSTES

    const botonAjustes = document.getElementById("boton-ajustes");
    const menuAjustes = document.querySelector(".menu-ajustes");


    if (botonAjustes && menuAjustes) {

        botonAjustes.addEventListener( "click",function (event) {

                event.stopPropagation();

                menuAjustes.classList.toggle("abierto");

            }
        );


        menuAjustes.addEventListener( "click", function (event) {

                event.stopPropagation();

            }
        );


        document.addEventListener( "click", function () {

                menuAjustes.classList.remove("abierto");

            }
        );
    }
    // 9. MODAL DE INGRESO

    const modalIngreso = document.getElementById("modalIngreso");
    const modalContenido = document.getElementById("modal-contenido");

    // Abrir modal
    function abrirModalIngreso() {

        if (modalIngreso) {

            modalIngreso.style.display = "flex";

        }

    }

    // Cerrar modal
    function cerrarModalIngreso() {

        if (modalIngreso) {

            modalIngreso.style.display = "none";

        }

    }

    // Hacer las funciones accesibles desde HTML
    window.abrirModal = abrirModalIngreso;
    window.cerrarModal = cerrarModalIngreso;


    // ==========================================
    // CAMBIAR ENTRE LOGIN Y REGISTRO
    // ==========================================

    window.mostrarFormulario = function (
        formulario,
        boton
    ) {

        // Ocultar todos los formularios
        document.querySelectorAll(".formulario").forEach(function (form) {

                form.classList.remove("activo");

            });


        // Quitar activo de todas las pestañas
        document.querySelectorAll(".tab").forEach(function (tab) {

                tab.classList.remove("activo");

            });


        // Mostrar formulario seleccionado
        const formularioSeleccionado = document.getElementById(formulario);


        if (formularioSeleccionado) {

            formularioSeleccionado.classList.add("activo");

        }


        // Activar pestaña
        if (boton) {

            boton.classList.add("activo");

        }


        // Cambiar tamaño del modal
        if (modalContenido) {

            modalContenido.classList.toggle(
                "registro-grande",
                formulario === "registro"
            );

        }

    };


    // ==========================================
    // CERRAR MODAL HACIENDO CLICK AFUERA
    // ==========================================

    if (modalIngreso) {

        modalIngreso.addEventListener("click",function (event) {

                if (event.target === modalIngreso) {

                    cerrarModalIngreso();

                }

            }
        );

    }


    // ==========================================
    // 10. HEADER - LOGIN / LOGOUT
    // ==========================================

    const btnIngresar = document.getElementById("btnIngresar");
    const perfilUsuario = document.getElementById("perfilUsuario");
    const cerrarSesion = document.getElementById("cerrarSesion");


    // ==========================================
    // ACTUALIZAR HEADER
    // ==========================================

    function actualizarHeader() {

        const estaLogueado = localStorage.getItem("logueado") === "true";


        // BOTÓN INGRESAR
        if (btnIngresar) {

            if (estaLogueado) {

                btnIngresar.style.display = "none";

            } else {

                btnIngresar.style.display = "flex";

            }

        }


        // AVATAR
        if (perfilUsuario) {

            if (estaLogueado) {

                perfilUsuario.style.display = "flex";

            } else {

                perfilUsuario.style.display = "none";

            }

        }

    }


    // ==========================================
    // BOTÓN INGRESAR
    // ==========================================

    if (btnIngresar) {

        btnIngresar.addEventListener("click",function (event) {

                event.preventDefault();

                abrirModalIngreso();

            }
        );

    }


    // ==========================================
    // FORMULARIO LOGIN
    // ==========================================

    const formularioLogin = document.getElementById("login");


	if (formularioLogin) {

		formularioLogin.addEventListener("submit",function (event) {

		        event.preventDefault();

		        // Mostrar animación
		        mostrarAnimacionExito();

		        // Guardar sesión
		        localStorage.setItem("logueado", "true");

		        // Actualizar header
		        actualizarHeader();

		        // Cerrar modal después de la animación
		        setTimeout(function () {

		            cerrarModalIngreso();

		        }, 1800);

		    }
		);

	}


    // ==========================================
    // CERRAR SESIÓN
    // ==========================================

    if (cerrarSesion) {

        cerrarSesion.addEventListener("click",function (event) {

                event.preventDefault();

                // Eliminar sesión
                localStorage.removeItem("logueado");


                // Actualizar header
                actualizarHeader();

            }
        );

    }


    // ==========================================
    // COMPROBAR SESIÓN AL CARGAR
    // ==========================================

    actualizarHeader();
	// ==========================================
	// ANIMACIÓN DE ÉXITO
	// ==========================================

	function mostrarAnimacionExito() {

		const transicion = document.getElementById("transicionExito");

		if (!transicion) return;

		transicion.classList.add("activa");

		setTimeout(function () {

		    transicion.classList.remove("activa");

		}, 1800);
	}
	const formularioRegistro = document.getElementById("registro");
	const btnCrearRegistro = document.getElementById("btnCrearRegistro");
	const password = document.getElementById("password-register");
	const repassword = document.getElementById("repassword-register");
	const errorPassword = document.getElementById("error-password");

	let giro;
	let grados = 0;

	if (formularioRegistro && password && repassword && errorPassword) {

		formularioRegistro.addEventListener("submit", function (event) {

		    event.preventDefault();

		    if (password.value !== repassword.value) {

		        password.classList.add("input-error");
		        repassword.classList.add("input-error");

		        errorPassword.textContent = "Las contraseñas no coinciden.";

		        return;
		    }

		    password.classList.remove("input-error");
		    repassword.classList.remove("input-error");

		    errorPassword.textContent = "";

		    // Animación de carga
		    btnCrearRegistro.classList.add("cargando");

		    grados = 0;

		    giro = setInterval(function () {

		        grados += 10;

		        btnCrearRegistro.style.transform = `rotate(${grados}deg)`;

		    }, 30);


		    // Después de 2 segundos → mostrar ✓
		    setTimeout(function () {

		        clearInterval(giro);

		        btnCrearRegistro.classList.remove("cargando");
		        btnCrearRegistro.classList.add("exito");

		        btnCrearRegistro.style.transform = "rotate(0deg)";
		        btnCrearRegistro.textContent = "✓";


		        // Después de mostrar el ✓
		        setTimeout(function () {

		            // Mostrar portal
		            mostrarAnimacionExito();

		            // Guardar sesión
		            localStorage.setItem("logueado", "true");

		            // Actualizar header
		            actualizarHeader();


		            // Volver a dejar el botón normal
		            setTimeout(function () {

		                btnCrearRegistro.classList.remove("exito");
		                btnCrearRegistro.textContent = "Crear cuenta";
		                btnCrearRegistro.style.transform = "rotate(0deg)";

		                // Cerrar modal
		                cerrarModalIngreso();

		            }, 1800);

		        }, 1200);

		    }, 2000);

		});

	}
});
