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

    
}
