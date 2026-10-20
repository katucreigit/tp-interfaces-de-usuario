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
    drawBoardBackground(bgImage) {
        if (bgImage) {
            const boardSize = this.canvas.height; 

            this.boardSize = boardSize;
            this.boardX = (this.canvas.width - boardSize) / 2; 
            this.boardY = 0; 

            this.ctx.drawImage(bgImage, this.boardX, this.boardY, this.boardSize, this.boardSize);
        }
    }

    drawHints(hints, time) {
        if (!hints || !Array.isArray(hints)) return;
        hints.forEach(hint => {
            hint.draw(this.ctx, time);
        });
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
