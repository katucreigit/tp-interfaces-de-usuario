/** Clase encargada exclusivamente del renderizado en el Canvas. */
class GameView {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#82ACD9";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawStartScreen() {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = "rgba(13, 27, 42, 0.88)";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.font = "100px 'Bangers'";
        ctx.textAlign = "center";

        ctx.lineWidth = 8;        
        ctx.strokeStyle = "#ECF3F9";
        ctx.strokeText("PEG SOLITARIE", this.canvas.width / 2, 150);
        ctx.strokeText("SPIDERMAN", this.canvas.width / 2, 250);

        ctx.fillStyle = "#B71C1C";  
        ctx.fillText("PEG SOLITARIE", this.canvas.width / 2, 150);
        ctx.fillText("SPIDERMAN", this.canvas.width / 2, 250);

        const btnWidth = 240;
        const btnHeight = 55;
        const btnX = (this.canvas.width - btnWidth) / 2;
        const btnY = 280;

        ctx.shadowColor = "rgba(217, 4, 41, 0.5)";
        ctx.shadowBlur = 20;

        ctx.fillStyle = "#B71C1C";
        ctx.beginPath();
        ctx.roundRect(btnX, btnY, btnWidth, btnHeight, 28);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText("COMENZAR", this.canvas.width / 2, btnY + 34);

