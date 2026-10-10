document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("canvasBlocka");
    const ctx = canvas.getContext("2d");

    let imagenSeleccionada = 0;
    let piezas = [];
    let animacion = null;

    let tiempo = 0;
    let temporizador = null;

    let nivel = 1;
    let mostrarOriginal = false;
    let cantidadPiezas = 4;

    // -------------------------
    // BANCO DE IMÁGENES
    // -------------------------

    const imagenes = [
        "../img/blocka/imagen1.jpg",
        "../img/blocka/imagen2.jpg",
        "../img/blocka/imagen3.jpg",
        "../img/blocka/imagen4.jpg",
        "../img/blocka/imagen5.jpg",
        "../img/blocka/imagen6.jpg"
    ];

    const imagenesCargadas = [];

    for (let i = 0; i < imagenes.length; i++) {
        const imagen = new Image();
        imagen.src = imagenes[i];
        imagenesCargadas.push(imagen);
    }

    // -------------------------
    // COORDENADAS DEL CANVAS
    // -------------------------

    function obtenerCoordenadas(event) {
        const rect = canvas.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) *
                canvas.width / rect.width,

            y: (event.clientY - rect.top) *
                canvas.height / rect.height
        };
    }

    // -------------------------
    // PANTALLA INICIAL
    // -------------------------

    function mostrarInicio() {
        clearInterval(temporizador);
        clearInterval(animacion);

        ctx.fillStyle = "#040F1C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "center";

        ctx.fillStyle = "#FFC035";
        ctx.font = "50px Orbitron";
        ctx.fillText("BLOCKA", canvas.width / 2, 130);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "24px 'Asap Condensed'";
        ctx.fillText(
            "Reconstruí la imagen girando sus piezas",
            canvas.width / 2,
            190
        );

        ctx.fillStyle = "#FFC035";
        ctx.fillRect(canvas.width / 2 - 110, 260, 220, 60);

        ctx.fillStyle = "#040F1C";
        ctx.font = "24px Orbitron";
        ctx.fillText("COMENZAR", canvas.width / 2, 299);

        canvas.oncontextmenu = (event) => event.preventDefault();

        canvas.onclick = (event) => {
            const { x, y } = obtenerCoordenadas(event);

            if (
                x >= canvas.width / 2 - 110 &&
                x <= canvas.width / 2 + 110 &&
                y >= 260 &&
                y <= 320
            ) {
                mostrarSeleccion();
            }
        };
    }

    // -------------------------
    // SELECCIÓN DE IMAGEN
    // -------------------------

    function mostrarSeleccion() {
        clearInterval(animacion);

        let posicion = 0;

        function dibujarSeleccion() {
            ctx.fillStyle = "#040F1C";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.textAlign = "center";
            ctx.fillStyle = "#FFC035";
            ctx.font = "36px Orbitron";

            ctx.fillText(
                "ELEGÍ UNA IMAGEN",
                canvas.width / 2,
                60
            );

            for (let i = 0; i < imagenesCargadas.length; i++) {
                const columna = i % 3;
                const fila = Math.floor(i / 3);

                const x = 80 + columna * 270;
                const y = 100 + fila * 220;

                if (
                    imagenesCargadas[i].complete &&
                    imagenesCargadas[i].naturalWidth > 0
                ) {
                    ctx.drawImage(
                        imagenesCargadas[i],
                        x,
                        y,
                        220,
                        160
                    );
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
            posicion++;

            if (posicion >= imagenesCargadas.length) {
                posicion = 0;
            }

            dibujarSeleccion();
        }, 300);

        canvas.onclick = (event) => {
            const { x, y } = obtenerCoordenadas(event);

            for (let i = 0; i < imagenesCargadas.length; i++) {
                const columna = i % 3;
                const fila = Math.floor(i / 3);

                const imagenX = 80 + columna * 270;
                const imagenY = 100 + fila * 220;

                if (
                    x >= imagenX &&
                    x <= imagenX + 220 &&
                    y >= imagenY &&
                    y <= imagenY + 160
                ) {
                    if (
                        !imagenesCargadas[i].complete ||
                        imagenesCargadas[i].naturalWidth === 0
                    ) {
                        return;
                    }

                    clearInterval(animacion);
                    animacion = null;

                    imagenSeleccionada = i;
piezas = [];

mostrarSeleccionNivel();
return;
                }
            }
        };
    }
    // -------------------------
    // SELECCIÓN DE NIVEL
    // -------------------------

    function mostrarSeleccionNivel() {

        ctx.fillStyle = "#040F1C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "center";
        ctx.fillStyle = "#FFC035";
        ctx.font = "36px Orbitron";

        ctx.fillText(
            "ELEGÍ UN NIVEL",
            canvas.width / 2,
            100
        );

        const niveles = [
            {
                numero: 1,
                descripcion: "Nivel fácil",
                x: 100
            },
            {
                numero: 2,
                descripcion: "Nivel medio",
                x: 350
            },
            {
                numero: 3,
                descripcion: "Nivel difícil",
                x: 600
            }
        ];

        niveles.forEach(opcion => {

            ctx.fillStyle = "#FFC035";
            ctx.fillRect(opcion.x, 210, 200, 130);

            ctx.fillStyle = "#040F1C";
            ctx.font = "22px Orbitron";

            ctx.fillText(
                "NIVEL " + opcion.numero,
                opcion.x + 100,
                250
            );

            ctx.font = "16px 'Asap Condensed'";


            ctx.fillText(
                opcion.descripcion,
                opcion.x + 100,
                315
            );
        });

        canvas.onclick = (event) => {

            const { x, y } = obtenerCoordenadas(event);

            for (const opcion of niveles) {

                if (
                    x >= opcion.x &&
                    x <= opcion.x + 200 &&
                    y >= 210 &&
                    y <= 340
                ) {
                    nivel = opcion.numero;

                    mostrarSeleccionCantidad();
                    return;
                }
            }
        };
    }
    // -------------------------
    // SELECCIÓN DE CANTIDAD
    // -------------------------

    function mostrarSeleccionCantidad() {
        ctx.fillStyle = "#040F1C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "center";
        ctx.fillStyle = "#FFC035";
        ctx.font = "36px Orbitron";

        ctx.fillText(
            "ELEGÍ LA CANTIDAD DE PIEZAS",
            canvas.width / 2,
            150
        );

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

            ctx.fillText(
                opcion.cantidad + " PIEZAS",
                opcion.x + 80,
                278
            );
        });

        canvas.onclick = (event) => {
            const { x, y } = obtenerCoordenadas(event);

            for (const opcion of opciones) {
                if (
                    x >= opcion.x &&
                    x <= opcion.x + 160 &&
                    y >= 230 &&
                    y <= 310
                ) {
                    cantidadPiezas = opcion.cantidad;
                    iniciarPuzzle();
                    return;
                }
            }
        };
    }

    // -------------------------
    // INICIAR PUZZLE
    // -------------------------

    function iniciarPuzzle() {
        piezas = [];
        mostrarOriginal = false;

        const columnas = cantidadPiezas / 2;
        const filas = 2;

        for (let fila = 0; fila < filas; fila++) {
            for (let columna = 0; columna < columnas; columna++) {
                const rotaciones = [0, 90, 180, 270];

                piezas.push({
                    fila: fila,
                    columna: columna,
                    rotacion: rotaciones[
                        Math.floor(Math.random() * rotaciones.length)
                    ]
                });
            }
        }

        // Evitar que el puzzle comience resuelto.
        if (piezas.every(pieza => pieza.rotacion === 0)) {
            piezas[0].rotacion = 90;
        }

        iniciarTemporizador();
        mostrarImagenSeleccionada();
    }

    // -------------------------
    // TEMPORIZADOR
    // -------------------------

    function iniciarTemporizador() {
        clearInterval(temporizador);

        tiempo = 0;

        temporizador = setInterval(() => {
            tiempo++;
            mostrarImagenSeleccionada();
        }, 1000);
    }

    // -------------------------
    // DIBUJAR PUZZLE
    // -------------------------

    function mostrarImagenSeleccionada() {
        const imagen = imagenesCargadas[imagenSeleccionada];

        if (!imagen || !imagen.complete || imagen.naturalWidth === 0) {
            return;
        }

        ctx.fillStyle = "#040F1C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "center";
        ctx.fillStyle = "#FFC035";
        ctx.font = "36px Orbitron";
        ctx.fillText("BLOCKA", canvas.width / 2, 45);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "18px 'Asap Condensed'";
        ctx.fillText(
            "Clic izquierdo o derecho para girar las piezas",
            canvas.width / 2,
            75
        );

        ctx.textAlign = "right";
        ctx.fillStyle = "#FFC035";
        ctx.font = "20px Orbitron";
        ctx.fillText(
            "TIEMPO: " + tiempo + " s",
            canvas.width - 30,
            45
        );

        ctx.textAlign = "center";

        const columnas = cantidadPiezas / 2;
        const filas = 2;

        const anchoPieza = 400 / columnas;
        const altoPieza = 300 / filas;

        // Espacio entre las piezas.
        const separacionX = anchoPieza + 12;
        const separacionY = altoPieza + 12;

        // Centrar horizontalmente las piezas.
        const xInicial = canvas.width / 2 -
            ((columnas - 1) * separacionX) / 2;

        // Posición vertical de la primera fila.
        const yInicial = 205;

        piezas.forEach(pieza => {
            const centroX =
                xInicial + pieza.columna * separacionX;

            const centroY =
                yInicial + pieza.fila * separacionY;

            const origenX =
                pieza.columna * (imagen.width / columnas);

            const origenY =
                pieza.fila * (imagen.height / filas);

            const anchoOrigen = imagen.width / columnas;
            const altoOrigen = imagen.height / filas;

            ctx.save();

            // Filtro correspondiente al nivel.
            if (mostrarOriginal) {
                ctx.filter = "none";
            } else if (nivel === 1) {
                ctx.filter = "grayscale(100%)";
            } else if (nivel === 2) {
                ctx.filter = "brightness(130%)";
            } else if (nivel === 3) {
                ctx.filter = "invert(100%)";
            } else {
                ctx.filter = "none";
            }

            // Girar la pieza alrededor de su centro.
            ctx.translate(centroX, centroY);
            ctx.rotate(pieza.rotacion * Math.PI / 180);

            ctx.drawImage(
                imagen,
                origenX,
                origenY,
                anchoOrigen,
                altoOrigen,
                -anchoPieza / 2,
                -altoPieza / 2,
                anchoPieza,
                altoPieza
            );

            ctx.restore();
            ctx.filter = "none";

            // Marco de la pieza.
            ctx.strokeStyle = "#FFC035";
            ctx.lineWidth = 2;

            ctx.strokeRect(
                centroX - anchoPieza / 2,
                centroY - altoPieza / 2,
                anchoPieza,
                altoPieza
            );
        });

        // -------------------------
        // CLIC IZQUIERDO
        // -------------------------

        canvas.onclick = (event) => {
            const { x, y } = obtenerCoordenadas(event);
            const pieza = buscarPieza(x, y);

            if (pieza === null) {
                return;
            }

            // Girar 90 grados hacia la izquierda.
            pieza.rotacion = (pieza.rotacion + 270) % 360;

            mostrarImagenSeleccionada();

            if (verificarPuzzle()) {
                mostrarVictoria();
            }
        };

        // -------------------------
        // CLIC DERECHO
        // -------------------------

        canvas.oncontextmenu = (event) => {
            event.preventDefault();

            const { x, y } = obtenerCoordenadas(event);
            const pieza = buscarPieza(x, y);

            if (pieza === null) {
                return;
            }

            // Girar 90 grados hacia la derecha.
            pieza.rotacion = (pieza.rotacion + 90) % 360;

            mostrarImagenSeleccionada();

            if (verificarPuzzle()) {
                mostrarVictoria();
            }

            return false;
        };

        // -------------------------
        // BUSCAR PIEZA CLICKEADA
        // -------------------------

        function buscarPieza(x, y) {
            for (const pieza of piezas) {
                const centroX =
                    xInicial + pieza.columna * separacionX;

                const centroY =
                    yInicial + pieza.fila * separacionY;

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
    }

    // -------------------------
    // VERIFICAR PUZZLE
    // -------------------------

    function verificarPuzzle() {
        return piezas.every(
            pieza => pieza.rotacion === 0
        );
    }

    // -------------------------
    // PANTALLA DE VICTORIA
    // -------------------------

    function mostrarVictoria() {
    clearInterval(temporizador);
    temporizador = null;

    mostrarOriginal = true;

    const imagen = imagenesCargadas[imagenSeleccionada];

    ctx.fillStyle = "#040F1C";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (imagen && imagen.complete && imagen.naturalWidth > 0) {
        ctx.drawImage(
            imagen,
            250,
            100,
            400,
            300
        );
    }

    ctx.fillStyle = "rgba(4, 15, 28, 0.92)";
    ctx.fillRect(100, 180, 700, 260);

    ctx.textAlign = "center";
    ctx.fillStyle = "#FFC035";
    ctx.font = "32px Orbitron";

    ctx.fillText(
        nivel < 3 ? "¡NIVEL COMPLETADO!" : "¡JUEGO COMPLETADO!",
        canvas.width / 2,
        235
    );

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px 'Asap Condensed'";

    ctx.fillText(
        "¡Muy bien! Reconstruiste la imagen",
        canvas.width / 2,
        275
    );

    ctx.fillStyle = "#FFC035";
    ctx.fillRect(300, 320, 300, 55);

    ctx.fillStyle = "#040F1C";
    ctx.font = "20px Orbitron";

    ctx.fillText(
        nivel < 3 ? "SIGUIENTE NIVEL" : "VOLVER AL MENÚ",
        canvas.width / 2,
        354
    );

    canvas.onclick = (event) => {
        const { x, y } = obtenerCoordenadas(event);

        if (
            x >= 300 &&
            x <= 600 &&
            y >= 320 &&
            y <= 375
        ) {
            if (nivel < 3) {
                nivel++;
                iniciarPuzzle();
            } else {
                nivel = 1;
                mostrarInicio();
            }
        }
    };

    canvas.oncontextmenu = (event) => event.preventDefault();
}

    // -------------------------
    // INICIAR JUEGO
    // -------------------------

    mostrarInicio();

});
