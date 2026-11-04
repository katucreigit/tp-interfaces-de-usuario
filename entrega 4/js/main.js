document.addEventListener("DOMContentLoaded", () => {
    const canvasJuego = document.getElementById("canvasJuego");
    if (!canvasJuego) return;

    Promise.all([
        cargarImagen("img/peg/ficha.jpg"), 
        cargarImagen("img/peg/ficha2.jpg")
    ]).then(([spriteImg1, spriteImg2]) => {
        const juego = new GameController("canvasJuego", [spriteImg1, spriteImg2]);
    }).catch(error => {
        console.error("No se pudo cargar la imagen de la ficha:", error);
    });
});
function cargarImagen(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}
