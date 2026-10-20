/**
 * Clase que gestiona la matriz lógica y las reglas del tablero.
 */
class Board {
    constructor() {
        // -1: Inválido, 0: Vacío, 1: Ficha
        this.grid = [
            [-1, -1,  1,  1,  1, -1, -1],
            [-1, -1,  1,  1,  1, -1, -1],
            [ 1,  1,  1,  1,  1,  1,  1],
            [ 1,  1,  1,  0,  1,  1,  1], // Centro vacío inicial
            [ 1,  1,  1,  1,  1,  1,  1],
            [-1, -1,  1,  1,  1, -1, -1],
            [-1, -1,  1,  1,  1, -1, -1]
        ];
    }

    getValidMoves(peg, offsetX, offsetY, cellSize) {
        const moves = [];
        const directions = [
            { dr: -2, dc: 0, midR: -1, midC: 0 }, // Salto hacia arriba
            { dr: 2, dc: 0, midR: 1, midC: 0 },   // Salto hacia abajo
            { dr: 0, dc: -2, midR: 0, midC: -1 }, // Salto hacia la izquierda
            { dr: 0, dc: 2, midR: 0, midC: 1 }    // Salto hacia la derecha
        ];

        for (const dir of directions) {
            const targetR = peg.row + dir.dr;
            const targetC = peg.col + dir.dc;
            const midR = peg.row + dir.midR;
            const midC = peg.col + dir.midC; // O puedes usar dir.midCol directamente

            if (
                targetR >= 0 && targetR < 7 && targetC >= 0 && targetC < 7 &&
                this.grid[targetR][targetC] === 0 &&
                this.grid[midR][midC] === 1
            ) {
                const hintX = offsetX + targetC * cellSize + cellSize / 2;
                const hintY = offsetY + targetR * cellSize + cellSize / 2;
                moves.push({
                    toRow: targetR,
                    toCol: targetC,
                    midRow: midR,
                    midCol: midC, // <--- CAMBIADO DE midC a midCol para que coincida con el controlador
                    x: hintX,
                    y: hintY
                });
            }
        }
        return moves;
    }
}
