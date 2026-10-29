/**
 * Clase encargada exclusivamente del renderizado en el Canvas.
 */
class GameView {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Dibuja el tablero cuadrado pegado a los bordes superior e inferior.
     */

    
drawHints(hints, time) {
    const ctx = this.ctx;

    for (const hint of hints) {
        ctx.save();

        const pulse = Math.sin(time * 0.006) * 4;
        const currentRadius = hint.radius + pulse;

        // Círculo exterior animado
        ctx.beginPath();
        ctx.arc(
            hint.x,
            hint.y,
            Math.max(2, currentRadius),
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.stroke();

        // Flecha animada
        const offsetY = Math.sin(time * 0.01) * 6;

        ctx.fillStyle = '#00ffcc';
        ctx.beginPath();
        ctx.moveTo(hint.x, hint.y - 12 + offsetY);
        ctx.lineTo(hint.x - 7, hint.y - 22 + offsetY);
        ctx.lineTo(hint.x + 7, hint.y - 22 + offsetY);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}
    drawPegs(pegs, selectedPeg) {
        pegs.forEach(peg => {
            if (peg !== selectedPeg) {
                peg.draw(this.ctx);
            }
        });
        if (selectedPeg) {
            selectedPeg.draw(this.ctx); // Se dibuja al frente mientras se arrastra
        }
    }

  drawUI(timeLeft, gameOver, totalPegs, endMessage, availableMoves) {
    const ctx = this.ctx;

    ctx.save();

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const secsStr = secs < 10 ? "0" + secs : secs;

    ctx.textAlign = "left";

    // Tarjeta del tiempo
    ctx.fillStyle = "#0B1B30";
    ctx.fillRect(8, 15, 185, 48);

    ctx.strokeStyle = "#2B5EEB";
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 15, 185, 48);

    ctx.fillStyle = "#FFC035";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("TIEMPO", 18, 33);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(mins + ":" + secsStr, 18, 54);


    // Tarjeta de fichas
    ctx.fillStyle = "#0B1B30";
    ctx.fillRect(8, 72, 185, 48);

    ctx.strokeStyle = "#2B5EEB";
    ctx.strokeRect(8, 72, 185, 48);

    ctx.fillStyle = "#FFC035";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("FICHAS RESTANTES", 18, 90);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(totalPegs.toString(), 18, 111);


    // Tarjeta de movimientos
    ctx.fillStyle = "#0B1B30";
    ctx.fillRect(8, 129, 185, 55);

    ctx.strokeStyle = "#2B5EEB";
    ctx.strokeRect(8, 129, 185, 55);

    ctx.fillStyle = "#FFC035";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("MOVIMIENTOS", 18, 148);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(availableMoves.toString(), 18, 173);


    // Boton de reiniciar
    const botonX = this.canvas.width - 193;
    const botonY = 15;

    ctx.fillStyle = "#2B5EEB";
    ctx.fillRect(botonX, botonY, 185, 48);

    ctx.strokeStyle = "#FFC035";
    ctx.lineWidth = 2;
    ctx.strokeRect(botonX, botonY, 185, 48);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
        "REINICIAR PARTIDA",
        botonX + 92.5,
        botonY + 29
    );


    // Pantalla final
    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.textAlign = "center";

        ctx.fillStyle = "#FFC035";
        ctx.font = "bold 30px sans-serif";
        ctx.fillText(
            endMessage,
            this.canvas.width / 2,
            220
        );

        ctx.fillStyle = "#2B5EEB";
        ctx.fillRect(
            this.canvas.width / 2 - 110,
            285,
            220,
            55
        );

        ctx.strokeStyle = "#FFC035";
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.canvas.width / 2 - 110,
            285,
            220,
            55
        );

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(
            "REINICIAR",
            this.canvas.width / 2,
            320
        );
    }

    ctx.restore();
}


}
