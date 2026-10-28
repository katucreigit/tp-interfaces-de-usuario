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

    drawUI(timeLeft, gameOver, totalPegs) {
        this.ctx.save();
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 20px sans-serif';
        
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        const secsStr = secs < 10 ? "0" + secs : secs;
        
        this.ctx.fillText("Tiempo: " + mins + ":" + secsStr, 25, 35);
        this.ctx.fillText("Fichas: " + totalPegs, 25, 65);

        if (gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 38px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('¡FIN DEL JUEGO!', this.canvas.width / 2, this.canvas.height / 2);
        }
        this.ctx.restore();
    }
}
