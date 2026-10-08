document.addEventListener("DOMContentLoaded", () => {
    // 1. PANTALLA DE CARGA PRINCIPAL
    const loaderImg = document.querySelector("#loaderImg");
    const barra = document.querySelector(".progreso");
    const porcentaje = document.querySelector("#porcentaje");
    const pantallaCarga = document.querySelector("#pantallaCarga");
    const pantallaFinal = document.querySelector("#pantallaFinal");

    if (loaderImg) {
        setInterval(() => {
            loaderImg.classList.toggle("latido");
        }, 400);
    }

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
                pantallaCarga.classList.add("finalizando");

                setTimeout(() => {
                    pantallaCarga.classList.add("salir");
                }, 700);

                setTimeout(() => {
                    pantallaCarga.style.display = "none";
                }, 1500);
            }
        }, 1000);
    }

    const botonMenu = document.querySelector(".menu");
    const menuLateral = document.querySelector("#menuLateral");

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

    const masOpciones = document.querySelector("#masOpciones");
    const menuMasOpciones = document.querySelector("#menuMasOpciones");

    if (masOpciones && menuMasOpciones) {
        masOpciones.addEventListener("click", (e) => {
            e.stopPropagation();
            menuMasOpciones.classList.toggle("abierto");
        });

        document.addEventListener("click", () => {
            menuMasOpciones.classList.remove("abierto");
        });
    }

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

            const contenidoCompra = modalCompra.querySelector(".modal-compra");
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
        { name: "PacMan", background_image: "img/pacman.jpeg" },
        { name: "Uno", background_image: "img/uno.jpg" },
        { name: "Dominoes Classic", background_image: "img/domino.jpeg" },
        { name: "Ludo King", background_image: "img/ludo.jpeg" },
        { name: "Spider Solitarie", background_image: "img/spidersolitarie.jpeg" },
        { name: "Monopoly", background_image: "img/monopoly.jpeg" },
        { name: "Block Puzzle", background_image: "img/blockpuzzle.jpeg" },
        { name: "Red Ball 4", background_image: "img/redball.jpeg" },
        { name: "FireBoy and WaterGirl", background_image: "img/fuegoyagua.jpeg" },
        { name: "5 Roll", background_image: "img/5roll.jpeg" },
        { name: "Backgammon", background_image: "img/backgammon.jpeg" },
        { name: "Balatro", background_image: "img/balatro.jpeg" },
        { name: "Checkers", background_image: "img/checkers.jpeg" },
        { name: "Mario Kart", background_image: "img/marioKart.jpg" },
        { name: "Reversi", background_image: "img/reversi.jpeg" },
        { name: "Soldiers", background_image: "img/soldiers.jpeg" }
    ];

    /* CARGAR JUEGOS */

    async function cargarJuegos() {
        let juegos;

        try {
            const response = await fetch("https://vj.interfaces.jima.com.ar/api/v2");

            juegos = await response.json();

        } catch (error) {
            
            juegos = juegosHardcodeados;
        }

        /* RECOMENDADAS */

        const cardsRecomendadas = document.querySelectorAll(".recommended .card-recomendado");

        cardsRecomendadas.forEach((card, indice) => {
            let juego = juegos[indice % juegos.length];

            const esPegSolitaire =
                card.classList.contains("peg-solitaire") ||
                (card.classList.contains("peg") && card.classList.contains("solitaire"));

            if (esPegSolitaire) {
                juego = {
                    name: "Peg Solitaire",
                    background_image: "img/peg-solitarie.png",
                    background_image_low_res: "img/peg-solitarie.png",
                    description: "Juego clásico de estrategia y lógica."
                };
            }

            const imagen = card.querySelector("img");

            if (imagen) {
                imagen.src = juego.background_image_low_res || juego.background_image;
                imagen.alt = juego.name;
            }

            const titulo = card.querySelector("h2");

            if (titulo) {
                titulo.textContent = juego.name;
            }

            let overlay = card.querySelector(".overlay");

            if (!overlay) {
                overlay = document.createElement("div");
                overlay.classList.add("overlay");

                overlay.innerHTML = `
                    <h3>${juego.name}</h3>
                    <button class="btn-jugar">Jugar</button>
                    <button class="fav tooltip-acento" data-tooltip="Añadir a favoritos">
                        <span>Añadir a favoritos</span>
                        <i class="fa-regular fa-heart"></i>
                    </button>
                `;

                card.appendChild(overlay);
            }

            const botonFavorito = card.querySelector(".fav");

            if (botonFavorito) {
                botonFavorito.addEventListener("click", function() {
                    const corazon = this.querySelector("i");

                    if (corazon) {
                        corazon.classList.toggle("fa-regular");
                        corazon.classList.toggle("fa-solid");
                    }
                });
            }

            /* PEG SOLITAIRE */

            if (esPegSolitaire) {
                const botonJugar = overlay.querySelector(".btn-jugar");

                if (botonJugar) {
                    botonJugar.addEventListener("click", function() {
                        window.location.href = "juego.html";
                    });
                }
            }
        });

        /* RESTO DE LOS JUEGOS */

        const cards = document.querySelectorAll(".game-category:not(.recommended) .card-juego");

        cards.forEach((card, indice) => {
            let juego = juegos[indice % juegos.length];

            const esPegSolitaire =
                card.classList.contains("peg-solitaire") ||
                (card.classList.contains("peg") && card.classList.contains("solitaire"));

            if (esPegSolitaire) {
                juego = {
                    name: "Peg Solitaire",
                    background_image: "img/peg-solitarie.png",
                    background_image_low_res: "img/peg-solitarie.png",
                    description: "Juego clásico de estrategia y lógica."
                };
            }

            const imagen = card.querySelector("img");

            if (imagen) {
                imagen.src = juego.background_image_low_res || juego.background_image;
                console.log("IMAGEN RECOMENDADO:", imagen.src);
                imagen.alt = juego.name;
            }

            const titulo = card.querySelector("h3");

            if (titulo) {
                titulo.textContent = juego.name;
            }

            let overlay = card.querySelector(".overlay");

            if (!overlay) {
                overlay = document.createElement("div");
                overlay.classList.add("overlay");

                const esPago = card.querySelector(".pago");
                const textoBoton = esPago ? "Comprar" : "Jugar";

                overlay.innerHTML = `
                    <h3>${juego.name}</h3>
                    <button class="btn-jugar">${textoBoton}</button>
                    <button class="fav tooltip-acento" data-tooltip="Añadir a favoritos">
                        <span>Añadir a favoritos</span>
                        <i class="fa-regular fa-heart"></i>
                    </button>
                `;

                card.appendChild(overlay);
            }

            const botonFavorito = card.querySelector(".fav");

            if (botonFavorito) {
                botonFavorito.addEventListener("click", function() {
                    const corazon = this.querySelector("i");

                    if (corazon) {
                        corazon.classList.toggle("fa-regular");
                        corazon.classList.toggle("fa-solid");
                    }
                });
            }

            /* JUEGOS PAGOS */

            const modalPrecio = document.querySelector("#modalPrecio");
            const esPago = card.querySelector(".pago");

            if (esPago) {
                const botonComprar = overlay.querySelector(".btn-jugar");

                if (botonComprar) {
                    botonComprar.addEventListener("click", function() {
                        if (!modalCompra) return;

                        modalImagen.src = juego.background_image_low_res || juego.background_image;
                        modalImagen.alt = juego.name;
                        modalTitulo.textContent = juego.name;

                        const descripcion = juego.description || "Breve descripción del juego";

                        modalDescripcion.textContent = descripcion.length > 120
                            ? descripcion.substring(0, 120) + "..."
                            : descripcion;

                        const precio = card.dataset.precio || "0";
                        modalPrecio.textContent = "Precio: $" + Number(precio).toLocaleString("es-AR");

                        modalCompra.classList.add("abierto");
                    });
                }
            }

            /* PEG SOLITAIRE */

            if (esPegSolitaire && !esPago) {
                const botonJugar = overlay.querySelector(".btn-jugar");

                if (botonJugar) {
                    botonJugar.addEventListener("click", function() {
                        window.location.href = "juego.html";
                    });
                }
            }
        });
    }

    /* EJECUTAR CARGA */

    cargarJuegos();

    /* INICIALIZAR CARRUSELES */

    inicializarCarruseles();

    /* CARRUSELES */

    function inicializarCarruseles() {

        /* FUNCIÓN PARA ARRASTRAR */

        function hacerArrastrable(lista) {
            let presionando = false;
            let inicioX = 0;
            let scrollInicial = 0;

            lista.addEventListener("mousedown", function(e) {
                if (window.innerWidth > 500) return;

                presionando = true;
                inicioX = e.pageX;
                scrollInicial = lista.scrollLeft;
            });

            lista.addEventListener("mousemove", function(e) {
                if (!presionando || window.innerWidth > 500) return;

                e.preventDefault();

                const movimiento = e.pageX - inicioX;
                lista.scrollLeft = scrollInicial - movimiento;
            });

            lista.addEventListener("mouseup", function() {
                presionando = false;
            });

            lista.addEventListener("mouseleave", function() {
                presionando = false;
            });

            lista.addEventListener("touchstart", function(e) {
                if (window.innerWidth > 500) return;

                inicioX = e.touches[0].pageX;
                scrollInicial = lista.scrollLeft;
            }, { passive: true });

            lista.addEventListener("touchmove", function(e) {
                if (window.innerWidth > 500) return;

                const movimiento = e.touches[0].pageX - inicioX;
                lista.scrollLeft = scrollInicial - movimiento;
            }, { passive: true });
        }

        /* CARRUSEL RECOMENDADOS */

        const listaRecomendados = document.querySelector(".recommended .game-list");

        const botonAnterior = document.querySelector("#recomendadosAnterior");
        const botonSiguiente = document.querySelector("#recomendadosSiguiente");

        if (listaRecomendados) {
            let cardsRecomendadas = Array.from(
                listaRecomendados.querySelectorAll(".card-recomendado")
            );

            if (window.innerWidth <= 500) {

                let inicioX = 0;
            
                listaRecomendados.addEventListener("touchstart", function(event) {
                    inicioX = event.touches[0].clientX;
                });
            
                listaRecomendados.addEventListener("touchend", function(event) {
                    const finalX = event.changedTouches[0].clientX;
                    const diferencia = finalX - inicioX;
            
                    if (Math.abs(diferencia) < 50) {
                        return;
                    }
            
                    if (diferencia < 0) {
                        // Arrastró hacia la izquierda
                        rotarRecomendados();
                    } else {
                        // Arrastró hacia la derecha
                        const ultima = cardsRecomendadas.pop();
                        cardsRecomendadas.unshift(ultima);
                        actualizarPosiciones(true);
                    }
                });
            }

            if (botonSiguiente) {
                botonSiguiente.addEventListener("click", function() {
                    rotarRecomendados();
                });
            }

            if (botonAnterior) {
                botonAnterior.addEventListener("click", function() {
                    const ultima = cardsRecomendadas.pop();
            
                    cardsRecomendadas.unshift(ultima);
            
                    actualizarPosiciones(true);
                });
            }

            function actualizarPosiciones(animar = true) {

                cardsRecomendadas.forEach((card, indice) => {
                    let izquierda;

                    if (window.innerWidth <= 500) {
                        if (indice === 0) {
                            izquierda = "-5%";
                        } else if (indice === 1) {
                            izquierda = "20%";
                        } else {
                            izquierda = "43%";
                        }
                    } else if (window.innerWidth <= 768) {
                        if (indice === 0) {
                            izquierda = "2%";
                        } else if (indice === 1) {
                            izquierda = "25%";
                        } else {
                            izquierda = "48%";
                        }
                    } else {
                        if (indice === 0) {
                            izquierda = "0%";
                        } else if (indice === 1) {
                            izquierda = "27.5%";
                        } else {
                            izquierda = "55%";
                        }
                    }

                    if (!animar) {
                        card.style.transition = "none";
                    } else {
                        card.style.transition =
                            "left 0.8s ease, " +
                            "transform 0.8s ease, " +
                            "opacity 0.8s ease, " +
                            "filter 0.8s ease";
                    }

                    card.style.left = izquierda;

                    if (indice === 0 || indice === 2) {
                        card.classList.add("fondo");
                        card.style.zIndex = "1";
                    } else {
                        card.classList.remove("fondo");
                        card.style.zIndex = "3";
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
        }

        /* CARRUSELES GRANDES */

        const carruselesGrandes = document.querySelectorAll(
            ".game-category:not(.recommended) .carousel"
        );

        carruselesGrandes.forEach(carousel => {
            const lista = carousel.querySelector(".game-list");
            const botonIzquierda = carousel.querySelector(".carousel-arrow:first-child");
            const botonDerecha = carousel.querySelector(".carousel-arrow:last-child");

            const card = lista
                ? lista.querySelector(".card-grande")
                : null;

            if (!lista || !card || !botonIzquierda || !botonDerecha) {
                return;
            }

            hacerArrastrable(lista);

            const espacio = 12;
            const cantidadMovimiento = window.innerWidth <= 500 ? 1 : window.innerWidth <= 768 ? 2 : 3;

            /* Derecha */

            botonDerecha.addEventListener("click", function() {
                const paso = card.offsetWidth + espacio;

                lista.classList.add("animando");

                lista.scrollBy({
                    left: paso * cantidadMovimiento,
                    behavior: "smooth"
                });

                setTimeout(() => {
                    lista.classList.remove("animando");
                }, 700);
            });

            /* Izquierda */

            botonIzquierda.addEventListener("click", function() {
                const paso = card.offsetWidth + espacio;

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

            const botonIzquierda = carousel.querySelector(
                ".carousel-arrow:first-child"
            );

            const botonDerecha = carousel.querySelector(
                ".carousel-arrow:last-child"
            );

            const card = lista.querySelector(".card-chica");

            if (!card || !botonIzquierda || !botonDerecha) {
                return;
            }

            hacerArrastrable(lista);

            const espacio = 25;
            const cantidadMovimiento = window.innerWidth <= 500 ? 1 : window.innerWidth <= 768 ? 2 : 3;

            /* Derecha */

            botonDerecha.addEventListener("click", function() {
                const paso = card.offsetWidth + espacio;

                lista.classList.add("animando");

                lista.scrollBy({
                    left: paso * cantidadMovimiento,
                    behavior: "smooth"
                });

                setTimeout(() => {
                    lista.classList.remove("animando");
                }, 500);
            });

            /* Izquierda */

            botonIzquierda.addEventListener("click", function() {
                const paso = card.offsetWidth + espacio;

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
    }

    // 5. MENÚ DE AJUSTES

    const botonAjustes = document.getElementById("boton-ajustes");
    const menuAjustes = document.querySelector(".menu-ajustes");

    if (botonAjustes && menuAjustes) {
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
    }

    // 9. MODAL DE INGRESO

    const modalIngreso = document.getElementById("modalIngreso");
    const modalContenido = document.getElementById("modal-contenido");

    function abrirModalIngreso() {
        if (modalIngreso) {
            modalIngreso.style.display = "flex";
        }
    }

    function cerrarModalIngreso() {
        if (modalIngreso) {
            modalIngreso.style.display = "none";
        }
    }

    window.abrirModal = abrirModalIngreso;
    window.cerrarModal = cerrarModalIngreso;

    // CAMBIAR ENTRE LOGIN Y REGISTRO

    window.mostrarFormulario = function(formulario, boton) {
        document.querySelectorAll(".formulario").forEach(function(form) {
            form.classList.remove("activo");
        });

        document.querySelectorAll(".tab").forEach(function(tab) {
            tab.classList.remove("activo");
        });

        const formularioSeleccionado = document.getElementById(formulario);

        if (formularioSeleccionado) {
            formularioSeleccionado.classList.add("activo");
        }

        if (boton) {
            boton.classList.add("activo");
        }

        if (modalContenido) {
            modalContenido.classList.toggle(
                "registro-grande",
                formulario === "registro"
            );
        }
    };

    // CERRAR MODAL HACIENDO CLICK AFUERA

    if (modalIngreso) {
        modalIngreso.addEventListener("click", function(event) {
            if (event.target === modalIngreso) {
                cerrarModalIngreso();
            }
        });
    }

    // 10. HEADER - LOGIN / LOGOUT

    const btnIngresar = document.getElementById("btnIngresar");
    const perfilUsuario = document.getElementById("perfilUsuario");
    const cerrarSesion = document.getElementById("cerrarSesion");

    function actualizarHeader() {
        const estaLogueado =
            localStorage.getItem("logueado") === "true";

        if (btnIngresar) {
            if (estaLogueado) {
                btnIngresar.style.display = "none";
            } else {
                btnIngresar.style.display = "flex";
            }
        }

        if (perfilUsuario) {
            if (estaLogueado) {
                perfilUsuario.style.display = "flex";
            } else {
                perfilUsuario.style.display = "none";
            }
        }
    }

    if (btnIngresar) {
        btnIngresar.addEventListener("click", function(event) {
            event.preventDefault();
            abrirModalIngreso();
        });
    }

    // FORMULARIO LOGIN

    const formularioLogin = document.getElementById("login");

    if (formularioLogin) {
        formularioLogin.addEventListener("submit", function(event) {
            event.preventDefault();

            mostrarAnimacionExito();

            localStorage.setItem("logueado", "true");

            actualizarHeader();

            setTimeout(function() {
                cerrarModalIngreso();
            }, 1800);
        });
    }

    // CERRAR SESIÓN

    if (cerrarSesion) {
        cerrarSesion.addEventListener("click", function(event) {
            event.preventDefault();

            localStorage.removeItem("logueado");

            actualizarHeader();
        });
    }

    // COMPROBAR SESIÓN AL CARGAR

    actualizarHeader();

    // ANIMACIÓN DE ÉXITO

    function mostrarAnimacionExito() {
        const transicion = document.getElementById("transicionExito");

        if (!transicion) return;

        transicion.classList.add("activa");

        setTimeout(function() {
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
        formularioRegistro.addEventListener("submit", function(event) {
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

            giro = setInterval(function() {
                grados += 10;
                btnCrearRegistro.style.transform = `rotate(${grados}deg)`;
            }, 30);

            setTimeout(function() {
                clearInterval(giro);

                btnCrearRegistro.classList.remove("cargando");
                btnCrearRegistro.classList.add("exito");

                btnCrearRegistro.style.transform = "rotate(0deg)";
                btnCrearRegistro.textContent = "✓";

                setTimeout(function() {
                    mostrarAnimacionExito();

                    localStorage.setItem("logueado", "true");

                    actualizarHeader();

                    setTimeout(function() {
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
