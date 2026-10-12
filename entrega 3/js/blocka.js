document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("canvasBlocka");
    const ctx = canvas.getContext("2d");

    let imagenSeleccionada = 0;
    let piezas = [];
    let animacion = null;

    let tiempo = 0;
    let tiempoMaximo = null;
    let temporizador = null;

    let nivel = 1;
    let nivelesDesbloqueados = 1;

    let mostrarOriginal = false;
    let cantidadPiezas = 4;

    // Guarda el mejor tiempo de cada nivel.
    let records = JSON.parse(
        localStorage.getItem("blockaRecords")
    ) || {};

    // BANCO DE IMÁGENES
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

    // COORDENADAS DEL CANVAS
    function obtenerCoordenadas(event) {

        const rect = canvas.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) *
                canvas.width / rect.width,

            y: (event.clientY - rect.top) *
                canvas.height / rect.height
        };
    }

    // OBTENER FILTRO SEGÚN NIVEL
    function obtenerFiltro(nivel) {

        if (nivel === 1) {
            return "grayscale(100%)";
        }

        if (nivel === 2) {
            return "brightness(30%)";
        }

        if (nivel === 3) {
            return "invert(100%)";
        }

        // NIVELES 4, 5 Y 6
        const filtros = [
            "grayscale(100%)",
            "brightness(30%)",
            "invert(100%)"
        ];

        return filtros[
            Math.floor(Math.random() * filtros.length)
        ];
    }

    // OBTENER TIEMPO MÁXIMO
    function obtenerTiempoMaximo(nivel) {

        if (nivel === 4) {
            return 90;
        }

        if (nivel === 5) {
            return 60;
        }

        if (nivel === 6) {
            return 40;
        }

        return null;
    }

    // GUARDAR RÉCORD
    function guardarRecord() {

        const recordAnterior = records[nivel];

        if (
            recordAnterior === undefined ||
            tiempo < recordAnterior
        ) {

            records[nivel] = tiempo;

            localStorage.setItem(
                "blockaRecords",
                JSON.stringify(records)
            );

            return true;
        }

        return false;
    }

    // OBTENER TEXTO DEL RÉCORD
    function obtenerTextoRecord() {

        if (records[nivel] === undefined) {
            return "Récord: --";
        }

        return "Récord: " + records[nivel] + " s";
    }

    // PANTALLA INICIAL
    function mostrarInicio() {

        clearInterval(temporizador);
        clearInterval(animacion);

        temporizador = null;
        animacion = null;

        ctx.fillStyle = "#040F1C";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.textAlign = "center";

        ctx.fillStyle = "#FFC035";
        ctx.font = "50px Orbitron";

        ctx.fillText(
            "BLOCKA",
            canvas.width / 2,
            130
        );

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "24px 'Asap Condensed'";

        ctx.fillText(
            "Reconstruí la imagen girando sus piezas",
            canvas.width / 2,
            190
        );

        ctx.fillStyle = "#FFC035";

        ctx.fillRect(
            canvas.width / 2 - 110,
            260,
            220,
            60
        );

        ctx.fillStyle = "#040F1C";
        ctx.font = "24px Orbitron";

        ctx.fillText(
            "COMENZAR",
            canvas.width / 2,
            299
        );

        canvas.oncontextmenu = (event) =>
            event.preventDefault();

        canvas.onclick = (event) => {

            const { x, y } =
                obtenerCoordenadas(event);

            if (
                x >= canvas.width / 2 - 110 &&
                x <= canvas.width / 2 + 110 &&
                y >= 260 &&
                y <= 320
            ) {

                tiempo = 0;

                mostrarSeleccion();
            }
        };
    }

    // SELECCIÓN DE IMAGEN
    function mostrarSeleccion() {

        clearInterval(animacion);

        let posicion = 0;

        function dibujarSeleccion() {

            ctx.fillStyle = "#040F1C";

            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.textAlign = "center";

            ctx.fillStyle = "#FFC035";
            ctx.font = "36px Orbitron";

            ctx.fillText(
                "ELEGÍ UNA IMAGEN",
                canvas.width / 2,
                60
            );

            for (
                let i = 0;
                i < imagenesCargadas.length;
                i++
            ) {

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

                    ctx.strokeRect(
                        x - 5,
                        y - 5,
                        230,
                        170
                    );
                }
            }
        }

        dibujarSeleccion();

        animacion = setInterval(() => {

            posicion++;

            if (
                posicion >=
                imagenesCargadas.length
            ) {
                posicion = 0;
            }

            dibujarSeleccion();

        }, 300);

        canvas.onclick = (event) => {

            const { x, y } =
                obtenerCoordenadas(event);

            for (
                let i = 0;
                i < imagenesCargadas.length;
                i++
            ) {

                const columna = i % 3;
                const fila = Math.floor(i / 3);

                const imagenX =
                    80 + columna * 270;

                const imagenY =
                    100 + fila * 220;

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

        canvas.oncontextmenu = (event) =>
            event.preventDefault();
    }

    // SELECCIÓN DE NIVEL
    function mostrarSeleccionNivel() {

        clearInterval(temporizador);
        clearInterval(animacion);

        temporizador = null;
        animacion = null;

        ctx.fillStyle = "#040F1C";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.textAlign = "center";

        ctx.fillStyle = "#FFC035";
        ctx.font = "36px Orbitron";

        ctx.fillText(
            "ELEGÍ UN NIVEL",
            canvas.width / 2,
            65
        );

        const niveles = [
            {
                numero: 1,
                x: 80,
                y: 120
            },
            {
                numero: 2,
                x: 320,
                y: 120
            },
            {
                numero: 3,
                x: 560,
                y: 120
            },
            {
                numero: 4,
                x: 80,
                y: 300
            },
            {
                numero: 5,
                x: 320,
                y: 300
            },
            {
                numero: 6,
                x: 560,
                y: 300
            }
        ];

        niveles.forEach(opcion => {

            const desbloqueado =
                opcion.numero <= nivelesDesbloqueados;

            ctx.fillStyle = desbloqueado
                ? "#FFC035"
                : "#555555";

            ctx.fillRect(
                opcion.x,
                opcion.y,
                200,
                130
            );

            ctx.fillStyle = desbloqueado
                ? "#040F1C"
                : "#CCCCCC";

            ctx.font = "22px Orbitron";

            ctx.fillText(
                "NIVEL " + opcion.numero,
                opcion.x + 100,
                opcion.y + 45
            );

            ctx.font = "18px 'Asap Condensed'";

            if (desbloqueado) {

                ctx.fillText(
                    opcion.numero < 4
                        ? "FÁCIL"
                        : "DIFÍCIL",
                    opcion.x + 100,
                    opcion.y + 85
                );

                if (records[opcion.numero] !== undefined) {

                    ctx.font =
                        "14px 'Asap Condensed'";

                    ctx.fillText(
                        "Récord: " +
                        records[opcion.numero] +
                        " s",
                        opcion.x + 100,
                        opcion.y + 108
                    );
                }

            } else {

                ctx.fillText(
                    "🔒 BLOQUEADO",
                    opcion.x + 100,
                    opcion.y + 85
                );
            }
        });

        canvas.onclick = (event) => {

            const { x, y } =
                obtenerCoordenadas(event);

            for (const opcion of niveles) {

                if (
                    x >= opcion.x &&
                    x <= opcion.x + 200 &&
                    y >= opcion.y &&
                    y <= opcion.y + 130
                ) {

                    if (
                        opcion.numero >
                        nivelesDesbloqueados
                    ) {
                        return;
                    }

                    nivel = opcion.numero;

                    mostrarSeleccionCantidad();

                    return;
                }
            }
        };

        canvas.oncontextmenu = (event) =>
            event.preventDefault();
    }

    // SELECCIÓN DE CANTIDAD
    function mostrarSeleccionCantidad() {

        ctx.fillStyle = "#040F1C";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.textAlign = "center";

        ctx.fillStyle = "#FFC035";
        ctx.font = "36px Orbitron";

        ctx.fillText(
            "ELEGÍ LA CANTIDAD DE PIEZAS",
            canvas.width / 2,
            150
        );

        const opciones = [
            {
                cantidad: 4,
                x: 150
            },
            {
                cantidad: 6,
                x: 370
            },
            {
                cantidad: 8,
                x: 590
            }
        ];

        opciones.forEach(opcion => {

            ctx.fillStyle = "#FFC035";

            ctx.fillRect(
                opcion.x,
                230,
                160,
                80
            );

            ctx.fillStyle = "#040F1C";
            ctx.font = "28px Orbitron";

            ctx.fillText(
                opcion.cantidad + " PIEZAS",
                opcion.x + 80,
                278
            );
        });

        canvas.onclick = (event) => {

            const { x, y } =
                obtenerCoordenadas(event);

            for (const opcion of opciones) {

                if (
                    x >= opcion.x &&
                    x <= opcion.x + 160 &&
                    y >= 230 &&
                    y <= 310
                ) {

                    cantidadPiezas =
                        opcion.cantidad;

                    iniciarPuzzle();

                    return;
                }
            }
        };

        canvas.oncontextmenu = (event) =>
            event.preventDefault();
    }

    // INICIAR PUZZLE
    function iniciarPuzzle() {

        piezas = [];
        mostrarOriginal = false;

        tiempo = 0;

        tiempoMaximo =
            obtenerTiempoMaximo(nivel);

        const columnas =
            cantidadPiezas / 2;

        const filas = 2;

        for (
            let fila = 0;
            fila < filas;
            fila++
        ) {

            for (
                let columna = 0;
                columna < columnas;
                columna++
            ) {

                const rotaciones = [
                    0,
                    90,
                    180,
                    270
                ];

                piezas.push({

                    fila: fila,

                    columna: columna,

                    rotacion:
                        rotaciones[
                            Math.floor(
                                Math.random() *
                                rotaciones.length
                            )
                        ],

                    filtro:
                        obtenerFiltro(nivel),

                    // NUEVO:
                    // Indica si la Ayudita fijó esta pieza.
                    fija: false
                });
            }
        }

        // Evitar que el puzzle comience resuelto.
        if (
            piezas.every(
                pieza => pieza.rotacion === 0
            )
        ) {

            piezas[0].rotacion = 90;
        }

        iniciarTemporizador();

        mostrarImagenSeleccionada();
    }

    // TEMPORIZADOR
    function iniciarTemporizador() {

        clearInterval(temporizador);

        tiempo = 0;

        temporizador = setInterval(() => {

            tiempo++;

            // NIVELES CON LÍMITE DE TIEMPO
            if (
                tiempoMaximo !== null &&
                tiempo >= tiempoMaximo
            ) {

                clearInterval(temporizador);

                temporizador = null;

                mostrarTiempoAgotado();

                return;
            }

            mostrarImagenSeleccionada();

        }, 1000);
    }

    // =====================================================
    // AYUDITA
    // =====================================================

    function usarAyudita() {

        // Solo funciona en niveles 4, 5 y 6.
        if (nivel < 4) {
            return;
        }

        // Buscamos piezas que:
        // 1. No estén fijadas.
        // 2. Todavía estén mal orientadas.
        const piezasDisponibles = piezas.filter(
            pieza =>
                !pieza.fija &&
                pieza.rotacion !== 0
        );

        // Si no quedan piezas para ayudar,
        // no hacemos nada.
        if (piezasDisponibles.length === 0) {
            return;
        }

        // Elegimos una pieza al azar.
        const pieza =
            piezasDisponibles[
                Math.floor(
                    Math.random() *
                    piezasDisponibles.length
                )
            ];

        // La colocamos correctamente.
        pieza.rotacion = 0;

        // La dejamos fija.
        pieza.fija = true;

        // La ayuda suma 5 segundos
        // al tiempo utilizado.
        tiempo += 5;

        // Volvemos a dibujar el puzzle
        // para mostrar el cambio.
        mostrarImagenSeleccionada();

         // Comprobar si la ayudita completó el nivel
        if (verificarPuzzle()) {
            mostrarVictoria();
        }
    }

    // DIBUJAR PUZZLE
    function mostrarImagenSeleccionada() {

        const imagen =
            imagenesCargadas[imagenSeleccionada];

        if (
            !imagen ||
            !imagen.complete ||
            imagen.naturalWidth === 0
        ) {
            return;
        }

        ctx.fillStyle = "#040F1C";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.textAlign = "center";

        ctx.fillStyle = "#FFC035";
        ctx.font = "36px Orbitron";

        ctx.fillText(
            "BLOCKA",
            canvas.width / 2,
            45
        );

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "18px 'Asap Condensed'";

        ctx.fillText(
            "Clic izquierdo o derecho para girar las piezas",
            canvas.width / 2,
            75
        );

        // TIEMPO
        ctx.textAlign = "right";
        ctx.fillStyle = "#FFC035";
        ctx.font = "20px Orbitron";

        if (tiempoMaximo !== null) {

            const tiempoRestante =
                tiempoMaximo - tiempo;

            ctx.fillText(
                "TIEMPO: " +
                tiempoRestante +
                " s",
                canvas.width - 30,
                45
            );

        } else {

            ctx.fillText(
                "TIEMPO: " +
                tiempo +
                " s",
                canvas.width - 30,
                45
            );
        }

        // BOTÓN VOLVER A NIVELES
        ctx.textAlign = "left";

        ctx.fillStyle = "#FFC035";

        ctx.fillRect(
            25,
            20,
            180,
            40
        );

        ctx.fillStyle = "#040F1C";
        ctx.font = "16px Orbitron";

        ctx.fillText(
            "← NIVELES",
            40,
            46
        );

        // BOTÓN AYUDITA
        // Solo aparece en niveles 4, 5 y 6.
        if (nivel >= 4) {

            ctx.textAlign = "left";

            ctx.fillStyle = "#FFC035";

            ctx.fillRect(
                25,
                70,
                180,
                40
            );

            ctx.fillStyle = "#040F1C";
            ctx.font = "16px Orbitron";

            ctx.fillText(
                "AYUDITA +5 s",
                40,
                96
            );
        }

        ctx.textAlign = "center";

        const columnas =
            cantidadPiezas / 2;

        const filas = 2;

        const anchoPieza =
            400 / columnas;

        const altoPieza =
            300 / filas;

        const separacionX =
            anchoPieza + 12;

        const separacionY =
            altoPieza + 12;

        const xInicial =
            canvas.width / 2 -
            ((columnas - 1) *
                separacionX) / 2;

        const yInicial = 205;

        piezas.forEach(pieza => {

            const centroX =
                xInicial +
                pieza.columna *
                separacionX;

            const centroY =
                yInicial +
                pieza.fila *
                separacionY;

            const origenX =
                pieza.columna *
                (imagen.width / columnas);

            const origenY =
                pieza.fila *
                (imagen.height / filas);

            const anchoOrigen =
                imagen.width / columnas;

            const altoOrigen =
                imagen.height / filas;

            ctx.save();

            // FILTRO DE LA PIEZA
            if (mostrarOriginal) {

                ctx.filter = "none";

            } else {

                ctx.filter = pieza.filtro;
            }

            // GIRAR PIEZA
            ctx.translate(
                centroX,
                centroY
            );

            ctx.rotate(
                pieza.rotacion *
                Math.PI / 180
            );

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

            // MARCO
            ctx.strokeStyle = "#FFC035";
            ctx.lineWidth = 2;

            ctx.strokeRect(
                centroX -
                anchoPieza / 2,
                centroY -
                altoPieza / 2,
                anchoPieza,
                altoPieza
            );
        });

        // CLIC IZQUIERDO
        canvas.onclick = (event) => {

            const { x, y } =
                obtenerCoordenadas(event);

            // BOTÓN AYUDITA
            if (
                nivel >= 4 &&
                x >= 25 &&
                x <= 205 &&
                y >= 70 &&
                y <= 110
            ) {

                usarAyudita();

                return;
            }

            // BOTÓN NIVELES
            if (
                x >= 25 &&
                x <= 205 &&
                y >= 20 &&
                y <= 60
            ) {

                clearInterval(temporizador);

                temporizador = null;

                mostrarSeleccionNivel();

                return;
            }

            const pieza =
                buscarPieza(x, y);

            if (pieza === null) {
                return;
            }

            // Si la pieza fue fijada con Ayudita,
            // no se puede volver a girar.
            if (pieza.fija) {
                return;
            }

            // GIRAR A LA IZQUIERDA
            pieza.rotacion =
                (pieza.rotacion + 270) % 360;

            mostrarImagenSeleccionada();

            if (verificarPuzzle()) {

                mostrarVictoria();
            }
        };

        // CLIC DERECHO
        canvas.oncontextmenu = (event) => {

            event.preventDefault();

            const { x, y } =
                obtenerCoordenadas(event);

            const pieza =
                buscarPieza(x, y);

            if (pieza === null) {
                return;
            }

            // Si la pieza fue fijada con Ayudita,
            // no se puede volver a girar.
            if (pieza.fija) {
                return;
            }

            // GIRAR A LA DERECHA
            pieza.rotacion =
                (pieza.rotacion + 90) % 360;

            mostrarImagenSeleccionada();

            if (verificarPuzzle()) {

                mostrarVictoria();
            }

            return false;
        };

        // BUSCAR PIEZA
        function buscarPieza(x, y) {

            for (const pieza of piezas) {

                const centroX =
                    xInicial +
                    pieza.columna *
                    separacionX;

                const centroY =
                    yInicial +
                    pieza.fila *
                    separacionY;

                if (
                    x >=
                    centroX -
                    anchoPieza / 2 &&

                    x <=
                    centroX +
                    anchoPieza / 2 &&

                    y >=
                    centroY -
                    altoPieza / 2 &&

                    y <=
                    centroY +
                    altoPieza / 2
                ) {

                    return pieza;
                }
            }

            return null;
        }
    }

    // VERIFICAR PUZZLE
    function verificarPuzzle() {

        return piezas.every(
            pieza =>
                pieza.rotacion === 0
        );
    }

    // PANTALLA DE VICTORIA
    function mostrarVictoria() {

        clearInterval(temporizador);

        temporizador = null;

        mostrarOriginal = true;

        const nuevoRecord =
            guardarRecord();

        // DESBLOQUEAR SIGUIENTE NIVEL
        if (
            nivel === nivelesDesbloqueados &&
            nivelesDesbloqueados < 6
        ) {

            nivelesDesbloqueados++;
        }

        const imagen =
            imagenesCargadas[imagenSeleccionada];

        ctx.fillStyle = "#040F1C";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        if (
            imagen &&
            imagen.complete &&
            imagen.naturalWidth > 0
        ) {

            ctx.drawImage(
                imagen,
                250,
                100,
                400,
                300
            );
        }

        ctx.fillStyle =
            "rgba(4, 15, 28, 0.92)";

        ctx.fillRect(
            100,
            180,
            700,
            260
        );

        ctx.textAlign = "center";

        ctx.fillStyle = "#FFC035";
        ctx.font = "32px Orbitron";

        ctx.fillText(
            nivel < 6
                ? "¡NIVEL COMPLETADO!"
                : "¡JUEGO COMPLETADO!",
            canvas.width / 2,
            225
        );

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px 'Asap Condensed'";

        ctx.fillText(
            "¡Muy bien! Reconstruiste la imagen",
            canvas.width / 2,
            265
        );

        // TIEMPO FINAL
        ctx.fillStyle = "#FFC035";
        ctx.font = "22px Orbitron";

        ctx.fillText(
            "TIEMPO: " + tiempo + " s",
            canvas.width / 2,
            305
        );

        // RÉCORD
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "18px 'Asap Condensed'";

        if (nuevoRecord) {

            ctx.fillText(
                "¡NUEVO RÉCORD!",
                canvas.width / 2,
                335
            );

        } else {

            ctx.fillText(
                obtenerTextoRecord(),
                canvas.width / 2,
                335
            );
        }

        // BOTÓN
        ctx.fillStyle = "#FFC035";

        ctx.fillRect(
            300,
            365,
            300,
            55
        );

        ctx.fillStyle = "#040F1C";
        ctx.font = "20px Orbitron";

        ctx.fillText(
            "VOLVER A NIVELES",
            canvas.width / 2,
            399
        );

        canvas.onclick = (event) => {

            const { x, y } =
                obtenerCoordenadas(event);

            if (
                x >= 300 &&
                x <= 600 &&
                y >= 365 &&
                y <= 420
            ) {

                mostrarSeleccionNivel();
            }
        };

        canvas.oncontextmenu = (event) =>
            event.preventDefault();
    }

    // PANTALLA DE TIEMPO AGOTADO
    function mostrarTiempoAgotado() {

        ctx.fillStyle = "#040F1C";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.textAlign = "center";

        ctx.fillStyle = "#FFC035";
        ctx.font = "36px Orbitron";

        ctx.fillText(
            "¡TIEMPO AGOTADO!",
            canvas.width / 2,
            200
        );

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px 'Asap Condensed'";

        ctx.fillText(
            "No lograste reconstruir la imagen a tiempo",
            canvas.width / 2,
            245
        );

        ctx.fillStyle = "#FFC035";
        ctx.font = "20px Orbitron";

        ctx.fillText(
            "Nivel " + nivel,
            canvas.width / 2,
            285
        );

        ctx.fillStyle = "#FFC035";

        ctx.fillRect(
            300,
            320,
            300,
            55
        );

        ctx.fillStyle = "#040F1C";
        ctx.font = "20px Orbitron";

        ctx.fillText(
            "VOLVER A NIVELES",
            canvas.width / 2,
            354
        );

        canvas.onclick = (event) => {

            const { x, y } =
                obtenerCoordenadas(event);

            if (
                x >= 300 &&
                x <= 600 &&
                y >= 320 &&
                y <= 375
            ) {

                mostrarSeleccionNivel();
            }
        };

        canvas.oncontextmenu = (event) =>
            event.preventDefault();
    }

    // INICIAR JUEGO
    mostrarInicio();

});