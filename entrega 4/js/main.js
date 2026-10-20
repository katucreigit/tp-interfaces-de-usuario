document.addEventListener("DOMContentLoaded", () => {
    const canvasJuego = document.getElementById("canvasJuego");
    if (!canvasJuego) return;

    const tableroImg = new Image();
    tableroImg.src = "../img/peg/tablero.jpg";

    const spriteImg = new Image();
    spriteImg.src = "../img/peg/ficha.jpg";

    Promise.all([
        new Promise(resolve => tableroImg.onload = resolve),
        new Promise(resolve => spriteImg.onload = resolve)
    ]).then(() => {
        const juego = new GameController("canvasJuego", tableroImg, spriteImg);
    });
});