        ctx.restore();
    }

    drawBoard(grid, offsetX, offsetY, cellSize) {
        const ctx = this.ctx;
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                // Dibujar solamente las casillas válidas
                if (grid[row][col] !== -1) {
                    const x = offsetX + col * cellSize;
                    const y = offsetY + row * cellSize;
                    const radio = cellSize * 0.3;

                    ctx.fillStyle = '#0e1e2a';
                    ctx.fillRect(x, y, cellSize, cellSize);

                    ctx.strokeStyle = '#64B5F6';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, cellSize, cellSize);

                    ctx.beginPath();
                    ctx.arc(x + cellSize / 2, y + cellSize / 2, radio, 0, Math.PI * 2);
                    ctx.fillStyle = '#B71C1C';
                    ctx.fill();

                    ctx.strokeStyle = '#7F1010';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
        }
    }

    /** Dibuja una ficha individual aplicando la sombra si se está arrastrando */
    dibujarFicha(peg, spriteImg) {
        const ctx = this.ctx;
        ctx.save();

        if (peg.isDragging) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 10;
        }

        // Crear el recorte circular
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Dibujar la imagen dentro del círculo o un color plano de respaldo
        if (spriteImg && spriteImg.complete && spriteImg.naturalWidth > 0) {
            ctx.drawImage(
                spriteImg, 
                peg.crop.sx, peg.crop.sy, peg.crop.sWidth, peg.crop.sHeight, 
                peg.x - peg.radius, peg.y - peg.radius, peg.radius * 2, peg.radius * 2
            );
        } else {
            ctx.fillStyle = '#E2231A';
            ctx.fillRect(peg.x - peg.radius, peg.y - peg.radius, peg.radius * 2, peg.radius * 2);
        }

        ctx.restore();

        // Dibujar el borde de la ficha
        ctx.save();
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#64B5F6';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
    }

    /** Itera sobre todas las fichas y se asegura de dibujar la seleccionada al final */
    drawPegs(pegs, selectedPeg, spriteImg) {
        pegs.forEach(peg => {
            if (peg !== selectedPeg) {
                this.dibujarFicha(peg, spriteImg);
            }
        });

        if (selectedPeg) {
            this.dibujarFicha(selectedPeg, spriteImg);
        }
    }

    /** Dibuja las pistas visuales (hints) con animación */
    drawHints(hints, time) {
        const ctx = this.ctx;

        for (const hint of hints) {
            ctx.save();

            const pulse = Math.sin(time * 0.006) * 4;
            const currentRadius = hint.radius + pulse;

            ctx.beginPath();
            ctx.arc(hint.x, hint.y, Math.max(2, currentRadius), 0, Math.PI * 2);

            ctx.strokeStyle = '#82ACD9';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.stroke();

            const offsetY = Math.sin(time * 0.01) * 6;

            ctx.fillStyle = '#82ACD9';
            ctx.beginPath();
            ctx.moveTo(hint.x, hint.y - 12 + offsetY);
            ctx.lineTo(hint.x - 7, hint.y - 22 + offsetY);
            ctx.lineTo(hint.x + 7, hint.y - 22 + offsetY);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }

    /** Dibuja los paneles de UI (tiempo, fichas, movimientos, botón reiniciar y pantalla de fin) */
    drawUI(timeLeft, gameOver, totalPegs, endMessage, availableMoves) {
        const ctx = this.ctx;
        ctx.save();

        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        const secsStr = secs < 10 ? "0" + secs : secs;

        ctx.textAlign = "center";

        const dibujarTarjeta = (x, y, ancho, alto) => {
            ctx.fillStyle = "rgba(14,30,42, 0.75)";
            ctx.beginPath();
            ctx.roundRect(x, y, ancho, alto, 25);
            ctx.fill();

            ctx.strokeStyle = "rgba(14,30,42, 0.75)";
            ctx.lineWidth = 1.2;
            ctx.stroke();
        };

        const centroX = 8 + 185 / 2;

        // Tarjeta del tiempo
        dibujarTarjeta(8, 15, 185, 48);
        ctx.fillStyle = "#B9CBE3";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText("TIEMPO", centroX, 33);
        ctx.fillStyle = "#F1F5F9";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(mins + ":" + secsStr, centroX, 54);

        // Tarjeta de fichas
        dibujarTarjeta(8, 72, 185, 48);
        ctx.fillStyle = "#B9CBE3";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText("FICHAS RESTANTES", centroX, 90);
        ctx.fillStyle = "#F1F5F9";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(totalPegs.toString(), centroX, 111);

        // Tarjeta de movimientos
        dibujarTarjeta(8, 129, 185, 52);
        ctx.fillStyle = "#B9CBE3";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText("MOVIMIENTOS", centroX, 149);
        ctx.fillStyle = "#F1F5F9";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(availableMoves.toString(), centroX, 173);

        ctx.restore();

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
        ctx.fillText("⟲ REINICIAR", botonX + 92.5, 44);

        // Pantalla final (Game Over / Victoria)
        if (gameOver) {
            ctx.save();

            ctx.fillStyle = "rgba(13, 27, 42, 0.92)";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.textAlign = "center";

            const panelWidth = 400;
            const panelHeight = 200;
            const panelX = (this.canvas.width - panelWidth) / 2;
            const panelY = (this.canvas.height - panelHeight) / 2 - 20;

            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowBlur = 20;
            ctx.fillStyle = "#1B263B";
            ctx.beginPath();
            ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 20);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.strokeStyle = "#D90429";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 38px 'Smooch Sans'";
            ctx.fillText(endMessage, this.canvas.width / 2, panelY + 70);

            const btnWidth = 220;
            const btnHeight = 48;
            const btnX = (this.canvas.width - btnWidth) / 2;
            const btnY = panelY + 105;

            ctx.shadowColor = "rgba(217, 4, 41, 0.4)";
            ctx.shadowBlur = 12;

            ctx.fillStyle = "#D90429";
            ctx.beginPath();
            ctx.roundRect(btnX, btnY, btnWidth, btnHeight, 24);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 17px sans-serif";
            ctx.fillText("REINICIAR PARTIDA", this.canvas.width / 2, btnY + 30);

            ctx.restore();
        }
    }

	dibujarFicha(peg, spriteImg) {
    const ctx = this.ctx;
    ctx.save();

    // Crear el recorte circular
    ctx.beginPath();
    ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Dibujar la imagen dentro del círculo
    if (spriteImg && spriteImg.complete && spriteImg.naturalWidth > 0) {
        ctx.drawImage(
            spriteImg, 
            peg.crop.sx, peg.crop.sy, peg.crop.sWidth, peg.crop.sHeight, 
            peg.x - peg.radius, peg.y - peg.radius, peg.radius * 2, peg.radius * 2
        );
    } else {
        ctx.fillStyle = '#E2231A';
        ctx.fillRect(peg.x - peg.radius, peg.y - peg.radius, peg.radius * 2, peg.radius * 2);
    }

    ctx.restore();

    // Dibujar el borde de la ficha
    ctx.save();
    ctx.beginPath();
    ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#64B5F6';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
}
drawPegs(pegs, selectedPeg, spriteImg) {
    pegs.forEach(peg => {
        if (peg !== selectedPeg) {
            this.dibujarFicha(peg, spriteImg);
        }
    });

    if (selectedPeg) {
        this.dibujarFicha(selectedPeg, spriteImg);
    }
}

    drawHints(hints, time) {
        const ctx = this.ctx;

        for (const hint of hints) {
            ctx.save();

            const pulse = Math.sin(time * 0.006) * 4;
            const currentRadius = hint.radius + pulse;

            ctx.beginPath();
            ctx.arc(hint.x, hint.y, Math.max(2, currentRadius), 0, Math.PI * 2);

            ctx.strokeStyle = '#82ACD9';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.stroke();

            const offsetY = Math.sin(time * 0.01) * 6;

            ctx.fillStyle = '#82ACD9';
            ctx.beginPath();
            ctx.moveTo(hint.x, hint.y - 12 + offsetY);
            ctx.lineTo(hint.x - 7, hint.y - 22 + offsetY);
            ctx.lineTo(hint.x + 7, hint.y - 22 + offsetY);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }

	drawUI(timeLeft, gameOver, totalPegs, endMessage, availableMoves) {
    	const ctx = this.ctx;
    	ctx.save();

	    const mins = Math.floor(timeLeft / 60);
	    const secs = timeLeft % 60;
	    const secsStr = secs < 10 ? "0" + secs : secs;

	    ctx.textAlign = "center";

	    const dibujarTarjeta = (x, y, ancho, alto) => {
    	    ctx.fillStyle = "rgba(14,30,42, 0.75)";
    	    ctx.beginPath();
    	    ctx.roundRect(x, y, ancho, alto, 25);
    	    ctx.fill();

    	    ctx.strokeStyle = "rgba(14,30,42, 0.75)";
		    ctx.lineWidth = 1.2;
		    ctx.stroke();
		};

	    const centroX = 8 + 185 / 2;

	    // Tarjeta del tiempo
		dibujarTarjeta(8, 15, 185, 48);

		ctx.fillStyle = "#B9CBE3";
		ctx.font = "bold 13px sans-serif";
		ctx.fillText("TIEMPO", centroX, 33);

		ctx.fillStyle = "#F1F5F9";
		ctx.font = "bold 20px sans-serif";
		ctx.fillText(mins + ":" + secsStr, centroX, 54);

	    // Tarjeta de fichas
	    dibujarTarjeta(8, 72, 185, 48);

	    ctx.fillStyle = "#B9CBE3";
    	ctx.font = "bold 13px sans-serif";
		ctx.fillText("FICHAS RESTANTES", centroX, 90);

		ctx.fillStyle = "#F1F5F9";
		ctx.font = "bold 20px sans-serif";
		ctx.fillText(totalPegs.toString(), centroX, 111);

	    // Tarjeta de movimientos
		dibujarTarjeta(8, 129, 185, 52);

		ctx.fillStyle = "#B9CBE3";
		ctx.font = "bold 13px sans-serif";
		ctx.fillText("MOVIMIENTOS", centroX, 149);

		ctx.fillStyle = "#F1F5F9";
		ctx.font = "bold 20px sans-serif";
		ctx.fillText(availableMoves.toString(), centroX, 173);

	    ctx.restore();

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
		ctx.fillText("⟲ REINICIAR", botonX + 92.5, 44);

		ctx.restore();

        // Pantalla final
        if (gameOver) {
            ctx.save();

            ctx.fillStyle = "rgba(13, 27, 42, 0.92)";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.textAlign = "center";

            const panelWidth = 400;
            const panelHeight = 200;
            const panelX = (this.canvas.width - panelWidth) / 2;
            const panelY = (this.canvas.height - panelHeight) / 2 - 20;

            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowBlur = 20;
            ctx.fillStyle = "#1B263B";
            ctx.beginPath();
            ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 20);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.strokeStyle = "#D90429";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 38px 'Smooch Sans'";
            ctx.fillText(endMessage, this.canvas.width / 2, panelY + 70);

            const btnWidth = 220;
            const btnHeight = 48;
            const btnX = (this.canvas.width - btnWidth) / 2;
            const btnY = panelY + 105;

            ctx.shadowColor = "rgba(217, 4, 41, 0.4)";
            ctx.shadowBlur = 12;

            ctx.fillStyle = "#D90429";
            ctx.beginPath();
            ctx.roundRect(btnX, btnY, btnWidth, btnHeight, 24);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 17px sans-serif";
            ctx.fillText("REINICIAR PARTIDA", this.canvas.width / 2, btnY + 30);

            ctx.restore();
        }
    }
}
