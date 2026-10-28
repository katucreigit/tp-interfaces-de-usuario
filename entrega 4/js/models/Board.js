
/**
 * Clase que gestiona la matriz lógica, las reglas y el dibujo del tablero.
 */
class Board {
    constructor() {
        // -1: Inválido, 0: Vacío, 1: Ficha
        this.grid = [
            [-1, -1,  1,  1,  1, -1, -1],
            [-1, -1,  1,  1,  1, -1, -1],
            [ 1,  1,  1,  1,  1,  1,  1],
            [ 1,  1,  1,  0,  1,  1,  1],
            [ 1,  1,  1,  1,  1,  1,  1],
            [-1, -1,  1,  1,  1, -1, -1],
            [-1, -1,  1,  1,  1, -1, -1]
        ];
    }

    draw(ctx, offsetX, offsetY, cellSize) {
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {

                // Dibujar solamente las casillas válidas
                if (this.grid[row][col] !== -1) {
                    const x = offsetX + col * cellSize;
                    const y = offsetY + row * cellSize;
                    const radio = cellSize * 0.3;

                    // Superficie de la casilla
                    ctx.fillStyle = '#8B5A2B';
                    ctx.fillRect(x, y, cellSize, cellSize);

                    // Borde de la casilla
                    ctx.strokeStyle = '#5C351A';
                    ctx.strokeRect(x, y, cellSize, cellSize);

                    // Hueco circular
                    ctx.beginPath();
                    ctx.arc(x + cellSize / 2, y + cellSize / 2, radio, 0, Math.PI * 2);
                    ctx.fillStyle = '#4A2B16';
                    ctx.fill();
                }
            }
        }
    }

    getValidMoves(peg, offsetX, offsetY, cellSize) {
        const moves = [];

        const directions = [
            { dr: -2, dc: 0, midR: -1, midC: 0 },
            { dr:  2, dc: 0, midR:  1, midC: 0 },
            { dr:  0, dc: -2, midR: 0, midC: -1 },
            { dr:  0, dc:  2, midR: 0, midC: 1 }
        ];

        for (const dir of directions) {
            const targetR = peg.row + dir.dr;
            const targetC = peg.col + dir.dc;

            const midR = peg.row + dir.midR;
            const midC = peg.col + dir.midC;

            // Comprobar que el destino y la posición intermedia
            // estén dentro de los límites de la matriz.
            if (targetR >= 0 && targetR < 7 && targetC >= 0 && targetC < 7 &&
                midR >= 0 && midR < 7 && midC >= 0 && midC < 7 &&
                this.grid[targetR][targetC] === 0 && this.grid[midR][midC] === 1
            ) {
                const hintX = offsetX + targetC * cellSize + cellSize / 2;

                const hintY = offsetY + targetR * cellSize + cellSize / 2;

                moves.push({
                    toRow: targetR,
                    toCol: targetC,
                    midRow: midR,
                    midCol: midC,
                    x: hintX,
                    y: hintY
                });
            }
        }

        return moves;
    }
}

