document.addEventListener("DOMContentLoaded", () => {

    // Juego Peg Solitaire
    const canvasJuego = document.getElementById("canvasJuego");

    if (canvasJuego) {
        Promise.all([
            cargarImagen("../img/peg/ficha.jpg"),
            cargarImagen("../img/peg/ficha2.jpg")
        ]).then(([spriteImg1, spriteImg2]) => {
            const juego = new GameController("canvasJuego", [spriteImg1, spriteImg2]);
        }).catch(error => {
            console.error("No se pudo cargar la imagen de la ficha:", error);
        });
    }

    // Juego Runner
    const contenedorRunner = document.getElementById("juego");

    if (contenedorRunner) {
        const modelo = new runnerModel(900, 500);
        const vista = new runnerView();
        const controlador = new runnerController(modelo, vista);

        Promise.all([
            cargarImagen("../img/runner/pato-volando.png"),
            cargarImagen("../img/runner/pato-impulso.png"),
            cargarImagen("../img/runner/pato-choque.png"),
            cargarImagen("../img/runner/moneda.png"),
            cargarImagen("../img/runner/mosca.png")
        ]).then(() => {
            controlador.iniciar();
        }).catch(error => {
            console.error("No se pudieron cargar las imágenes del Runner:", error);
        });
    }

});

function cargarImagen(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}
