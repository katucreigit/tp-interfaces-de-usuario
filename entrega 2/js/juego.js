document.addEventListener("DOMContentLoaded", () => {

    // PANTALLA DE CARGA
    const loaderImg = document.querySelector("#loaderImg"), barra = document.querySelector(".progreso"),
        porcentaje = document.querySelector("#porcentaje"), pantallaCarga = document.querySelector("#pantallaCarga"),
        pantallaFinal = document.querySelector("#pantallaFinal");

    if (loaderImg) setInterval(() => loaderImg.classList.toggle("latido"), 400);

    if (barra) {
        let progresoMain = 0;
        const intervaloCarga = setInterval(() => {
            progresoMain += 20;
            barra.style.width = progresoMain + "%";
            if (porcentaje) porcentaje.textContent = progresoMain + "%";
            if (progresoMain >= 100) {
                clearInterval(intervaloCarga);
                setTimeout(() => {
                    if (pantallaCarga) pantallaCarga.style.display = "none";
                    if (pantallaFinal) pantallaFinal.style.display = "block";
                }, 500);
            }
        }, 500);
    }

    // MENÚ BURGER
    const botonMenu = document.querySelector(".menu"), menuLateral = document.querySelector("#menuLateral");

    if (botonMenu && menuLateral) {
        const iconoMenu = botonMenu.querySelector("i");
        botonMenu.addEventListener("click", () => {
            menuLateral.classList.toggle("abierto");
            if (iconoMenu) {
                iconoMenu.classList.toggle("fa-bars-staggered", menuLateral.classList.contains("abierto"));
                iconoMenu.classList.toggle("fa-bars", !menuLateral.classList.contains("abierto"));
            }
        });
    }

    // PANTALLA DE CARGA DEL JUEGO
    const pantallaCargaJuego = document.querySelector("#pantallaCargaJuego"),
        pantallaGame = document.querySelector("#pantallaJuego"),
        gameBarra = document.querySelector(".game-progreso"),
        gamePorcentaje = document.querySelector("#gamePorcentaje");

    if (gameBarra) {
        let progresoGame = 0;
        const intervaloGameBarra = setInterval(() => {
            progresoGame += 20;
            gameBarra.style.width = progresoGame + "%";
            if (gamePorcentaje) gamePorcentaje.textContent = progresoGame + "%";

            if (progresoGame >= 100) {
                clearInterval(intervaloGameBarra);
                setTimeout(() => {
                    if (pantallaCargaJuego) pantallaCargaJuego.style.display = "none";
                    if (pantallaGame) pantallaGame.style.display = "block";
                }, 500);
            }
        }, 1000);
    }

    // FAVORITOS
    document.querySelectorAll(".favorito").forEach(boton => {
        boton.addEventListener("click", function () {
            const icono = this.querySelector("i");
            if (icono) {
                icono.classList.toggle("fa-regular");
                icono.classList.toggle("fa-solid");
            }
        });
    });

    // CARGAR JUEGOS
    const contenedorJuegos = document.getElementById("contenedor-juegos");

    if (contenedorJuegos) {
        const juegosHardcodeados = [
            {
                name:"PacMan",
                background_image:"../img/pacman.jpeg"
            },
            {
                name:"Uno",
                background_image:"../img/uno.jpg"
            },
            {
                name:"Dominoes Classic",
                background_image:"../img/domino.jpeg"
            },
            {
                name:"Ludo King",
                background_image:"../img/ludo.jpeg"
            },
            {
                name:"Spider Solitarie",
                background_image:"../img/spidersolitarie.jpeg"
            },
            {
                name:"Monopoly",
                background_image:"../img/monopoly.jpeg"
            },
            {
                name:"Block Puzzle",
                background_image:"../img/blockpuzzle.jpeg"
            }
        ];

        async function cargarJuegos() {
            let juegos;
            try {
                const response = await fetch("https://vj.interfaces.jima.com.ar/api/v2");
                juegos = await response.json();
            } catch (error) {
                juegos = juegosHardcodeados;
            }

            juegos.slice(0, 7).forEach(juego => {
                const card = document.createElement("div");
                card.classList.add("card-juego");
                card.innerHTML = `
                    <img src="${juego.background_image}" alt="${juego.name}">
                    <div class="overlay">
                        <h3>${juego.name}</h3>
                        <button class="btn-jugar">Jugar</button>
                        <button class="fav"><span>Añadir a favoritos</span><i class="fa-regular fa-heart"></i></button>
                    </div>`;

                contenedorJuegos.appendChild(card);

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

    // MENÚ DE AJUSTES
    const botonAjustes = document.getElementById("boton-ajustes"),
        menuAjustes = document.querySelector(".menu-ajustes");

    if (botonAjustes && menuAjustes) {
        botonAjustes.addEventListener("click", event => {
            event.stopPropagation();
            menuAjustes.classList.toggle("abierto");
        });

        menuAjustes.addEventListener("click", event => event.stopPropagation());
        document.addEventListener("click", () => menuAjustes.classList.remove("abierto"));
    }

    // MODAL COMPARTIR
    const botonAbrirCompartir = document.getElementById("abrirModalCompartir"),
        botonCerrarCompartir = document.getElementById("cerrarModal"),
        modalCompartir = document.getElementById("modalCompartir");

    if (botonAbrirCompartir && modalCompartir)
        botonAbrirCompartir.addEventListener("click", () => modalCompartir.style.display = "flex");

    if (botonCerrarCompartir && modalCompartir)
        botonCerrarCompartir.addEventListener("click", () => modalCompartir.style.display = "none");

    if (modalCompartir) {
        modalCompartir.addEventListener("click", event => {
            if (event.target === modalCompartir) modalCompartir.style.display = "none";
        });
    }

    // MODAL INSTRUCCIONES
    const botonAbrirInstrucciones = document.getElementById("abrirInstrucciones"),
        botonCerrarInstrucciones = document.getElementById("cerrarInstrucciones"),
        modalInstrucciones = document.getElementById("modalInstrucciones");

    if (botonAbrirInstrucciones && modalInstrucciones)
        botonAbrirInstrucciones.addEventListener("click", () => modalInstrucciones.style.display = "flex");

    if (botonCerrarInstrucciones && modalInstrucciones)
        botonCerrarInstrucciones.addEventListener("click", () => modalInstrucciones.style.display = "none");

    if (modalInstrucciones) {
        modalInstrucciones.addEventListener("click", event => {
            if (event.target === modalInstrucciones) modalInstrucciones.style.display = "none";
        });
    }

    // LIKES
    document.querySelectorAll(".likes").forEach(contenedorLikes => {
        const likes = contenedorLikes.querySelectorAll("i");

        likes.forEach(like => {
            like.addEventListener("click", function () {
                if (this.classList.contains("activo")) {
                    this.classList.remove("activo");
                } else {
                    likes.forEach(icono => icono.classList.remove("activo"));
                    this.classList.add("activo");
                }
            });
        });
    });

    // MODAL DE INGRESO
    const modalIngreso = document.getElementById("modalIngreso"),
        modalContenido = document.getElementById("modal-contenido");

    function abrirModalIngreso() {
        if (modalIngreso) modalIngreso.style.display = "flex";
    }

    function cerrarModalIngreso() {
        if (modalIngreso) modalIngreso.style.display = "none";
    }

    window.abrirModal = abrirModalIngreso;
    window.cerrarModal = cerrarModalIngreso;

    window.mostrarFormulario = function (formulario, boton) {
        document.querySelectorAll(".formulario").forEach(form => form.classList.remove("activo"));
        document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("activo"));

        const formularioSeleccionado = document.getElementById(formulario);
        if (formularioSeleccionado) formularioSeleccionado.classList.add("activo");
        if (boton) boton.classList.add("activo");

        if (modalContenido)
            modalContenido.classList.toggle("registro-grande", formulario === "registro");
    };

    if (modalIngreso) {
        modalIngreso.addEventListener("click", event => {
            if (event.target === modalIngreso) cerrarModalIngreso();
        });
    }

    // LOGIN / LOGOUT
    const btnIngresar = document.getElementById("btnIngresar"),
        perfilUsuario = document.getElementById("perfilUsuario"),
        cerrarSesion = document.getElementById("cerrarSesion");

    function actualizarHeader() {
        const estaLogueado = localStorage.getItem("logueado") === "true";

        if (btnIngresar) btnIngresar.style.display = estaLogueado ? "none" : "flex";
        if (perfilUsuario) perfilUsuario.style.display = estaLogueado ? "flex" : "none";
    }

    if (btnIngresar) {
        btnIngresar.addEventListener("click", event => {
            event.preventDefault();
            abrirModalIngreso();
        });
    }

    function mostrarAnimacionExito() {
        const transicion = document.getElementById("transicionExito");
        if (!transicion) return;

        transicion.classList.add("activa");
        setTimeout(() => transicion.classList.remove("activa"), 1800);
    }

    const formularioLogin = document.getElementById("login");

    if (formularioLogin) {
        formularioLogin.addEventListener("submit", event => {
            event.preventDefault();
            mostrarAnimacionExito();
            localStorage.setItem("logueado", "true");
            actualizarHeader();
            setTimeout(cerrarModalIngreso, 1800);
        });
    }

    if (cerrarSesion) {
        cerrarSesion.addEventListener("click", event => {
            event.preventDefault();
            localStorage.removeItem("logueado");
            actualizarHeader();
        });
    }

    actualizarHeader();

    // REGISTRO
    const formularioRegistro = document.getElementById("registro"),
        btnCrearRegistro = document.getElementById("btnCrearRegistro"),
        password = document.getElementById("password-register"),
        repassword = document.getElementById("repassword-register"),
        errorPassword = document.getElementById("error-password");

    let giro, grados = 0;

    if (formularioRegistro && password && repassword && errorPassword) {
        formularioRegistro.addEventListener("submit", event => {
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

            btnCrearRegistro.classList.add("cargando");
            grados = 0;

            giro = setInterval(() => {
                grados += 10;
                btnCrearRegistro.style.transform = `rotate(${grados}deg)`;
            }, 30);

            setTimeout(() => {
                clearInterval(giro);
                btnCrearRegistro.classList.remove("cargando");
                btnCrearRegistro.classList.add("exito");
                btnCrearRegistro.style.transform = "rotate(0deg)";
                btnCrearRegistro.textContent = "✓";

                setTimeout(() => {
                    mostrarAnimacionExito();
                    localStorage.setItem("logueado", "true");
                    actualizarHeader();

                    setTimeout(() => {
                        btnCrearRegistro.classList.remove("exito");
                        btnCrearRegistro.textContent = "Crear cuenta";
                        btnCrearRegistro.style.transform = "rotate(0deg)";
                        cerrarModalIngreso();
                    }, 1800);
                }, 1200);
            }, 2000);
        });
    }
});