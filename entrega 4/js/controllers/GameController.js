/**
 * Controlador principal que conecta los eventos del usuario con los modelos y vistas.
 */
class GameController {
    constructor(canvasId, bgImg, spriteImg) {
        this.view = new GameView(canvasId);
        this.board = new Board();
        this.bgImg = bgImg;
        this.spriteImg = spriteImg;

        this.cellSize = 0;
        this.offsetX = 0;
        this.offsetY = 0;

        this.pegs = [];
        this.activeHints = [];
        this.currentValidMoves = [];
        this.selectedPeg = null;
        this.dragOffset = { x: 0, y: 0 };

        this.timeLeft = 300; 
        this.gameOver = false;
        this.timerInterval = null;
        this.hints = [];

        this.initGame();
    }

    initGame() {
        this.calcularDimensionesTablero(); // ¡Calcula las medidas exactas primero!
        this.createPegs();
        this.setupEvents();
        this.startTimer();
        this.loop(0);
    }

    calcularDimensionesTablero() {
        const boardSize = this.view.canvas.height; // 500px (alto total del tablero)
        const boardX = (this.view.canvas.width - boardSize) / 2; // Centrado horizontal
        const boardY = 0; 

        // 🎯 Agrandamos la grilla para que ocupe más espacio en el tablero
        const anchoGrilla = 480; // 👈 Agrandado (de 370 a 420px). Si querés un pelín más, probá 430 o 440.

        this.cellSize = anchoGrilla / 7;

        // Centrado exacto del marco 7x7 dentro de los 500px
        const margen = (boardSize - anchoGrilla) / 2;
        this.offsetX = boardX + margen;
        this.offsetY = boardY + margen;
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
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    handleMouseDown(e) {
        if (this.gameOver) return;
        const coords = this.getCanvasCoords(e);

        for (let i = this.pegs.length - 1; i >= 0; i--) {
            if (this.pegs[i].isPointInside(coords.x, coords.y)) {
                this.selectedPeg = this.pegs[i];
                this.selectedPeg.isDragging = true;
                this.dragOffset.x = coords.x - this.selectedPeg.x;
                this.dragOffset.y = coords.y - this.selectedPeg.y;

                const validMoves = this.board.getValidMoves(this.selectedPeg, this.offsetX, this.offsetY, this.cellSize);
                this.hints = validMoves.map(m => new Hint(m.toRow, m.toCol, m.x, m.y, this.cellSize * 0.35));
                this.currentValidMoves = validMoves;
                break;
            }
        }
    }

    handleMouseMove(e) {
        if (this.selectedPeg && this.selectedPeg.isDragging) {
            const coords = this.getCanvasCoords(e);
            this.selectedPeg.x = coords.x - this.dragOffset.x;
            this.selectedPeg.y = coords.y - this.dragOffset.y;
        }
    }

    handleMouseUp(e) {
        if (!this.selectedPeg) return;
        const coords = this.getCanvasCoords(e);

        let targetMove = null;
        for (const move of this.currentValidMoves) {
            const dist = Math.hypot(coords.x - move.x, coords.y - move.y);
            if (dist < this.cellSize * 0.4) {
                targetMove = move;
                break;
            }
        }

        if (targetMove) {
            this.executeMove(this.selectedPeg, targetMove);
        } else {
            this.selectedPeg.resetPosition();
        }

        this.selectedPeg.isDragging = false;
        this.selectedPeg = null;
        this.hints = [];
        this.currentValidMoves = [];

        this.checkGameStatus();
    }

    executeMove(peg, move) {
        // 1. Actualizar la matriz lógica del tablero (vaciar origen y medio, ocupar destino)
        this.board.grid[peg.row][peg.col] = 0;
        this.board.grid[move.midRow][move.midCol] = 0;
        this.board.grid[move.toRow][move.toCol] = 1;

        // 2. Eliminar la ficha intermedia del arreglo visual 'this.pegs'
        this.pegs = this.pegs.filter(p => 
            !(Number(p.row) === Number(move.midRow) && Number(p.col) === Number(move.midCol))
        );

        // 3. Actualizar la posición de la ficha que realizó el salto
        peg.row = move.toRow;
        peg.col = move.toCol;
        peg.x = move.x;
        peg.y = move.y;
        peg.originalX = move.x;
        peg.originalY = move.y;
    }

    checkGameStatus() {
        let hasMoves = false;
        for (const peg of this.pegs) {
            if (this.board.getValidMoves(peg, this.offsetX, this.offsetY, this.cellSize).length > 0) {
                hasMoves = true;
                break;
            }
        }

        if (!hasMoves || this.timeLeft <= 0) {
            this.gameOver = true;
            clearInterval(this.timerInterval);
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.checkGameStatus();
            }
        }, 1000);
    }

    countTotalPegs() {
        return this.pegs.length;
    }

    loop(timestamp) {
        this.view.clear();
        this.view.drawBoardBackground(this.bgImg);

        this.view.drawPegs(this.pegs, this.selectedPeg);
        this.view.drawHints(this.hints, timestamp);
        this.view.drawUI(this.timeLeft, this.gameOver, this.countTotalPegs());

        requestAnimationFrame((t) => this.loop(t));
    }
}
