class flappyBirdModel {
    constructor(ancho, alto) {
        this.ancho = ancho;
        this.alto = alto;
        this.velocidad = 140;

        this.capas = [
            { x: 0, factor: 0.1 }, // Fondo
            { x: 0, factor: 0.2 }, // Nubes
            { x: 0, factor: 0.4 }, // Cerca
            { x: 0, factor: 0.6 }, // Arbustos
            { x: 0, factor: 1.0 }  // Piso
        ];

        // Físicas y límites
        this.gravedad = 850;
        this.impulsoSalto = -310;
        this.pisoY = this.alto - 15; // Ajusta 50 según el alto visual de tu piso
        
        this.reiniciar();
    }
    reiniciar() {
        this.enJuego = false; // No cae hasta el primer salto
        this.gameOver = false;
        this.pato = {
            x: 100,
            y: 200,
            ancho: 200,
            alto: 200,
            velocidadY: 0,
            rotacion: 0
        };
    }
    
    saltar() {
        if (this.gameOver) {
            this.reiniciar();
            return;
        }
        if (!this.enJuego) {
            this.enJuego = true; // Arranca la gravedad en el primer salto/clic
        }
        this.pato.velocidadY = this.impulsoSalto;
    }

    actualizar(dt) {        
    if (this.gameOver) return;

        // 1. Parallax
        const ANCHO_TILE = 900;
        for (const capa of this.capas) {
            capa.x = (capa.x - this.velocidad * capa.factor * dt) % ANCHO_TILE;
        }

        // 2. Gravedad y desplazamiento vertical
        this.pato.velocidadY += this.gravedad * dt;
        this.pato.y += this.pato.velocidadY * dt;

        // 3. Rotación visual según si sube o cae
        if (this.pato.velocidadY < 0) {
            this.pato.rotacion = -25;
        } else {
            this.pato.rotacion = Math.min(35, (this.pato.velocidadY / 600) * 35);
        }

        // 4. Límite con el techo
        if (this.pato.y < 0) {
            this.pato.y = 0;
            this.pato.velocidadY = 0;
        }

        // 5. Colisión con el piso
        if (this.pato.y + this.pato.alto >= this.pisoY) {
            this.pato.y = this.pisoY - this.pato.alto;
            this.gameOver = true;
        }
    }
}
