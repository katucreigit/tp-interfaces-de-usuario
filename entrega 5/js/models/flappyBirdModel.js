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
        this.pisoY = this.alto - 15; // Ajusta según el alto visual de tu piso

        this.troncos = [];
        this.distanciaSpawn = 0;
            
        this.reiniciar();
    }

    reiniciar() {
        this.enJuego = false; // No cae hasta el primer salto
        this.gameOver = false;
        this.troncos = [];
        this.distanciaSpawn = 0;
        this.puntos = 0;
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
            this.enJuego = true;
        }
    
        this.pato.velocidadY = this.impulsoSalto;
    }

    actualizar(dt) {
        if (this.gameOver) return;
    
        // 1. Parallax: el fondo sigue moviéndose
        const ANCHO_TILE = 900;
    
        for (const capa of this.capas) {
            capa.x = (capa.x - this.velocidad * capa.factor * dt) % ANCHO_TILE;
        }
    
        // 2. Si todavía no empezó, no aplicar gravedad ni mover obstáculos
        if (!this.enJuego) {
            return;
        }
    
        // 3. Gravedad y desplazamiento vertical
        this.pato.velocidadY += this.gravedad * dt;
        this.pato.y += this.pato.velocidadY * dt;

        // Mover troncos a la misma velocidad del juego/piso
        for (let t of this.troncos) {
            t.x -= this.velocidad * dt;

            // Sumar puntos si el pato ya pasó el tronco
            if (!t.puntosSumados && t.x + t.ancho < this.pato.x) {
                this.puntos++;
                t.puntosSumados = true;
            }
        }

        // Generar nuevos troncos por distancia
        this.distanciaSpawn -= this.velocidad * dt;
        if (this.distanciaSpawn <= 0) {
            this.crearTronco();
            this.distanciaSpawn = Math.random() * (350 - 220) + 220; // Espaciado aleatorio
        }

        // Borrar troncos que salen de la pantalla
        while (this.troncos.length > 0 && this.troncos[0].x < -100) {
            this.troncos.shift();
        }

        // 4. Verificar colisiones con los troncos
        this.verificarColisionesTroncos();

        // 5. Rotación visual
        if (this.pato.velocidadY < 0) {
            this.pato.rotacion = -25;
        } else {
            this.pato.rotacion = Math.min(35, (this.pato.velocidadY / 600) * 35);
        }
    
        // 6. Límite con el techo
        if (this.pato.y < 0) {
            this.pato.y = 0;
            this.pato.velocidadY = 0;
        }
    
        // 7. Colisión con el piso
        if (this.pato.y + this.pato.alto >= this.pisoY) {
            this.pato.y = this.pisoY - this.pato.alto;
            this.gameOver = true;
        }
    } 

    crearTronco() {
        const hueco = 180;
        const alturaMinima = 40;
        const alturaMaxima = this.pisoY - hueco - 60;
        
        const altoSuperior = Math.floor(Math.random() * (alturaMaxima - alturaMinima)) + alturaMinima;
        const ySuperior = 0;
    
        const yInferior = altoSuperior + hueco;
        const altoInferior = this.pisoY - yInferior;
    
        this.troncos.push({
            x: this.ancho,
            ancho: 80,
            superior: { y: ySuperior, alto: altoSuperior },
            inferior: { y: yInferior, alto: altoInferior },
            puntosSumados: false // <--- NUEVO: Para saber si ya nos dio punto
        });
    }
    
    verificarColisionesTroncos() {
        const hitboxPato = {
            x: this.pato.x + 75, 
            y: this.pato.y + 75, 
            w: this.pato.ancho - 150, 
            h: this.pato.alto - 150   
        };
    
        for (let t of this.troncos) {
            const cajaSup = { x: t.x, y: t.superior.y, w: t.ancho, h: t.superior.alto };
            const cajaInf = { x: t.x, y: t.inferior.y, w: t.ancho, h: t.inferior.alto };
    
            if (this.choca(hitboxPato, cajaSup) || this.choca(hitboxPato, cajaInf)) {
                this.gameOver = true;
            }
        }
    }
    
    choca(a, b) {
        return (a.x < b.x + b.w && a.x + a.w > b.x &&
                a.y < b.y + b.h && a.y + a.h > b.y);
    }
}