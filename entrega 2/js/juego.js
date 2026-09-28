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
//menu burger
const botonMenu = document.querySelector(".menu");
const menuLateral = document.querySelector("#menuLateral");
const iconoMenu = botonMenu.querySelector("i");

botonMenu.addEventListener("click", function() {

    menuLateral.classList.toggle("abierto");

    if (menuLateral.classList.contains("abierto")) {
        iconoMenu.classList.remove("fa-bars");
        iconoMenu.classList.add("fa-bars-staggered");
    } else {
        iconoMenu.classList.remove("fa-bars-staggered");
        iconoMenu.classList.add("fa-bars");
    }

});

    // 2. PANTALLA DE CARGA DEL JUEGO

    const pantallaCargaJuego = document.querySelector("#pantallaCargaJuego");
    const pantallaGame = document.querySelector("#pantallaJuego");
    const gameBarra = document.querySelector(".game-progreso");
    const gamePorcentaje = document.querySelector("#gamePorcentaje");


    if (gameBarra) {

        let progresoGame = 0;

        const intervaloGameBarra = setInterval(() => {

            progresoGame += 20;

            gameBarra.style.width = progresoGame + "%";

            if (gamePorcentaje) {
                gamePorcentaje.textContent = progresoGame + "%";
            }

            if (progresoGame >= 100) {

                clearInterval(intervaloGameBarra);

                setTimeout(() => {

                    if (pantallaCargaJuego) {
                        pantallaCargaJuego.style.display = "none";
                    }

                    if (pantallaGame) {
                        pantallaGame.style.display = "block";
                    }
                }, 500);
            }
        }, 1000);
    }


    // 3. FAVORITOS

    const botonesFavorito = document.querySelectorAll(".favorito");

    botonesFavorito.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const icono = this.querySelector("i");

            if (icono) {

                icono.classList.toggle("fa-regular");
                icono.classList.toggle("fa-solid");

            }
        });
    });


    // 4. CARGAR JUEGOS DESDE LA API

   const contenedorJuegos = document.getElementById("contenedor-juegos");

if (contenedorJuegos) {

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


    async function cargarJuegos() {

        let juegos;

        try {

            const response = await fetch(
                "https://vj.interfaces.jima.com.ar/api/v2"
            );

            if (!response.ok) {
                throw new Error("La API no respondió correctamente");
            }

            juegos = await response.json();

        } catch (error) {

            console.error("Error al obtener los juegos:", error);

            // Si falla la API, usamos los juegos hardcodeados
            juegos = juegosHardcodeados;
        }


        juegos.slice(0, 7).forEach(juego => {

            const card = document.createElement("div");

            card.classList.add("card-juego");

            card.innerHTML = `
                <img src="${juego.background_image}" alt="${juego.name}">

                <div class="overlay">

                    <h3>${juego.name}</h3>

                    <button class="btn-jugar">
                        Jugar
                    </button>

                    <button class="fav">
                        <span>Añadir a favoritos</span>
                        <i class="fa-regular fa-heart"></i>
                    </button>

                </div>
            `;

            contenedorJuegos.appendChild(card);


            // Favorito de la card
            const botonFavorito = card.querySelector(".fav");

            if (botonFavorito) {

                botonFavorito.addEventListener("click", function () {

                    const corazon = this.querySelector("i");

                    if (corazon) {

                        corazon.classList.toggle("fa-regular");
                        corazon.classList.toggle("fa-solid");

                    }

                });

            }

        });

    }


    cargarJuegos();
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

    // 6. MODAL COMPARTIR

    const botonAbrirCompartir = document.getElementById("abrirModalCompartir");
    const botonCerrarCompartir = document.getElementById("cerrarModal");
    const modalCompartir = document.getElementById("modalCompartir");


    if (botonAbrirCompartir && modalCompartir) {

        botonAbrirCompartir.addEventListener( "click", function () {

                modalCompartir.style.display = "flex";

            }
        );
    }


    if (botonCerrarCompartir && modalCompartir) {

        botonCerrarCompartir.addEventListener("click", function () {

                modalCompartir.style.display = "none";

            }
        );

    }

    // Cerrar haciendo click afuera
    if (modalCompartir) {

        modalCompartir.addEventListener("click", function (event) {

                if (event.target === modalCompartir) {

                    modalCompartir.style.display = "none";

                }
            }
        );
    }

    // 7. MODAL INSTRUCCIONES

    const botonAbrirInstrucciones = document.getElementById("abrirInstrucciones");
    const botonCerrarInstrucciones = document.getElementById("cerrarInstrucciones");
    const modalInstrucciones = document.getElementById("modalInstrucciones");


    if (botonAbrirInstrucciones && modalInstrucciones) {

        botonAbrirInstrucciones.addEventListener( "click", function () {

                modalInstrucciones.style.display = "flex";

            }
        );
    }


    if (botonCerrarInstrucciones && modalInstrucciones) {

        botonCerrarInstrucciones.addEventListener("click", function () {

                modalInstrucciones.style.display = "none";

            }
        );
    }


    if (modalInstrucciones) {

        modalInstrucciones.addEventListener("click", function (event) {

                if (event.target === modalInstrucciones) {

                    modalInstrucciones.style.display = "none";

                }

            }
        );

    }

    // 8. LIKES DE LOS COMENTARIOS

    const comentarios = document.querySelectorAll(".likes");

    comentarios.forEach(function (contenedorLikes) {

        const likes = contenedorLikes.querySelectorAll("i");


        likes.forEach(function (like) {

            like.addEventListener("click", function () {

                    // Si ya estaba seleccionado se deselecciona
                    if (this.classList.contains("activo")) {

                        this.classList.remove("activo");

                    } else {

                        // Quitar selección del otro
                        likes.forEach(function (icono) {

                            icono.classList.remove("activo");

                        });

                        // Activar seleccionado
                        this.classList.add("activo");

                    }

                }
            );

        });

    });

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
        document
            .querySelectorAll(".formulario")
            .forEach(function (form) {

                form.classList.remove("activo");

            });


        // Quitar activo de todas las pestañas
        document
            .querySelectorAll(".tab")
            .forEach(function (tab) {

                tab.classList.remove("activo");

            });


        // Mostrar formulario seleccionado
        const formularioSeleccionado =
            document.getElementById(formulario);


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

        modalIngreso.addEventListener(
            "click",
            function (event) {

                if (event.target === modalIngreso) {

                    cerrarModalIngreso();

                }

            }
        );

    }


    // ==========================================
    // 10. HEADER - LOGIN / LOGOUT
    // ==========================================

    const btnIngresar =
        document.getElementById("btnIngresar");

    const perfilUsuario =
        document.getElementById("perfilUsuario");

    const cerrarSesion =
        document.getElementById("cerrarSesion");


    // ==========================================
    // ACTUALIZAR HEADER
    // ==========================================

    function actualizarHeader() {

        const estaLogueado =
            localStorage.getItem("logueado") === "true";


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

        btnIngresar.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                abrirModalIngreso();

            }
        );

    }


    // ==========================================
    // FORMULARIO LOGIN
    // ==========================================

    const formularioLogin =
        document.getElementById("login");


if (formularioLogin) {

    formularioLogin.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            // Mostrar animación
            mostrarAnimacionExito();

            // Guardar sesión
            localStorage.setItem(
                "logueado",
                "true"
            );

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

        cerrarSesion.addEventListener(
            "click",
            function (event) {

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

    const transicion =
        document.getElementById("transicionExito");

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

            errorPassword.textContent =
                "Las contraseñas no coinciden.";

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

            btnCrearRegistro.style.transform =
                `rotate(${grados}deg)`;

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
