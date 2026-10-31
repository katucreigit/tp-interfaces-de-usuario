/**
 * Controlador principal que conecta los eventos del usuario con los modelos y vistas.
 */
class GameController {
    constructor(canvasId, spriteImg) {
	    this.view = new GameView(canvasId);
	    this.board = new Board();
	    this.spriteImg = spriteImg;

        this.cellSize = 0;
        this.offsetX = 0;
        this.offsetY = 0;

        this.pegs = [];
        this.currentValidMoves = [];
        this.selectedPeg = null;
        this.dragOffset = { x: 0, y: 0 };

        this.timeLeft = 300;
        this.gameOver = false;
        this.gameStarted = false;
        this.timerInterval = null;
        this.endMessage = "";
        this.hints = [];

        this.calcularDimensionesTablero();
        this.setupEvents();
        this.loop(0);
    }

    initGame() {
    clearInterval(this.timerInterval);

    this.board = new Board();
    this.pegs = [];
    this.currentValidMoves = [];
    this.selectedPeg = null;
    this.hints = [];

    this.timeLeft = 300;
    this.gameOver = false;
    this.gameStarted = true;
    this.endMessage = "";

    this.createPegs();
    this.startTimer();
}

    restartGame() {
    this.initGame();
}    

	calcularDimensionesTablero() {
	    const anchoGrilla = 480;

	    this.cellSize = anchoGrilla / 7;

	    // Centrar el tablero horizontalmente
	    this.offsetX = (this.view.canvas.width - anchoGrilla) / 2;

	    // Centrar el tablero verticalmente
	    this.offsetY = (this.view.canvas.height - anchoGrilla) / 2;
	}


  

    createPegs() {
        this.pegs = [];
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                if (this.board.grid[r][c] === 1) {
                    const x = this.offsetX + c * this.cellSize + this.cellSize / 2;
                    const y = this.offsetY + r * this.cellSize + this.cellSize / 2;
                    
                    // Recorte seguro utilizando el tamaño real de la imagen cargada
                    const crop = { 
                        sx: 0, 
                        sy: 0, 
                        sWidth: this.spriteImg.naturalWidth, 
                        sHeight: this.spriteImg.naturalHeight 
                    };
                    
                    const peg = new Peg(r, c, x, y, this.cellSize * 0.38, this.spriteImg, crop);
                    this.pegs.push(peg);
                }
            }
        }
    }

    setupEvents() {
        const canvas = this.view.canvas;
        canvas.addEventListener('mousedown', e => this.handleMouseDown(e));
        canvas.addEventListener('mousemove', e => this.handleMouseMove(e));
        canvas.addEventListener('mouseup', e => this.handleMouseUp(e));
    }

    
	getCanvasCoords(e) {
	    const rect = this.view.canvas.getBoundingClientRect();

	    return {
		x: (e.clientX - rect.left) * (this.view.canvas.width / rect.width),
		y: (e.clientY - rect.top) * (this.view.canvas.height / rect.height)
	    };
	}

    handleMouseDown(e) {
    
    const coords = this.getCanvasCoords(e);

// Comenzar partida (Solo si hacen clic dentro del botón de la pantalla inicial)
    if (!this.gameStarted) {
        const btnWidth = 240;
        const btnHeight = 55;
        const btnX = (this.view.canvas.width - btnWidth) / 2;
        const btnY = 250;

        if (
            coords.x >= btnX &&
            coords.x <= btnX + btnWidth &&
            coords.y >= btnY &&
            coords.y <= btnY + btnHeight
        ) {
            this.initGame();
        }
        return;
    }
    // Boton para reiniciar la partida
    const botonX = this.view.canvas.width - 193;
    const botonY = 15;

    if (
        coords.x >= botonX &&
        coords.x <= botonX + 185 &&
        coords.y >= botonY &&
        coords.y <= botonY + 48
    ) {
        this.restartGame();
        return;
    }

    // Comenzar partida
    if (!this.gameStarted) {
        this.initGame();
        return;
    }

    // Si la partida termino, permitir reiniciar
    // Si la partida terminó, permitir reiniciar en el botón central de game over
    if (this.gameOver) {
        const btnWidth = 220;
        const btnHeight = 48;
        const btnX = (this.view.canvas.width - btnWidth) / 2;
        
        // Calculamos la misma posición 'Y' centrada que usamos en la vista
        const panelHeight = 200;
        const panelY = (this.view.canvas.height - panelHeight) / 2 - 20;
        const btnY = panelY + 105;

        if (
            coords.x >= btnX &&
            coords.x <= btnX + btnWidth &&
            coords.y >= btnY &&
            coords.y <= btnY + btnHeight
        ) {
            this.restartGame();
        }

        return;
    }

    // Buscar la ficha seleccionada
    for (let i = this.pegs.length - 1; i >= 0; i--) {
        if (this.pegs[i].isPointInside(coords.x, coords.y)) {
            this.selectedPeg = this.pegs[i];
            this.selectedPeg.isDragging = true;

            this.dragOffset.x = 0;
            this.dragOffset.y = 0;

            // Obtener movimientos validos de la ficha
            const validMoves = this.board.getValidMoves(
                this.selectedPeg,
                this.offsetX,
                this.offsetY,
                this.cellSize
            );

            this.hints = validMoves.map(m => ({
                x: m.x,
                y: m.y,
                radius: this.cellSize * 0.35
            }));

            this.currentValidMoves = validMoves;
            break;
        }
    }
}

    handleMouseMove(e) {
    if (this.selectedPeg && this.selectedPeg.isDragging) {
        const coords = this.getCanvasCoords(e);

        this.selectedPeg.x = coords.x;
        this.selectedPeg.y = coords.y;
    }
}

    
	
