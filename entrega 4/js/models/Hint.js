/**
 * Clase que representa las pistas visuales animadas (hints) para soltar fichas.
 */
class Hint {
    constructor(row, col, x, y, radius) {
        this.row = row;
        this.col = col;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw(ctx, time) {
        ctx.save();
        const pulse = Math.sin(time * 0.006) * 4;
        const currentRadius = this.radius + pulse;

        // Anillo exterior parpadeante
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(2, currentRadius), 0, Math.PI * 2);
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.stroke();

        // Indicador de flecha animada superior
        const offsetY = Math.sin(time * 0.01) * 6;
        ctx.fillStyle = '#00ffcc';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 12 + offsetY);
        ctx.lineTo(this.x - 7, this.y - 22 + offsetY);
        ctx.lineTo(this.x + 7, this.y - 22 + offsetY);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}
