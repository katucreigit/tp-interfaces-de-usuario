class Board {
    constructor() {
        // -1: Inválido, 0: Vacío, 1: Ficha
        this.grid = [
            [-1, -1,  1,  1,  1, -1, -1],
            [-1, -1,  1,  1,  1, -1, -1],
            [ 1,  1,  1,  1,  1,  1,  1],
            [ 1,  1,  0,  1,  0,  1,  0],
            [ 1,  1,  1,  1,  1,  1,  1],
            [-1, -1,  1,  1,  1, -1, -1],
            [-1, -1,  1,  1,  1, -1, -1]
        ];
    }
    isVisited(posicionesVisitadas, targetC, targetR){
        for(const pos of posicionesVisitadas){
            if(pos.c ===targetC && pos.r === targetR)
                return true;
        }
        return false;
    }
	//recibe una ficha y calcula cuántos y cuáles movimientos válidos puede hacer(saltando sobre otra ficha hacia un espacio vacío)
    getValidMoves(col, row, prevMoves, posicionesVisitadas) {
        posicionesVisitadas.push({c: col,
                                r: row}
                            );
        const moves = [];
        
        const directions = [ //dr: mov a destino horiz., dc: mov a destino vert., midR: ficha "comible" horiz, midC: ficha "comible" vert.
            { dr: -2, dc: 0, midR: -1, midC: 0 },
            { dr:  2, dc: 0, midR:  1, midC: 0 },
            { dr:  0, dc: -2, midR:  0, midC: -1 },
            { dr:  0, dc:  2, midR:  0, midC:  1 },
        ];

        for (const dir of directions) {
            const targetR = row + dir.dr;
            const targetC = col + dir.dc;
            const midR = row + dir.midR;
            const midC = col + dir.midC;

            if (targetR >= 0 && targetR < 7 && targetC >= 0 && targetC < 7 &&
                midR >= 0 && midR < 7 && midC >= 0 && midC < 7 &&
                this.grid[targetR][targetC] === 0 && this.grid[midR][midC] === 1 &&
                !this.isVisited(posicionesVisitadas, targetC, targetR)) {                

                const currentMove={
                    toRow: targetR,
                    toCol: targetC,
                    midRow: midR,
                    midCol: midC,
                    prevMoves: prevMoves
                };
                moves.push(currentMove);
                const prevMovesCopy= [...prevMoves];
                prevMovesCopy.push(currentMove);

                //guarda los movimientos posibles que se encuentran a partir del movimiento actual
                const siguientesMovimientos = this.getValidMoves(targetC, targetR, prevMovesCopy, posicionesVisitadas);
                for (let j = 0; j < siguientesMovimientos.length; j++) {
                    moves.push(siguientesMovimientos[j]);
                }
            }
        }
        posicionesVisitadas.pop();
        return moves;
    }
}