handleMouseUp(e) {
    if (!this.selectedPeg) return;

    const peg = this.selectedPeg;
    const coords = this.getCanvasCoords(e);
    let targetMove = null;

    for (const move of this.currentValidMoves) {
        const dist = Math.hypot(
            coords.x - move.x,
            coords.y - move.y
        );

        if (dist < this.cellSize * 0.4) {
            targetMove = move;
            break;
        }
    }

    if (targetMove) {
        this.executeMove(peg, targetMove);
    } else {
        peg.resetPosition();
    }

    peg.isDragging = false;
    this.selectedPeg = null;
    this.hints = [];
    this.currentValidMoves = [];

    this.checkGameStatus();
}



executeMove(peg, move) {
    // 1. Actualizar la matriz del tablero
    this.board.grid[peg.row][peg.col] = 0;
    this.board.grid[move.midRow][move.midCol] = 0;
    this.board.grid[move.toRow][move.toCol] = 1;

    // 2. Eliminar la ficha que fue saltada
    this.pegs = this.pegs.filter(p =>
        !(p.row === move.midRow && p.col === move.midCol)
    );

    // 3. Actualizar la ficha que se movió
    peg.row = move.toRow;
    peg.col = move.toCol;

    peg.x = move.x;
    peg.y = move.y;

    peg.originalX = move.x;
    peg.originalY = move.y;
}

    
	
	checkGameStatus() {
    if (this.gameOver || !this.gameStarted) return;

    const totalPegs = this.countTotalPegs();
    const ganoCompletamente =
        totalPegs === 1 && this.board.grid[3][3] === 1;

    let hasMoves = false;

    for (const peg of this.pegs) {
        if (
            this.board.getValidMoves(
                peg,
                this.offsetX,
                this.offsetY,
                this.cellSize
            ).length > 0
        ) {
            hasMoves = true;
            break;
        }
    }

    if (ganoCompletamente) {
        this.endGame("¡GANASTE!");
    } else if (this.timeLeft <= 0) {
        this.endGame("¡SE ACABÓ EL TIEMPO!");
    } else if (!hasMoves) {
        this.endGame("¡NO HAY MÁS MOVIMIENTOS!");
    }
}


    endGame(message) {
    this.gameOver = true;
    this.endMessage = message;

    clearInterval(this.timerInterval);
}
    
	startTimer() {
        clearInterval(this.timerInterval);

	    this.timerInterval = setInterval(() => {
		if (this.timeLeft > 0) {
		    this.timeLeft--;
		}

		if (this.timeLeft <= 0) {
		    this.checkGameStatus();
		}
	    }, 1000);
	}


    countTotalPegs() {
        return this.pegs.length;
    }

    countAvailableMoves() {
    let totalMoves = 0;

    for (const peg of this.pegs) {
        totalMoves += this.board.getValidMoves(
            peg,
            this.offsetX,
            this.offsetY,
            this.cellSize
        ).length;
    }

    return totalMoves;
    }

    
	loop(timestamp) {
    this.view.clear();

    this.board.draw(
        this.view.ctx,
        this.offsetX,
        this.offsetY,
        this.cellSize
    );

    this.view.drawPegs(this.pegs, this.selectedPeg);
    this.view.drawHints(this.hints, timestamp);
    this.view.drawUI(
        this.timeLeft,
        this.gameOver,
        this.countTotalPegs(),
        this.endMessage,
        this.countAvailableMoves()
    );

    if (!this.gameStarted) {
    this.view.drawStartScreen();
}

    requestAnimationFrame((t) => this.loop(t));
}
}
