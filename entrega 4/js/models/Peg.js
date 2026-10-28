class Peg {
    constructor(row, col, x, y, radius, image, crop) {
        this.row = row;
        this.col = col;
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.radius = radius;
        this.image = image;
        this.crop = crop;
        this.isDragging = false;
    }

    isPointInside(px, py) {
        const distX = px - this.x;
        const distY = py - this.y;

        return (distX * distX + distY * distY) <= (this.radius * this.radius);
    }

    resetPosition() {
        this.x = this.originalX;
        this.y = this.originalY;
    }

    draw(ctx) {
        ctx.save();

        // Crear el recorte circular
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Dibujar la imagen dentro del círculo
        if (this.image && this.image.complete &&
            this.image.naturalWidth > 0) {

            ctx.drawImage(this.image, this.crop.sx, this.crop.sy, this.crop.sWidth, this.crop.sHeight, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);

        } else {
            ctx.fillStyle = '#E2231A';
            ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        }

        ctx.restore();

        // Dibujar el borde blanco de la ficha
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
}

