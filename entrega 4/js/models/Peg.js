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
        this.hasPeg = true;
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
        
        // 1. Creamos la máscara de recorte circular (Obligatorio para que la ficha sea redonda)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip(); // Todo lo que se dibuje a partir de aquí dentro quedará confinado al círculo

        if (this.image && this.image.complete && this.image.naturalWidth !== 0) {
            const imgW = this.image.naturalWidth;
            const imgH = this.image.naturalHeight;

            let sx = this.crop && this.crop.sx !== undefined ? this.crop.sx : 0;
            let sy = this.crop && this.crop.sy !== undefined ? this.crop.sy : 0;
            let sWidth = this.crop && this.crop.sWidth ? this.crop.sWidth : imgW;
            let sHeight = this.crop && this.crop.sHeight ? this.crop.sHeight : imgH;

            if (sx >= imgW || sy >= imgH || sWidth <= 0 || sHeight <= 0) {
                sx = 0;
                sy = 0;
                sWidth = imgW;
                sHeight = imgH;
            }

            // 2. Dibujamos la imagen recortada del sprite sheet dentro de la máscara circular
            ctx.drawImage(
                this.image, 
                sx, 
                sy, 
                sWidth, 
                sHeight, 
                this.x - this.radius, 
                this.y - this.radius, 
                this.radius * 2, 
                this.radius * 2    
            );
        } else {
            // Respaldo visual en rojo si la imagen no carga
            ctx.fillStyle = '#E2231A';
            ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        }

        ctx.restore(); // Restauramos el contexto para que el clip no afecte al resto del tablero

        // 3. Dibujamos un borde sutil alrededor de la ficha redonda para que destaque estéticamente
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
}
