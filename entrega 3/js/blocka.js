document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvasBlocka");
    const ctx = canvas.getContext("2d");

    let imagenSeleccionada = 0;
    let imagenAnterior = -1;
    let piezas = [];
    let animacion = null;
    let tiempo = 0;
    let tiempoMaximo = null;
    let temporizador = null;
    let nivel = 1;
    let nivelesDesbloqueados = 1;
    let mostrarOriginal = false;
    let cantidadPiezas = 4;
    let juegoTerminado = false;

    let records = JSON.parse(localStorage.getItem("blockaRecords")) || {};

    const imagenes = [
        "../img/blocka/imagen1.jpg",
        "../img/blocka/imagen2.jpg",
        "../img/blocka/imagen3.jpg",
        "../img/blocka/imagen4.jpg",
        "../img/blocka/imagen5.jpg",
        "../img/blocka/imagen6.jpg"
    ];

    const imagenesCargadas = imagenes.map(ruta => {
        const imagen = new Image();
        imagen.src = ruta;
        return imagen;
    });

    function obtenerCoordenadas(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * canvas.width / rect.width,
            y: (event.clientY - rect.top) * canvas.height / rect.height
        };
    }

    function obtenerFiltro(nivel) {
        if (nivel === 1) return "grayscale(100%)";
        if (nivel === 2) return "brightness(30%)";
        if (nivel === 3) return "invert(100%)";

        const filtros = ["grayscale(100%)", "brightness(30%)", "invert(100%)"];
        return filtros[Math.floor(Math.random() * filtros.length)];
    }

    function prepararImagenesFiltradas() {
        const imagen = imagenesCargadas[imagenSeleccionada];

        if (!imagen || !imagen.complete || imagen.naturalWidth === 0) {
            return false;
        }

        const columnas = cantidadPiezas / 2;
        const filas = 2;
        const anchoOrigen = imagen.naturalWidth / columnas;
        const altoOrigen = imagen.naturalHeight / filas;

        for (const pieza of piezas) {
            const canvasPieza = document.createElement("canvas");
            canvasPieza.width = Math.ceil(anchoOrigen);
            canvasPieza.height = Math.ceil(altoOrigen);

            const contextoPieza = canvasPieza.getContext("2d");
            contextoPieza.filter = pieza.filtro;

            contextoPieza.drawImage(
                imagen,
                pieza.columna * anchoOrigen,
                pieza.fila * altoOrigen,
                anchoOrigen,
                altoOrigen,
                0,
                0,
                canvasPieza.width,
                canvasPieza.height
            );

            contextoPieza.filter = "none";
            pieza.imagenFiltrada = canvasPieza;
        }

        return true;
    }

    function obtenerTiempoMaximo(nivel) {
        if (nivel === 4) return 45;
        if (nivel === 5) return 30;
        if (nivel === 6) return 15;
        return null;
    }

    function guardarRecord() {
        const recordAnterior = records[nivel];

        if (recordAnterior === undefined || tiempo < recordAnterior) {
            records[nivel] = tiempo;
            localStorage.setItem("blockaRecords", JSON.stringify(records));
            return true;
        }

        return false;
    }

    function obtenerTextoRecord() {
        return records[nivel] === undefined
            ? "Récord: --"
            : "Récord: " + records[nivel] + " s";
    }

    function mostrarInicio() {
        clearInterval(temporizador);
        clearInterval(animacion);
        temporizador = null;
        animacion = null;
        juegoTerminado = true;

        ctx.fillStyle = "#040F1C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFC035";
        ctx.font = "50px Orbitron";
        ctx.fillText("BLOCKA", canvas.width / 2, 130);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "24px 'Asap Condensed'";
        ctx.fillText("Reconstruí la imagen girando sus piezas", canvas.width / 2, 190);

        ctx.fillStyle = "#FFC035";
        ctx.fillRect(canvas.width / 2 - 110, 260, 220, 60);
        ctx.fillStyle = "#040F1C";
        ctx.font = "24px Orbitron";
        ctx.fillText("COMENZAR", canvas.width / 2, 299);

        canvas.oncontextmenu = event => event.preventDefault();
        canvas.onclick = event => {
            const { x, y } = obtenerCoordenadas(event);

            if (
                x >= canvas.width / 2 - 110 &&
                x <= canvas.width / 2 + 110 &&
                y >= 260 && y <= 320
            ) {
                tiempo = 0;
                mostrarSeleccionNivel();
            }
        };
    }

    function mostrarSeleccion() {
        clearInterval(animacion);
        clearInterval(temporizador);
        temporizador = null;
        animacion = null;
        juegoTerminado = true;
        canvas.onclick = null;

        let posicion = 0;
        let pasos = 0;

        const imagenesDisponibles = [];

        for (let i = 0; i < imagenesCargadas.length; i++) {
            if (
                i !== imagenAnterior &&
                imagenesCargadas[i].complete &&
                imagenesCargadas[i].naturalWidth > 0
            ) {
                imagenesDisponibles.push(i);
            }
        }

        if (imagenesDisponibles.length === 0) {
            ctx.fillStyle = "#040F1C";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.font = "22px 'Asap Condensed'";
            ctx.fillText("No se pudieron cargar las imágenes.", canvas.width / 2, canvas.height / 2);
            return;
        }

        const imagenFinal = imagenesDisponibles[
            Math.floor(Math.random() * imagenesDisponibles.length)
        ];

        function dibujarSeleccion() {
            ctx.fillStyle = "#040F1C";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.textAlign = "center";
            ctx.fillStyle = "#FFC035";
            ctx.font = "36px Orbitron";
            ctx.fillText("SELECCIONANDO IMAGEN...", canvas.width / 2, 60);

            for (let i = 0; i < imagenesCargadas.length; i++) {
                const columna = i % 3;
                const fila = Math.floor(i / 3);
                const x = 80 + columna * 270;
                const y = 100 + fila * 220;
                const imagen = imagenesCargadas[i];

                if (imagen.complete && imagen.naturalWidth > 0) {
                    ctx.drawImage(imagen, x, y, 220, 160);
                }

                if (i === posicion) {
                    ctx.strokeStyle = "#FFC035";
                    ctx.lineWidth = 6;
                    ctx.strokeRect(x - 5, y - 5, 230, 170);
                }
            }
        }

        dibujarSeleccion();

        animacion = setInterval(() => {
            posicion = (posicion + 1) % imagenesCargadas.length;
            pasos++;
            dibujarSeleccion();

            if (pasos >= imagenesCargadas.length * 2 + imagenFinal) {
                clearInterval(animacion);
                animacion = null;
                posicion = imagenFinal;
                imagenSeleccionada = imagenFinal;
                imagenAnterior = imagenFinal;
                dibujarSeleccion();

                setTimeout(() => {
                    piezas = [];
                    mostrarSeleccionCantidad();
                }, 1000);
            }
        }, 300);

        canvas.onclick = null;
        canvas.oncontextmenu = event => event.preventDefault();
    }

    function mostrarSeleccionNivel() {
        clearInterval(temporizador);
        clearInterval(animacion);
        temporizador = null;
        animacion = null;
        juegoTerminado = true;

        ctx.fillStyle = "#040F1C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFC035";
        ctx.font = "36px Orbitron";
        ctx.fillText("ELEGÍ UN NIVEL", canvas.width / 2, 65);

        const niveles = [
            { numero: 1, x: 80, y: 120 },
            { numero: 2, x: 320, y: 120 },
            { numero: 3, x: 560, y: 120 },
            { numero: 4, x: 80, y: 300 },
            { numero: 5, x: 320, y: 300 },
            { numero: 6, x: 560, y: 300 }
        ];

        niveles.forEach(opcion => {
            const desbloqueado = opcion.numero <= nivelesDesbloqueados;

            ctx.fillStyle = desbloqueado ? "#FFC035" : "#555555";
            ctx.fillRect(opcion.x, opcion.y, 200, 130);
            ctx.fillStyle = desbloqueado ? "#040F1C" : "#CCCCCC";
            ctx.font = "22px Orbitron";
            ctx.fillText("NIVEL " + opcion.numero, opcion.x + 100, opcion.y + 45);
            ctx.font = "18px 'Asap Condensed'";

            if (desbloqueado) {
                ctx.fillText(opcion.numero < 4 ? "FÁCIL" : "DIFÍCIL", opcion.x + 100, opcion.y + 85);

                if (records[opcion.numero] !== undefined) {
                    ctx.font = "14px 'Asap Condensed'";
                    ctx.fillText("Récord: " + records[opcion.numero] + " s", opcion.x + 100, opcion.y + 108);
                }
            } else {
                ctx.fillText("🔒 BLOQUEADO", opcion.x + 100, opcion.y + 85);
            }
        });

        canvas.onclick = event => {
            const { x, y } = obtenerCoordenadas(event);

            for (const opcion of niveles) {
                if (
                    x >= opcion.x && x <= opcion.x + 200 &&
                    y >= opcion.y && y <= opcion.y + 130
                ) {
                    if (opcion.numero > nivelesDesbloqueados) return;

                    nivel = opcion.numero;
                    mostrarSeleccion();
                    return;
                }
            }
        };

        canvas.oncontextmenu = event => event.preventDefault();
    }

    function mostrarSeleccionCantidad() {
        clearInterval(temporizador);
        temporizador = null;

        ctx.fillStyle = "#040F1C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFC035";
        ctx.font = "36px Orbitron";
        ctx.fillText("ELEGÍ LA CANTIDAD DE PIEZAS", canvas.width / 2, 150);

        const opciones = [
            { cantidad: 4, x: 150 },
            { cantidad: 6, x: 370 },
            { cantidad: 8, x: 590 }
        ];

        opciones.forEach(opcion => {
            ctx.fillStyle = "#FFC035";
            ctx.fillRect(opcion.x, 230, 160, 80);
            ctx.fillStyle = "#040F1C";
            ctx.font = "28px Orbitron";
            ctx.fillText(opcion.cantidad + " PIEZAS", opcion.x + 80, 278);
        });

        canvas.onclick = event => {
            const { x, y } = obtenerCoordenadas(event);

            for (const opcion of opciones) {
                if (
                    x >= opcion.x && x <= opcion.x + 160 &&
                    y >= 230 && y <= 310
                ) {
                    cantidadPiezas = opcion.cantidad;
                    iniciarPuzzle();
                    return;
                }
            }
        };

        canvas.oncontextmenu = event => event.preventDefault();
    }

    function iniciarPuzzle() {
        piezas = [];
        mostrarOriginal = false;
        juegoTerminado = false;
        tiempo = 0;
        tiempoMaximo = obtenerTiempoMaximo(nivel);

        const columnas = cantidadPiezas / 2;
        const filas = 2;
        const rotaciones = [0, 90, 180, 270];

        for (let fila = 0; fila < filas; fila++) {
            for (let columna = 0; columna < columnas; columna++) {
                piezas.push({
                    fila,
                    columna,
                    rotacion: rotaciones[Math.floor(Math.random() * rotaciones.length)],
                    filtro: obtenerFiltro(nivel),
                    fija: false
                });
            }
        }

        if (piezas.every(pieza => pieza.rotacion === 0)) {
            piezas[0].rotacion = 90;
        }

        if (!prepararImagenesFiltradas()) {
            juegoTerminado = true;
            return;
        }

        mostrarImagenSeleccionada();
        iniciarTemporizador();
    }

    function iniciarTemporizador() {
        clearInterval(temporizador);
        temporizador = null;
        tiempo = 0;
        mostrarImagenSeleccionada();

        temporizador = setInterval(() => {
            if (juegoTerminado) {
                clearInterval(temporizador);
                temporizador = null;
                return;
            }

            tiempo++;

            if (tiempoMaximo !== null && tiempo >= tiempoMaximo) {
                clearInterval(temporizador);
                temporizador = null;
                juegoTerminado = true;
                mostrarTiempoAgotado();
                return;
            }

            mostrarImagenSeleccionada();
        }, 1000);
    }

    function usarAyudita() {
        if (juegoTerminado || nivel < 4) return;

        const piezasDisponibles = piezas.filter(
            pieza => !pieza.fija && pieza.rotacion !== 0
        );

        if (piezasDisponibles.length === 0) return;

        const pieza = piezasDisponibles[
            Math.floor(Math.random() * piezasDisponibles.length)
        ];

        pieza.rotacion = 0;
        pieza.fija = true;
        tiempo += 5;

        if (tiempoMaximo !== null && tiempo >= tiempoMaximo) {
            clearInterval(temporizador);
            temporizador = null;
            juegoTerminado = true;
            mostrarTiempoAgotado();
            return;
        }

        mostrarImagenSeleccionada();

        if (verificarPuzzle()) mostrarVictoria();
    }

    function mostrarImagenSeleccionada() {
        const imagen = imagenesCargadas[imagenSeleccionada];

        if (!imagen || !imagen.complete || imagen.naturalWidth === 0) return;

        ctx.fillStyle = "#040F1C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFC035";
        ctx.font = "36px Orbitron";
        ctx.fillText("BLOCKA", canvas.width / 2, 45);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "18px 'Asap Condensed'";
        ctx.fillText("Clic izquierdo o derecho para girar las piezas", canvas.width / 2, 75);

        ctx.textAlign = "right";
        ctx.fillStyle = "#FFC035";
        ctx.font = "20px Orbitron";
        ctx.fillText("TIEMPO: " + tiempo + " s", canvas.width - 30, 45);

        ctx.textAlign = "left";
        ctx.fillStyle = "#FFC035";
        ctx.fillRect(25, 20, 180, 40);
        ctx.fillStyle = "#040F1C";
        ctx.font = "16px Orbitron";
        ctx.fillText("← NIVELES", 40, 46);

        if (nivel >= 4) {
            ctx.fillStyle = "#FFC035";
            ctx.fillRect(25, 70, 180, 40);
            ctx.fillStyle = "#040F1C";
            ctx.font = "16px Orbitron";
            ctx.fillText("AYUDITA +5 s", 40, 96);
        }

        ctx.textAlign = "center";

        const columnas = cantidadPiezas / 2;
        const filas = 2;
        const anchoPieza = 400 / columnas;
        const altoPieza = 300 / filas;
        const separacionX = anchoPieza + 12;
        const separacionY = altoPieza + 12;
        const xInicial = canvas.width / 2 - ((columnas - 1) * separacionX) / 2;
        const yInicial = 205;

        piezas.forEach(pieza => {
            const centroX = xInicial + pieza.columna * separacionX;
            const centroY = yInicial + pieza.fila * separacionY;
            const origenX = pieza.columna * (imagen.width / columnas);
            const origenY = pieza.fila * (imagen.height / filas);
            const anchoOrigen = imagen.width / columnas;
            const altoOrigen = imagen.height / filas;

            ctx.save();
            ctx.translate(centroX, centroY);
            ctx.rotate(pieza.rotacion * Math.PI / 180);

            if (mostrarOriginal) {
                ctx.drawImage(
                    imagen, origenX, origenY, anchoOrigen, altoOrigen,
                    -anchoPieza / 2, -altoPieza / 2, anchoPieza, altoPieza
                );
            } else {
                ctx.drawImage(
                    pieza.imagenFiltrada,
                    -anchoPieza / 2, -altoPieza / 2, anchoPieza, altoPieza
                );
            }

            ctx.restore();
            ctx.strokeStyle = "#FFC035";
            ctx.lineWidth = 2;
            ctx.strokeRect(
                centroX - anchoPieza / 2,
                centroY - altoPieza / 2,
                anchoPieza,
                altoPieza
            );
        });

        function buscarPieza(x, y) {
            for (const pieza of piezas) {
                const centroX = xInicial + pieza.columna * separacionX;
                const centroY = yInicial + pieza.fila * separacionY;

                if (
                    x >= centroX - anchoPieza / 2 &&
                    x <= centroX + anchoPieza / 2 &&
                    y >= centroY - altoPieza / 2 &&
                    y <= centroY + altoPieza / 2
                ) {
                    return pieza;
                }
            }

            return null;
        }

        canvas.onclick = event => {
            if (juegoTerminado) return;

            const { x, y } = obtenerCoordenadas(event);

            if (nivel >= 4 && x >= 25 && x <= 205 && y >= 70 && y <= 110) {
                usarAyudita();
                return;
            }

            if (x >= 25 && x <= 205 && y >= 20 && y <= 60) {
                clearInterval(temporizador);
                temporizador = null;
                mostrarSeleccionNivel();
                return;
            }

            const pieza = buscarPieza(x, y);
            if (pieza === null || pieza.fija) return;

            pieza.rotacion = (pieza.rotacion + 270) % 360;
            mostrarImagenSeleccionada();

            if (verificarPuzzle()) mostrarVictoria();
        };

        canvas.oncontextmenu = event => {
            event.preventDefault();
            if (juegoTerminado) return false;

            const { x, y } = obtenerCoordenadas(event);

            if (
                (x >= 25 && x <= 205 && y >= 20 && y <= 60) ||
                (nivel >= 4 && x >= 25 && x <= 205 && y >= 70 && y <= 110)
            ) {
                return false;
            }

            const pieza = buscarPieza(x, y);
            if (pieza === null || pieza.fija) return false;

            pieza.rotacion = (pieza.rotacion + 90) % 360;
            mostrarImagenSeleccionada();

            if (verificarPuzzle()) mostrarVictoria();
            return false;
        };
    }

    function verificarPuzzle() {
        return piezas.every(pieza => pieza.rotacion === 0);
    }

    function mostrarVictoria() {
        if (juegoTerminado) return;

        juegoTerminado = true;
        clearInterval(temporizador);
        temporizador = null;
        mostrarOriginal = true;

        const nuevoRecord = guardarRecord();

        if (nivel === nivelesDesbloqueados && nivelesDesbloqueados < 6) {
            nivelesDesbloqueados++;
        }

        const imagen = imagenesCargadas[imagenSeleccionada];

        ctx.fillStyle = "#040F1C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (imagen && imagen.complete && imagen.naturalWidth > 0) {
            ctx.filter = "none";
            ctx.drawImage(imagen, 250, 65, 400, 210);
        }

        ctx.fillStyle = "rgba(4, 15, 28, 0.96)";
        ctx.fillRect(100, 285, 700, 205);
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFC035";
        ctx.font = "28px Orbitron";
        ctx.fillText(nivel < 6 ? "¡NIVEL COMPLETADO!" : "¡JUEGO COMPLETADO!", canvas.width / 2, 333);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "18px 'Asap Condensed'";
        ctx.fillText("¡Muy bien! Reconstruiste la imagen", canvas.width / 2, 360);

        ctx.fillStyle = "#FFC035";
        ctx.font = "18px Orbitron";
        ctx.fillText("TIEMPO: " + tiempo + " s", canvas.width / 2, 386);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "16px 'Asap Condensed'";
        ctx.fillText(nuevoRecord ? "¡NUEVO RÉCORD!" : obtenerTextoRecord(), canvas.width / 2, 407);

        const botones = [
            { texto: "INICIO", x: 120, ancho: 180, accion: mostrarInicio },
            { texto: "NIVELES", x: 360, ancho: 180, accion: mostrarSeleccionNivel }
        ];

        if (nivel < 6) {
            botones.push({
                texto: "SIGUIENTE NIVEL",
                x: 600,
                ancho: 180,
                accion: () => {
                    nivel++;
                    mostrarSeleccion();
                }
            });
        } else {
            botones[0].x = 230;
            botones[1].x = 490;
        }

        botones.forEach(boton => {
            ctx.fillStyle = "#FFC035";
            ctx.fillRect(boton.x, 425, boton.ancho, 45);
            ctx.fillStyle = "#040F1C";
            ctx.font = "14px Orbitron";
            ctx.fillText(boton.texto, boton.x + boton.ancho / 2, 453);
        });

        canvas.onclick = event => {
            const { x, y } = obtenerCoordenadas(event);

            for (const boton of botones) {
                if (
                    x >= boton.x && x <= boton.x + boton.ancho &&
                    y >= 425 && y <= 470
                ) {
                    boton.accion();
                    return;
                }
            }
        };

        canvas.oncontextmenu = event => event.preventDefault();
    }

    function mostrarTiempoAgotado() {
        juegoTerminado = true;
        clearInterval(temporizador);
        temporizador = null;

        ctx.fillStyle = "#040F1C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFC035";
        ctx.font = "36px Orbitron";
        ctx.fillText("¡TIEMPO AGOTADO!", canvas.width / 2, 200);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px 'Asap Condensed'";
        ctx.fillText("No lograste reconstruir la imagen a tiempo", canvas.width / 2, 245);

        ctx.fillStyle = "#FFC035";
        ctx.font = "20px Orbitron";
        ctx.fillText("Nivel " + nivel, canvas.width / 2, 285);

        ctx.fillStyle = "#FFC035";
        ctx.fillRect(300, 320, 300, 55);
        ctx.fillStyle = "#040F1C";
        ctx.font = "20px Orbitron";
        ctx.fillText("VOLVER A NIVELES", canvas.width / 2, 354);

        ctx.fillStyle = "#FFC035";
        ctx.fillRect(300, 390, 300, 50);
        ctx.fillStyle = "#040F1C";
        ctx.font = "18px Orbitron";
        ctx.fillText("VOLVER AL INICIO", canvas.width / 2, 421);

        canvas.onclick = event => {
            const { x, y } = obtenerCoordenadas(event);

            if (x >= 300 && x <= 600 && y >= 320 && y <= 375) {
                mostrarSeleccionNivel();
            } else if (x >= 300 && x <= 600 && y >= 390 && y <= 440) {
                mostrarInicio();
            }
        };

        canvas.oncontextmenu = event => event.preventDefault();
    }

    mostrarInicio();
});

