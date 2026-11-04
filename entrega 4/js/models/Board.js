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
	//recibe una ficha y calcula cuántos y cuáles movimientos válidos puede hacer(saltando sobre otra ficha hacia un espacio vacío)
    getValidMoves(peg, offsetX, offsetY, cellSize) {
        const moves = [];
        
        const directions = [ //dr: mov a destino horiz., dc: mov a destino vert., midR: ficha "comible" horiz, midC: ficha "comible" vert.
            { dr: -2, dc: 0, midR: -1, midC: 0 },
            { dr:  2, dc: 0, midR:  1, midC: 0 },
            { dr:  0, dc: -2, midR:  0, midC: -1 },
            { dr:  0, dc:  2, midR:  0, midC:  1 }
        ];

        for (const dir of directions) {
            const targetR = peg.row + dir.dr;
            const targetC = peg.col + dir.dc;
            const midR = peg.row + dir.midR;
            const midC = peg.col + dir.midC;

            if (targetR >= 0 && targetR < 7 && targetC >= 0 && targetC < 7 &&
                midR >= 0 && midR < 7 && midC >= 0 && midC < 7 &&
                this.grid[targetR][targetC] === 0 && this.grid[midR][midC] === 1) {
                
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
