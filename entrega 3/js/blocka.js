document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("canvasBlocka");
    const ctx = canvas.getContext("2d");

    let imagenSeleccionada = 0;


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


    // Guardamos las imágenes cargadas

    const imagenesCargadas = [];

    for (let i = 0; i < imagenes.length; i++) {

        const imagen = new Image();

        imagen.src = imagenes[i];

        imagenesCargadas.push(imagen);

    }


    // -------------------------
    // PANTALLA INICIAL
    // -------------------------

    function mostrarInicio() {

        ctx.fillStyle = "#040F1C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        ctx.fillStyle = "#FFC035";
        ctx.font = "50px Orbitron";
        ctx.textAlign = "center";

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


        // Botón comenzar

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

    }


function mostrarSeleccion() {

    ctx.fillStyle = "#040F1C";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.fillStyle = "#FFC035";
    ctx.font = "36px Orbitron";

    ctx.fillText(
        "ELEGÍ UNA IMAGEN",
        canvas.width / 2,
        60
    );


    let posicion = 0;


    const animacion = setInterval(() => {

        ctx.fillStyle = "#040F1C";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


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


            ctx.drawImage(
                imagenesCargadas[i],
                x,
                y,
                220,
                160
            );


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


        posicion++;

        if (posicion >= imagenesCargadas.length) {
            posicion = 0;
        }

    }, 300);


    // CLICK SOBRE UNA IMAGEN

    canvas.onclick = (event) => {

        const rect = canvas.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;


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

                clearInterval(animacion);

                imagenSeleccionada = i;

                console.log(
                    "Imagen seleccionada:",
                    imagenSeleccionada + 1
                );


                mostrarImagenSeleccionada();

                break;

            }

        }

    };

}

    // -------------------------
    // MOSTRAR IMAGEN SELECCIONADA
    // -------------------------

    function mostrarImagenSeleccionada() {

        ctx.fillStyle = "#040F1C";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle = "#FFC035";
        ctx.font = "36px Orbitron";

        ctx.fillText(
            "IMAGEN SELECCIONADA",
            canvas.width / 2,
            70
        );


        ctx.drawImage(
            imagenesCargadas[imagenSeleccionada],
            250,
            110,
            400,
            300
        );

    }


    // -------------------------
    // CLICK EN COMENZAR
    // -------------------------

    canvas.addEventListener("click", (event) => {

        const rect = canvas.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;


        // Botón COMENZAR

        if (
            x >= canvas.width / 2 - 110 &&
            x <= canvas.width / 2 + 110 &&
            y >= 260 &&
            y <= 320
        ) {

            mostrarSeleccion();

        }

    });


    mostrarInicio();

});


