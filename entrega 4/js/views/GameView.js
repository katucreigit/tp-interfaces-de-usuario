
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

    this.ctx.fillStyle = "#be1e1e";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

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

            ctx.strokeStyle = '#80DEEA';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.stroke();

            // Flecha animada
            const offsetY = Math.sin(time * 0.01) * 6;

            ctx.fillStyle = '#80DEEA';
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
            selectedPeg.draw(this.ctx);
        }
    }


drawUI(timeLeft, gameOver, totalPegs, endMessage, availableMoves) {
    const ctx = this.ctx;

    ctx.save();

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const secsStr = secs < 10 ? "0" + secs : secs;

    ctx.textAlign = "left";

    // Estilo de las tarjetas
    const dibujarTarjeta = (x, y, ancho, alto) => {
        ctx.fillStyle = "rgba(14,30,42, 0.75)";
        ctx.beginPath();
        ctx.roundRect(x, y, ancho, alto, 25);
        ctx.fill();

        ctx.strokeStyle = "rgba(14,30,42, 0.75)";
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    // Tarjeta del tiempo
    dibujarTarjeta(8, 15, 185, 48);

    ctx.fillStyle = "#B9CBE3";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("TIEMPO", 18, 33);

    ctx.fillStyle = "#F1F5F9";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(mins + ":" + secsStr, 18, 54);

    // Tarjeta de fichas
    dibujarTarjeta(8, 72, 185, 48);

    ctx.fillStyle = "#B9CBE3";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("FICHAS RESTANTES", 18, 90);

    ctx.fillStyle = "#F1F5F9";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(totalPegs.toString(), 18, 111);

    // Tarjeta de movimientos
    dibujarTarjeta(8, 129, 185, 55);

    ctx.fillStyle = "#B9CBE3";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("MOVIMIENTOS", 18, 148);

    ctx.fillStyle = "#F1F5F9";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(availableMoves.toString(), 18, 173);

    // Botón de reiniciar
    const botonX = this.canvas.width - 193;
    const botonY = 15;

    ctx.fillStyle = "#0e1e2a";
    ctx.beginPath();
    ctx.roundRect(botonX, botonY, 185, 48, 25);
    ctx.fill();

    ctx.strokeStyle = "#6F94C4";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("↻  REINICIAR", botonX + 92.5, 44);

    ctx.restore();

        // Pantalla final
        if (gameOver) {
            ctx.fillStyle = "rgba(45, 0, 0, 0.90)";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.textAlign = "center";

            // Panel central
            

            ctx.fillStyle = "#80DEEA";
            ctx.font = "bold 26px sans-serif";
            ctx.fillText(
                endMessage,
                this.canvas.width / 2,
                225
            );

            // Botón de reiniciar
            ctx.fillStyle = "#1565C0";
            ctx.fillRect(
                this.canvas.width / 2 - 110,
                270,
                220,
                55
            );

            ctx.strokeStyle = "#80DEEA";
            ctx.lineWidth = 2;
            ctx.strokeRect(
                this.canvas.width / 2 - 110,
                270,
                220,
                55
            );

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 20px sans-serif";
            ctx.fillText(
                "REINICIAR",
                this.canvas.width / 2,
                305
            );
        }

        ctx.restore();
    }
}

