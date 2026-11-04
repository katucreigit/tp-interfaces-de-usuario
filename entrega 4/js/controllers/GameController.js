class GameController {
    constructor(canvasId, sprites) {
		this.view = new GameView(canvasId);
		this.board = new Board();
		
		this.sprites = sprites;
		this.selectedSpriteIndex = 0;
		this.spriteImg = this.sprites[this.selectedSpriteIndex];

        this.cellSize = 0;
        this.offsetX = 0;
        this.offsetY = 0;

        this.pegs = [];
        this.currentValidMoves = [];
        this.selectedPeg = null;

        this.timeLeft = 300;
        this.gameOver = false;
        this.gameStarted = false;
		this.selectingPeg = false;
        this.endMessage = "";
        this.hints = [];

        this.calcularDimensionesTablero();
        this.setupEvents();
        this.loop(0);
    }
	//inicializa una partida nueva. Se utiliza tanto cuando el jugador elige una ficha como cuando reinicia el juego
    initGame() {
		this.board = new Board();
		
		this.pegs = [];
		this.currentValidMoves = [];
		this.selectedPeg = null;
		this.hints = [];

		this.timeLeft = 300;
		this.gameOver = false;
		this.gameStarted = true;
		this.endMessage = "";
		this.inicio = null;
		
		this.spriteImg = this.sprites[this.selectedSpriteIndex];
		
		this.createPegs();
	}
	//reinicia el juego llamando a initGame
    restartGame() {
	    this.initGame();
	}    
	//calcula el tamaño de las casillas y donde debe ubicarse el tablero para que quede centrado
	calcularDimensionesTablero() {
	    const anchoGrilla = 480;

	    this.cellSize = anchoGrilla / 7;

	    this.offsetX = (this.view.canvas.width - anchoGrilla) / 2;
	    this.offsetY = (this.view.canvas.height - anchoGrilla) / 2;
	}
	//recorre la matriz y crea un objeto Peg por cada posición que contiene una ficha
    createPegs() {
        this.pegs = [];
        
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                if (this.board.grid[r][c] === 1) {
                    const x = this.offsetX + c * this.cellSize + this.cellSize / 2;
                    const y = this.offsetY + r * this.cellSize + this.cellSize / 2;
                    
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
	//configura los eventos del mouse sobre el canvas
    setupEvents() {
        const canvas = this.view.canvas;
        canvas.addEventListener('mousedown', e => this.handleMouseDown(e));
        canvas.addEventListener('mousemove', e => this.handleMouseMove(e));
        canvas.addEventListener('mouseup', e => this.handleMouseUp(e));
    }
    //transforma las coordenadas del mouse en coordenadas correspondientes al canvas
	getCanvasCoords(e) {
	    const rect = this.view.canvas.getBoundingClientRect();

	    return {
		x: (e.clientX - rect.left) * (this.view.canvas.width / rect.width),
		y: (e.clientY - rect.top) * (this.view.canvas.height / rect.height)
	    };
	}
	//se ejecuta cuando el jugador presiona el botón del mouse sobre el canvas
	handleMouseDown(e) {    
		    const coords = this.getCanvasCoords(e);

		    if (!this.gameStarted) {
		        if (!this.selectingPeg) {
		            const btnWidth = 240;
		            const btnHeight = 55;
		            const btnX = (this.view.canvas.width - btnWidth) / 2;
		            const btnY = 280;

		            if (coords.x >= btnX && coords.x <= btnX + btnWidth &&
		                coords.y >= btnY && coords.y <= btnY + btnHeight) {
		                this.selectingPeg = true;
		            }
		        } else {
		            const opt1X = this.view.canvas.width / 2 - 60;
		            const opt2X = this.view.canvas.width / 2 + 60;
		            const optY = 370;
		            const radius = 35;

		            if (Math.hypot(coords.x - opt1X, coords.y - optY) <= radius) { //calcula la distancia entre el clic del mouse y el centro de la imagen
		                this.selectedSpriteIndex = 0;
		                this.spriteImg = this.sprites[0];
		                this.initGame();
		                return;
		            }
		            if (Math.hypot(coords.x - opt2X, coords.y - optY) <= radius) {
		                this.selectedSpriteIndex = 1;
		                this.spriteImg = this.sprites[1];
		                this.initGame();
		                return;
		            }
		        }
		        return;
		    }

			//Boton para reiniciar la partida
			const botonX = this.view.canvas.width - 193;
			const botonY = 15;

			if (coords.x >= botonX && coords.x <= botonX + 185 &&
				coords.y >= botonY && coords.y <= botonY + 48) {

				this.restartGame();
				return;
			}

			if (this.gameOver) {
				const btnWidth = 220;
				const btnHeight = 48;
				const btnX = (this.view.canvas.width - btnWidth) / 2;		  
				const panelHeight = 200;
				const panelY = (this.view.canvas.height - panelHeight) / 2 - 20;
				const btnY = panelY + 105;

			    if (coords.x >= btnX && coords.x <= btnX + btnWidth &&
		        	coords.y >= btnY && coords.y <= btnY + btnHeight) {
		    		    this.restartGame();
			    }
			    return;
			}

			//Buscar la ficha seleccionada
			for (let i = this.pegs.length - 1; i >= 0; i--) {
				if (this.pegs[i].isPointInside(coords.x, coords.y)) {
				    this.selectedPeg = this.pegs[i];
				    this.selectedPeg.isDragging = true;
				  
				    const validMoves = this.board.getValidMoves(this.selectedPeg, this.offsetX, this.offsetY, this.cellSize);

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
	//se ejecuta cuando el mouse se mueve
    handleMouseMove(e) {
    	if (this.selectedPeg && this.selectedPeg.isDragging) {
    	    const coords = this.getCanvasCoords(e);

		    this.selectedPeg.x = coords.x;
		    this.selectedPeg.y = coords.y;
		}
	}
	//se ejecuta cuando soltamos el botón del mouse
	handleMouseUp(e) {
	    if (!this.selectedPeg) return;

			const peg = this.selectedPeg;
			const coords = this.getCanvasCoords(e);
			let targetMove = null;

			for (const move of this.currentValidMoves) {
				const dist = Math.hypot(coords.x - move.x, coords.y - move.y); //por cada movimiento calculamos la distancia entre el lugar donde soltamos el mouse y el destino

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
	//realiza el movimiento cuando el jugador soltó la ficha en una posición válida, actualiza el tablero y el arreglo de fichas
	executeMove(peg, move) {
        this.board.grid[peg.row][peg.col] = 0;
        this.board.grid[move.midRow][move.midCol] = 0;
        this.board.grid[move.toRow][move.toCol] = 1;

        //eliminamos del array de fichas la que fue comida
        this.pegs = this.pegs.filter(p => 
            !(p.row === move.midRow && p.col === move.midCol)
        );

        peg.row = move.toRow;
        peg.col = move.toCol;
        peg.x = move.x;
        peg.y = move.y;
        peg.originalX = move.x;
        peg.originalY = move.y;
    }
	//comprueba si la partida terminó
	checkGameStatus() {
	    if (this.gameOver || !this.gameStarted) return;

			const totalPegs = this.countTotalPegs();
			const ganoCompletamente = totalPegs === 1 && this.board.grid[3][3] === 1;

			let hasMoves = false;

			for (const peg of this.pegs) {
				if (this.board.getValidMoves(peg, this.offsetX, this.offsetY, this.cellSize).length > 0) {
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
	//se encarga de marcar el final de la partida
    endGame(message) {
		this.gameOver = true;
		this.endMessage = message;

	}
	//devuelve la cantidad de fichas que hay en el arreglo pegs
    countTotalPegs() {
        return this.pegs.length;
    }
	//cuenta cuántos movimientos posibles existen entre todas las fichas
    countAvailableMoves() {
		let totalMoves = 0;

		for (const peg of this.pegs) {
		    totalMoves += this.board.getValidMoves(peg,this.offsetX,this.offsetY,this.cellSize).length;
    	}

	    return totalMoves;
    }
	//
	loop(ahora) {
		if (this.gameStarted && !this.gameOver) {
		    if (!this.inicio) {
		        this.inicio = ahora;
		    }

		    const transcurrido = (ahora - this.inicio) / 1000;
		    const tiempoLimite = 300;
		    const restantes = Math.max(0, tiempoLimite - transcurrido);

		    this.timeLeft = Math.ceil(restantes);

		    if (this.timeLeft <= 0) {
		        this.endGame("¡SE ACABÓ EL TIEMPO!");
		    }
		    
		} else if (!this.gameStarted) {
		    this.inicio = null;
		}

		this.view.clear();

		//dibujar elementos del juego
		this.view.drawBoard(this.board.grid, this.offsetX, this.offsetY, this.cellSize);
		this.view.drawPegs(this.pegs, this.selectedPeg, this.spriteImg, this.selectedSpriteIndex); 
		this.view.drawHints(this.hints, ahora);
		
		this.view.drawUI(this.timeLeft, this.gameOver, this.countTotalPegs(), this.endMessage, this.countAvailableMoves());

		if (!this.gameStarted) {
			this.view.drawStartScreen(this.sprites, this.selectingPeg);
			requestAnimationFrame((t) => this.loop(t));
			return;
		}

		// Llamada recursiva
		requestAnimationFrame((t) => this.loop(t));
	}
}
