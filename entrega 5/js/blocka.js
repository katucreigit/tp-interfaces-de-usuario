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
    let cantidadPiezas = 4;
    let juegoTerminado = false;
    let records = JSON.parse(localStorage.getItem("blockaRecords")) || {};

    let iconosListos = false;
    const fuenteIconos = new FontFace(
        "Font Awesome 6 Free",
        'url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/webfonts/fa-solid-900.woff2)',
        { weight: "900" }
    );

    fuenteIconos.load().then(fuente => {
        document.fonts.add(fuente);
        iconosListos = true;
    }).catch(error => {
        console.error("No se pudieron cargar los iconos", error);
    });

    const imagenes = [
        "img/blocka/imagen1.jpg",
        "img/blocka/imagen2.jpg",
        "img/blocka/imagen3.jpg",
        "img/blocka/imagen4.jpg",
        "img/blocka/imagen5.jpg",
        "img/blocka/imagen6.jpg"
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

    function dibujarFondo() {
        const degradado = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        degradado.addColorStop(0, "#080D0A");
        degradado.addColorStop(0.55, "#0D1710");
        degradado.addColorStop(1, "#101F15");

        ctx.fillStyle = degradado;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(57, 255, 120, 0.035)";

        for (let x = 20; x < canvas.width; x += 40) {
            for (let y = 20; y < canvas.height; y += 40) {
                ctx.beginPath();
                ctx.arc(x, y, 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function dibujarRectanguloRedondeado(x, y, ancho, alto, radio, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x, y, ancho, alto, radio);
        ctx.fill();
    }

    function dibujarIcono(icono, x, y, tamano, color) {
        if (!iconosListos) return;

        ctx.save();
        ctx.font = `900 ${tamano}px "Font Awesome 6 Free"`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(icono, x, y);
        ctx.restore();
    }

    function dibujarBoton(texto, x, y, ancho, alto, seleccionado = true, tamano = 16, icono = null) {
        dibujarRectanguloRedondeado(
            x, y, ancho, alto, 12,
            seleccionado ? "#39FF78" : "#17251B"
        );

        ctx.strokeStyle = seleccionado ? "#72FFA0" : "#31583C";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x, y, ancho, alto, 12);
        ctx.stroke();

        const colorTexto = seleccionado ? "#07110A" : "#E6F3E9";
        ctx.fillStyle = colorTexto;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `bold ${tamano}px Orbitron`;

        if (icono && iconosListos) {
            const anchoIcono = tamano + 2;
            const separacion = 9;
            const anchoTexto = ctx.measureText(texto).width;
            const anchoTotal = anchoIcono + separacion + anchoTexto;
            const inicioX = x + (ancho - anchoTotal) / 2;

            dibujarIcono(
                icono,
                inicioX + anchoIcono / 2,
                y + alto / 2,
                anchoIcono,
                colorTexto
            );

            ctx.fillText(
                texto,
                inicioX + anchoIcono + separacion + anchoTexto / 2,
                y + alto / 2
            );
        } else {
            ctx.fillText(texto, x + ancho / 2, y + alto / 2);
        }

        ctx.textBaseline = "alphabetic";
    }

    function dibujarEncabezado(titulo, subtitulo = "") {
        ctx.textAlign = "center";
        ctx.fillStyle = "#39FF78";
        ctx.font = "bold 36px Orbitron";
        ctx.shadowColor = "rgba(57, 255, 120, 0.35)";
        ctx.shadowBlur = 14;
        ctx.fillText(titulo, canvas.width / 2, 58);
        ctx.shadowBlur = 0;

        if (subtitulo) {
            ctx.fillStyle = "#B7C9BC";
            ctx.font = "18px 'Asap Condensed'";
            ctx.fillText(subtitulo, canvas.width / 2, 88);
        }
    }

    function dibujarTarjeta(x, y, ancho, alto, activa = false) {
        dibujarRectanguloRedondeado(
            x, y, ancho, alto, 14,
            activa ? "#183522" : "#111B14"
        );

        ctx.strokeStyle = activa ? "#39FF78" : "#294331";
        ctx.lineWidth = activa ? 2.5 : 1.3;
        ctx.beginPath();
        ctx.roundRect(x, y, ancho, alto, 14);
        ctx.stroke();
    }

    function obtenerFiltro(nivel) {
        if (nivel === 1) return "grayscale(100%)";
        if (nivel === 2) return "brightness(30%)";
        if (nivel === 3) return "invert(100%)";

        const filtros = [
            "grayscale(100%)",
            "brightness(30%)",
            "invert(100%)"
        ];

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
        clearTimeout(animacion);

        temporizador = null;
        animacion = null;
        juegoTerminado = true;

        dibujarFondo();

        dibujarRectanguloRedondeado(
            canvas.width / 2 - 260,
            72,
            520,
            290,
            24,
            "#0E1911"
        );

        ctx.strokeStyle = "#294331";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(canvas.width / 2 - 260, 72, 520, 290, 24);
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.fillStyle = "#39FF78";
        ctx.font = "bold 62px Orbitron";
        ctx.shadowColor = "rgba(57, 255, 120, 0.45)";
        ctx.shadowBlur = 20;
        ctx.fillText("BLOCKA", canvas.width / 2, 155);
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#E6F3E9";
        ctx.font = "23px 'Asap Condensed'";
        ctx.fillText(
            "Reconstruí la imagen girando sus piezas",
            canvas.width / 2,
            205
        );

        ctx.fillStyle = "#91A999";
        ctx.font = "16px 'Asap Condensed'";
        ctx.fillText(
            "Elegí un nivel, girá las piezas y completá el desafío",
            canvas.width / 2,
            235
        );

        dibujarBoton(
            "COMENZAR",
            canvas.width / 2 - 120,
            270,
            240,
            58,
            true,
            20,
            "\uf04b"
        );

        canvas.oncontextmenu = event => event.preventDefault();

        canvas.onclick = event => {
            const { x, y } = obtenerCoordenadas(event);

            if (
                x >= canvas.width / 2 - 120 &&
                x <= canvas.width / 2 + 120 &&
                y >= 270 &&
                y <= 328
            ) {
                tiempo = 0;
                mostrarSeleccionNivel();
            }
        };
    }

    function mostrarSeleccion() {
        clearTimeout(animacion);
        clearInterval(temporizador);

        temporizador = null;
        animacion = null;
        juegoTerminado = true;
        canvas.onclick = null;

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
            dibujarFondo();
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.font = "22px 'Asap Condensed'";
            ctx.fillText(
                "No se pudieron cargar las imágenes.",
                canvas.width / 2,
                canvas.height / 2
            );
            return;
        }

        const imagenFinal =
            imagenesDisponibles[
                Math.floor(Math.random() * imagenesDisponibles.length)
            ];

        let posicion = 0;
        let pasos = 0;
        let velocidad = 100;
        const totalPasos = imagenesCargadas.length * 2;

        function dibujarSeleccion(zoom = 1, brillo = 0) {
            dibujarFondo();

            dibujarEncabezado(
                brillo > 0 ? "¡IMAGEN SELECCIONADA!" : "ELIGIENDO IMAGEN",
                brillo > 0
                    ? "Preparando el desafío..."
                    : "Buscando tu próximo desafío..."
            );

            const imagen = imagenesCargadas[posicion];
            const ancho = 360 * zoom;
            const alto = 250 * zoom;
            const x = (canvas.width - ancho) / 2;
            const y = 260 - alto / 2;

            if (brillo > 0) {
                ctx.save();
                ctx.shadowColor = "#39FF78";
                ctx.shadowBlur = 18 + brillo * 25;
                ctx.strokeStyle = `rgba(57, 255, 120, ${brillo})`;
                ctx.lineWidth = 3 + brillo * 3;
                ctx.beginPath();
                ctx.roundRect(x - 10, y - 10, ancho + 20, alto + 20, 16);
                ctx.stroke();
                ctx.restore();
            }

            dibujarTarjeta(
                x - 10,
                y - 10,
                ancho + 20,
                alto + 20,
                true
            );

            if (imagen && imagen.complete && imagen.naturalWidth > 0) {
                ctx.save();

                if (brillo > 0) {
                    ctx.shadowColor = "#39FF78";
                    ctx.shadowBlur = 12 + brillo * 24;
                }

                ctx.beginPath();
                ctx.roundRect(x, y, ancho, alto, 12);
                ctx.clip();
                ctx.drawImage(imagen, x, y, ancho, alto);
                ctx.restore();
            }

            ctx.textAlign = "center";
            ctx.fillStyle = brillo > 0 ? "#FFFFFF" : "#39FF78";
            ctx.font = "bold 16px Orbitron";
            ctx.fillText(
                brillo > 0
                    ? "✓ IMAGEN " + (posicion + 1)
                    : "IMAGEN " + (posicion + 1),
                canvas.width / 2,
                425
            );
        }

        dibujarSeleccion();

        function avanzarAnimacion() {
            posicion = (posicion + 1) % imagenesCargadas.length;
            pasos++;

            if (pasos >= totalPasos) {
                posicion = imagenFinal;
                imagenSeleccionada = imagenFinal;
                imagenAnterior = imagenFinal;
                animacion = null;

                let cuadro = 0;
                const totalCuadros = 8;

                function confirmarSeleccion() {
                    cuadro++;

                    const progreso = cuadro / totalCuadros;
                    const zoom = 1 + Math.sin(progreso * Math.PI) * 0.045;
                    const brillo = Math.sin(progreso * Math.PI);

                    dibujarSeleccion(zoom, brillo);

                    if (cuadro < totalCuadros) {
                        animacion = setTimeout(confirmarSeleccion, 45);
                    } else {
                        animacion = null;
                        posicion = imagenFinal;
                        dibujarSeleccion(1, 0.25);

                        setTimeout(() => {
                            piezas = [];
                            mostrarSeleccionCantidad();
                        }, 650);
                    }
                }

                confirmarSeleccion();
                return;
            }

            dibujarSeleccion();

            if (pasos > totalPasos - 5) {
                velocidad += 90;
            }

            animacion = setTimeout(avanzarAnimacion, velocidad);
        }

        animacion = setTimeout(avanzarAnimacion, velocidad);

        canvas.oncontextmenu = event => event.preventDefault();
    }

    function mostrarSeleccionNivel() {
        clearInterval(temporizador);
        clearTimeout(animacion);

        temporizador = null;
        animacion = null;
        juegoTerminado = true;

        dibujarFondo();
        dibujarEncabezado(
            "ELEGÍ UN NIVEL",
            "Superá cada desafío para desbloquear el siguiente"
        );

        const niveles = [
            { numero: 1, x: 90, y: 120 },
            { numero: 2, x: 350, y: 120 },
            { numero: 3, x: 610, y: 120 },
            { numero: 4, x: 90, y: 300 },
            { numero: 5, x: 350, y: 300 },
            { numero: 6, x: 610, y: 300 }
        ];

        niveles.forEach(opcion => {
            const desbloqueado = opcion.numero <= nivelesDesbloqueados;

            dibujarTarjeta(
                opcion.x,
                opcion.y,
                200,
                130,
                desbloqueado
            );

            ctx.textAlign = "center";
            ctx.fillStyle = desbloqueado ? "#39FF78" : "#758078";
            ctx.font = "bold 22px Orbitron";
            ctx.fillText(
                "NIVEL " + opcion.numero,
                opcion.x + 100,
                opcion.y + 42
            );

            if (desbloqueado) {
                if (records[opcion.numero] !== undefined) {
                    ctx.fillStyle = "#91FFA9";
                    ctx.font = "14px 'Asap Condensed'";
                    ctx.fillText(
                        "Récord: " + records[opcion.numero] + " s",
                        opcion.x + 100,
                        opcion.y + 105
                    );
                }
            } else {
                dibujarIcono(
                    "\uf023",
                    opcion.x + 100,
                    opcion.y + 68,
                    24,
                    "#758078"
                );

                ctx.fillStyle = "#8A938D";
                ctx.font = "14px 'Asap Condensed'";
                ctx.fillText(
                    "BLOQUEADO",
                    opcion.x + 100,
                    opcion.y + 100
                );
            }
        });

        canvas.onclick = event => {
            const { x, y } = obtenerCoordenadas(event);

            for (const opcion of niveles) {
                if (
                    x >= opcion.x &&
                    x <= opcion.x + 200 &&
                    y >= opcion.y &&
                    y <= opcion.y + 130
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
        clearTimeout(animacion);
        juegoTerminado = true;
        animacion = null;

        dibujarFondo();
        dibujarEncabezado(
            "CANTIDAD DE PIEZAS",
            "Elegí la dificultad para este desafío"
        );

        const cantidades = [4, 6, 8];
        const ancho = 150;
        const alto = 70;
        const separacion = 25;
        const inicioX = (
            canvas.width -
            (cantidades.length * ancho +
                (cantidades.length - 1) * separacion)
        ) / 2;

        cantidades.forEach((cantidad, i) => {
            const x = inicioX + i * (ancho + separacion);
            const y = 220;

            dibujarTarjeta(
                x,
                y,
                ancho,
                alto,
                cantidadPiezas === cantidad
            );

            ctx.textAlign = "center";
            ctx.fillStyle = cantidadPiezas === cantidad
                ? "#39FF78"
                : "#E6F3E9";
            ctx.font = "bold 30px Orbitron";
            ctx.fillText(cantidad, x + ancho / 2, y + 43);
        });

        const botonX = canvas.width / 2 - 100;
        const botonY = 340;
        const botonAncho = 200;
        const botonAlto = 60;

        dibujarBoton(
            "COMENZAR",
            botonX,
            botonY,
            botonAncho,
            botonAlto,
            true,
            18,
            "\uf04b"
        );

        canvas.onclick = event => {
            const { x, y } = obtenerCoordenadas(event);

            if (y >= 220 && y <= 290) {
                cantidades.forEach((cantidad, i) => {
                    const xBoton = inicioX + i * (ancho + separacion);

                    if (
                        x >= xBoton &&
                        x <= xBoton + ancho
                    ) {
                        cantidadPiezas = cantidad;
                        mostrarSeleccionCantidad();
                    }
                });
            }

            if (
                x >= botonX &&
                x <= botonX + botonAncho &&
                y >= botonY &&
                y <= botonY + botonAlto
            ) {
                iniciarPuzzle();
            }
        };

        canvas.oncontextmenu = event => event.preventDefault();
    }

    function iniciarPuzzle() {
        piezas = [];
        juegoTerminado = false;
        tiempo = 0;
        tiempoMaximo = obtenerTiempoMaximo(nivel);

        const columnas = cantidadPiezas / 2;
        const rotaciones = [0, 90, 180, 270];

        for (let fila = 0; fila < 2; fila++) {
            for (let columna = 0; columna < columnas; columna++) {
                piezas.push({
                    fila,
                    columna,
                    rotacion: rotaciones[
                        Math.floor(Math.random() * rotaciones.length)
                    ],
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

        if (verificarPuzzle()) {
            mostrarVictoria();
        }
    }

    function mostrarImagenSeleccionada() {
        const imagen = imagenesCargadas[imagenSeleccionada];

        if (!imagen || !imagen.complete || imagen.naturalWidth === 0) return;

        dibujarFondo();
        dibujarEncabezado("BLOCKA");

        ctx.fillStyle = "#B7C9BC";
        ctx.textAlign = "center";
        ctx.font = "17px 'Asap Condensed'";
        ctx.fillText(
            "Hace clic izquierdo o derecho para girar las piezas",
            canvas.width / 2,
            91
        );

        dibujarBoton(
            "NIVELES",
            25,
            20,
            180,
            40,
            false,
            14,
            "\uf060"
        );

        const panelX = canvas.width - 215;
        const panelY = 20;
        const panelAncho = 185;
        const panelAlto = 42;

        dibujarRectanguloRedondeado(
            panelX,
            panelY,
            panelAncho,
            panelAlto,
            12,
            "#111B14"
        );

        ctx.strokeStyle = "#31583C";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(
            panelX,
            panelY,
            panelAncho,
            panelAlto,
            12
        );
        ctx.stroke();

        const colorTiempo =
            tiempoMaximo !== null && tiempoMaximo - tiempo <= 10
                ? "#FF7474"
                : "#39FF78";

        const textoTiempo = "TIEMPO " + tiempo + " s";
        ctx.font = "bold 15px Orbitron";

        const anchoTextoTiempo = ctx.measureText(textoTiempo).width;
        const anchoIconoTiempo = 17;
        const separacionTiempo = 7;
        const anchoTotalTiempo =
            anchoIconoTiempo +
            separacionTiempo +
            anchoTextoTiempo;

        const inicioTiempo =
            panelX + (panelAncho - anchoTotalTiempo) / 2;

        dibujarIcono(
            "\uf017",
            inicioTiempo + anchoIconoTiempo / 2,
            panelY + panelAlto / 2,
            anchoIconoTiempo,
            colorTiempo
        );

        ctx.fillStyle = colorTiempo;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            textoTiempo,
            inicioTiempo +
                anchoIconoTiempo +
                separacionTiempo +
                anchoTextoTiempo / 2,
            panelY + panelAlto / 2
        );
        ctx.textBaseline = "alphabetic";

        if (nivel >= 4) {
            dibujarBoton(
                "AYUDITA +5 s",
                25,
                70,
                180,
                40,
                false,
                13,
                "\uf0eb"
            );
        }

        const columnas = cantidadPiezas / 2;
        const filas = 2;
        const anchoPieza = 400 / columnas;
        const altoPieza = 300 / filas;
        const separacionX = anchoPieza + 12;
        const separacionY = altoPieza + 12;
        const xInicial =
            canvas.width / 2 -
            ((columnas - 1) * separacionX) / 2;
        const yInicial = 205;

        dibujarRectanguloRedondeado(
            25,
            120,
            850,
            360,
            18,
            "rgba(7, 16, 10, 0.55)"
        );

        ctx.strokeStyle = "#203A28";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(25, 120, 850, 360, 18);
        ctx.stroke();

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
            ctx.translate(centroX, centroY);
            ctx.rotate(pieza.rotacion * Math.PI / 180);

            ctx.drawImage(
                pieza.imagenFiltrada,
                -anchoPieza / 2,
                -altoPieza / 2,
                anchoPieza,
                altoPieza
            );

            ctx.restore();

            ctx.strokeStyle = pieza.fija
                ? "#39FF78"
                : "#4D9B63";
            ctx.lineWidth = pieza.fija ? 4 : 2;

            ctx.strokeRect(
                centroX - anchoPieza / 2,
                centroY - altoPieza / 2,
                anchoPieza,
                altoPieza
            );
        });

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

        canvas.onclick = event => {
            if (juegoTerminado) return;

            const { x, y } = obtenerCoordenadas(event);

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

            const pieza = buscarPieza(x, y);

            if (!pieza || pieza.fija) return;

            pieza.rotacion = (pieza.rotacion + 270) % 360;
            mostrarImagenSeleccionada();

            if (verificarPuzzle()) {
                mostrarVictoria();
            }
        };

        canvas.oncontextmenu = event => {
            event.preventDefault();

            if (juegoTerminado) return false;

            const { x, y } = obtenerCoordenadas(event);

            if (
                (x >= 25 && x <= 205 && y >= 20 && y <= 60) ||
                (
                    nivel >= 4 &&
                    x >= 25 &&
                    x <= 205 &&
                    y >= 70 &&
                    y <= 110
                )
            ) {
                return false;
            }

            const pieza = buscarPieza(x, y);

            if (!pieza || pieza.fija) return false;

            pieza.rotacion = (pieza.rotacion + 90) % 360;
            mostrarImagenSeleccionada();

            if (verificarPuzzle()) {
                mostrarVictoria();
            }

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

        const nuevoRecord = guardarRecord();

        if (
            nivel === nivelesDesbloqueados &&
            nivelesDesbloqueados < 6
        ) {
            nivelesDesbloqueados++;
        }

        const imagen = imagenesCargadas[imagenSeleccionada];

        dibujarFondo();

        if (imagen && imagen.complete && imagen.naturalWidth > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(250, 35, 400, 220, 14);
            ctx.clip();
            ctx.drawImage(imagen, 250, 35, 400, 220);
            ctx.restore();
        }

        dibujarTarjeta(100, 265, 700, 225, true);

        ctx.textAlign = "center";
        ctx.fillStyle = "#39FF78";
        ctx.font = "bold 27px Orbitron";
        ctx.fillText(
            nivel < 6
                ? "¡NIVEL COMPLETADO!"
                : "¡JUEGO COMPLETADO!",
            canvas.width / 2,
            310
        );

        ctx.fillStyle = "#E6F3E9";
        ctx.font = "19px 'Asap Condensed'";
        ctx.fillText(
            "¡Muy bien! Reconstruiste la imagen",
            canvas.width / 2,
            342
        );

        ctx.fillStyle = "#B7C9BC";
        ctx.font = "17px Orbitron";
        ctx.fillText(
            "TIEMPO: " + tiempo + " s",
            canvas.width / 2,
            373
        );

        ctx.fillStyle = nuevoRecord ? "#39FF78" : "#D7E7DB";
        ctx.font = "16px 'Asap Condensed'";
        ctx.fillText(
            nuevoRecord
                ? "✦ ¡NUEVO RÉCORD! ✦"
                : obtenerTextoRecord(),
            canvas.width / 2,
            398
        );

        const botones = [
            {
                texto: "INICIO",
                x: 120,
                ancho: 180,
                icono: "\uf015",
                accion: mostrarInicio
            },
            {
                texto: "NIVELES",
                x: 360,
                ancho: 180,
                icono: "\uf060",
                accion: mostrarSeleccionNivel
            }
        ];

        if (nivel < 6) {
            botones.push({
                texto: "SIGUIENTE NIVEL",
                x: 600,
                ancho: 180,
                icono: "\uf04b",
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
            dibujarBoton(
                boton.texto,
                boton.x,
                425,
                boton.ancho,
                45,
                true,
                13,
                boton.icono
            );
        });

        canvas.onclick = event => {
            const { x, y } = obtenerCoordenadas(event);

            for (const boton of botones) {
                if (
                    x >= boton.x &&
                    x <= boton.x + boton.ancho &&
                    y >= 425 &&
                    y <= 470
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

        dibujarFondo();
        dibujarTarjeta(150, 105, 600, 310, true);

        ctx.textAlign = "center";
        ctx.fillStyle = "#FF7777";
        ctx.font = "bold 34px Orbitron";
        ctx.fillText(
            "¡TIEMPO AGOTADO!",
            canvas.width / 2,
            175
        );

        ctx.fillStyle = "#E6F3E9";
        ctx.font = "20px 'Asap Condensed'";
        ctx.fillText(
            "No lograste reconstruir la imagen a tiempo",
            canvas.width / 2,
            220
        );

        ctx.fillStyle = "#A9BDAE";
        ctx.font = "18px Orbitron";
        ctx.fillText(
            "NIVEL " + nivel,
            canvas.width / 2,
            265
        );

        dibujarBoton(
            "VOLVER A NIVELES",
            300,
            305,
            300,
            55,
            true,
            16,
            "\uf060"
        );

        dibujarBoton(
            "VOLVER AL INICIO",
            300,
            375,
            300,
            50,
            false,
            15,
            "\uf015"
        );

        canvas.onclick = event => {
            const { x, y } = obtenerCoordenadas(event);

            if (
                x >= 300 &&
                x <= 600 &&
                y >= 305 &&
                y <= 360
            ) {
                mostrarSeleccionNivel();
            } else if (
                x >= 300 &&
                x <= 600 &&
                y >= 375 &&
                y <= 425
            ) {
                mostrarInicio();
            }
        };

        canvas.oncontextmenu = event => event.preventDefault();
    }

    mostrarInicio();

    const video = document.querySelector(".video-imagen video");
    const overlay = document.querySelector(".video-overlay");
    const iconoVideo = overlay?.querySelector("i");

    if (video && overlay) {
        overlay.addEventListener("click", () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        video.addEventListener("play", () => {
            if (iconoVideo) {
                iconoVideo.classList.remove("fa-play");
                iconoVideo.classList.add("fa-pause");
            }
        });

        video.addEventListener("pause", () => {
            if (iconoVideo) {
                iconoVideo.classList.remove("fa-pause");
                iconoVideo.classList.add("fa-play");
            }
        });
    }
});
