
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

    this.ctx.fillStyle = "#82ACD9";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}
drawStartScreen() {
    const ctx = this.ctx; // Usamos el ctx de la vista
    ctx.save();
    ctx.fillStyle = "rgba(13, 27, 42, 0.88)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.font = "100px 'Bangers'";
ctx.textAlign = "center";

ctx.lineWidth = 8;             // Grosor del borde (puedes ajustarlo)
ctx.strokeStyle = "#ECF3F9";   // Color del borde (Negro cómic)
ctx.strokeText("PEG SOLITARIE", this.canvas.width / 2, 150);
ctx.strokeText("SPIDERMAN", this.canvas.width / 2, 250);

// 2. DIBUJAR EL RELLENO (Fill) ENCIMA DEL CONTORNO
ctx.fillStyle = "#B71C1C";     // Color principal (Rojo Spider-Man)
ctx.fillText("PEG SOLITARIE", this.canvas.width / 2, 150);
ctx.fillText("SPIDERMAN", this.canvas.width / 2, 250);

    const btnWidth = 240;
        const btnHeight = 55;
        const btnX = (this.canvas.width - btnWidth) / 2;
        const btnY = 280;

        // Sombra brillante estilo neón/energía para el botón
        ctx.shadowColor = "rgba(217, 4, 41, 0.5)";
        ctx.shadowBlur = 20;

        // Fondo del botón (Rojo Spider-Man)
        ctx.fillStyle = "#B71C1C";
        ctx.beginPath();
        ctx.roundRect(btnX, btnY, btnWidth, btnHeight, 28);
        ctx.fill();

        // Borde del botón
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Texto del botón
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText("COMENZAR", this.canvas.width / 2, btnY + 34);

        ctx.restore();
}

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

            ctx.strokeStyle = '#82ACD9';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.stroke();

            // Flecha animada
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

    drawPegs(pegs, selectedPeg) {
        pegs.forEach(peg => {
            if (peg !== selectedPeg) {
                peg.draw(this.ctx);
            }
        });

        if (selectedPeg) {
            selectedPeg.draw(this.ctx);
        }
    }


drawUI(timeLeft, gameOver, totalPegs, endMessage, availableMoves) {
    const ctx = this.ctx;

    ctx.save();

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const secsStr = secs < 10 ? "0" + secs : secs;

    // Cambiamos a "center" para que fillText se alinee al medio de la coordenada X
    ctx.textAlign = "center";

    // Estilo de las tarjetas
    const dibujarTarjeta = (x, y, ancho, alto) => {
        ctx.fillStyle = "rgba(14,30,42, 0.75)";
        ctx.beginPath();
        ctx.roundRect(x, y, ancho, alto, 25);
        ctx.fill();

        ctx.strokeStyle = "rgba(14,30,42, 0.75)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
    };

    // Coordenada X central de las tarjetas (x=8 + ancho=185 / 2 = 100.5)
    const centroX = 8 + 185 / 2;

    // Tarjeta del tiempo (Altura: 48)
    dibujarTarjeta(8, 15, 185, 48);

    ctx.fillStyle = "#B9CBE3";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("TIEMPO", centroX, 33); // Título arriba

    ctx.fillStyle = "#F1F5F9";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(mins + ":" + secsStr, centroX, 54); // Valor abajo (puedes ajustar si prefieres)

    // Tarjeta de fichas (Altura: 48)
    dibujarTarjeta(8, 72, 185, 48);

    ctx.fillStyle = "#B9CBE3";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("FICHAS RESTANTES", centroX, 90);

    ctx.fillStyle = "#F1F5F9";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(totalPegs.toString(), centroX, 111);

    // Tarjeta de movimientos (Altura: 55)
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
        // Pantalla final (Game Over)
        if (gameOver) {
            ctx.save();

            // Fondo oscuro con tinte rojo/azulado dramático
            ctx.fillStyle = "rgba(13, 27, 42, 0.92)";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.textAlign = "center";

            // --- PANEL CENTRAL ---
            const panelWidth = 400;
            const panelHeight = 200;
            const panelX = (this.canvas.width - panelWidth) / 2;
            const panelY = (this.canvas.height - panelHeight) / 2 - 20;

            // Sombra y fondo del panel
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowBlur = 20;
            ctx.fillStyle = "#1B263B"; // Azul noche corporativo/héroe
            ctx.beginPath();
            ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 20);
            ctx.fill();

            // Borde del panel en rojo Spider-Man
            ctx.shadowBlur = 0;
            ctx.strokeStyle = "#D90429";
            ctx.lineWidth = 2;
            ctx.stroke();

            // --- MENSAJE DE FIN DE JUEGO ---
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 38px 'Smooch Sans'";
            ctx.fillText(
                endMessage,
                this.canvas.width / 2,
                panelY + 70
            );

            // --- BOTÓN DE REINICIAR (Dentro del panel) ---
            const btnWidth = 220;
            const btnHeight = 48;
            const btnX = (this.canvas.width - btnWidth) / 2;
            const btnY = panelY + 105;

            // Sombra del botón principal
            ctx.shadowColor = "rgba(217, 4, 41, 0.4)";
            ctx.shadowBlur = 12;

            // Fondo del botón (Rojo Spider-Man)
            ctx.fillStyle = "#D90429";
            ctx.beginPath();
            ctx.roundRect(btnX, btnY, btnWidth, btnHeight, 24);
            ctx.fill();

            // Texto del botón
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 17px sans-serif";
            ctx.fillText(
                "REINICIAR PARTIDA",
                this.canvas.width / 2,
                btnY + 30
            );

            ctx.restore();
        }
    }
}

