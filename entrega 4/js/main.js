document.addEventListener("DOMContentLoaded", () => {
    const canvasJuego = document.getElementById("canvasJuego");
    if (!canvasJuego) return;

    const spriteImg = new Image();
    spriteImg.src = "../img/peg/ficha.jpg";

    spriteImg.onload = () => {
        const juego = new GameController("canvasJuego", spriteImg);
    };

    spriteImg.onerror = () => {
        console.error("No se pudo cargar la imagen de la ficha:", spriteImg.src);
    };
});

