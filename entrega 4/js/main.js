document.addEventListener("DOMContentLoaded", () => {
    const canvasJuego = document.getElementById("canvasJuego");
    if (!canvasJuego) return;

    // Usamos Promise.all para esperar a que la(s) imagen(es) estén listas
    Promise.all([
        cargarImagen("img/peg/ficha.jpg") // Podés agregar más si manejas varias imágenes
    ]).then(([spriteImg]) => {
        // Una vez que cargó la imagen, recién ahí instanciamos el controlador del juego
        const juego = new GameController("canvasJuego", spriteImg);
    }).catch(error => {
        console.error("No se pudo cargar la imagen de la ficha:", error);
    });
});
// Función auxiliar global para cargar imágenes con Promesas
function cargarImagen(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}
