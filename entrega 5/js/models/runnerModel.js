class runnerModel {
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
        this.monedas = [];
	this.moscas = [];
        
        this.distanciaSpawnTronco = 300;
        this.distanciaSpawnMoneda = 500;
        this.tiempoSpawnMosca = 1.5;
        this.vidas = 5;
        
        this.tiempoTranscurrido = 0;
            
        this.reiniciar();
    }

    reiniciar() {
        this.enJuego = false; // No cae hasta el primer salto
        this.gameOver = false;
        this.troncos = [];
        this.monedas = [];
        this.moscas= [];
        this.moscas = []; 
        this.puntos = 0;
        this.vidas = 5;
        this.distanciaSpawnTronco = 300;
        this.distanciaSpawnMoneda = 500;
        this.tiempoSpawnMosca = 1.5;
        this.tiempoTranscurrido = 0;
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
        
        this.tiempoTranscurrido += dt;

        // Mover troncos a la misma velocidad del juego/piso
        for (let t of this.troncos) {
            t.x -= this.velocidad * dt;

            if (!t.puntosSumados && t.x + (t.ancho / 2) < this.pato.x) {
		    this.puntos += 10;
		    t.puntosSumados = true;
		}
        }
        
       for (let i = this.monedas.length - 1; i >= 0; i--) {
            let m = this.monedas[i];
            m.x -= this.velocidad * dt;

            if (!m.recolectada && this.verificarColisionMoneda(m)) {
                m.recolectada = true;
                this.puntos += 50; // Puntos extra por moneda
                this.monedas.splice(i, 1);
                continue;
            }

            if (m.x < -50) {
                this.monedas.splice(i, 1);
            }
        }
        
       for (let m of this.moscas) {
            m.x -= this.velocidad * dt;
        }

        // Limpiar moscas fuera de pantalla o colisionadas
        this.moscas = this.moscas.filter(m => !m.colisionada && m.x > -100);

        // --- SPAWNS INDEPENDIENTES (Cada tanto y separados) ---
        
        // A. Troncos por distancia
        this.distanciaSpawnTronco -= this.velocidad * dt;
        if (this.distanciaSpawnTronco <= 0) {
            this.crearTronco();
            this.distanciaSpawnTronco = Math.random() * (350 - 250) + 250; 
        }
        
        // B. Monedas por distancia
        this.distanciaSpawnMoneda -= this.velocidad * dt;
        if (this.distanciaSpawnMoneda <= 0) {
            this.crearMoneda();
            this.distanciaSpawnMoneda = Math.random() * (600 - 400) + 400; 
        }

        // C. Moscas por tiempo (cada 4 o 5 segundos)
        if (this.tiempoTranscurrido >= 10) {
            this.tiempoSpawnMosca += dt;
            if (this.tiempoSpawnMosca >= 4.5) { // Cada cuánto sale una vez habilitadas
                this.crearMosca();
                this.tiempoSpawnMosca = 0;
            }
        }

        // Borrar troncos que salen
        while (this.troncos.length > 0 && this.troncos[0].x < -100) {
            this.troncos.shift();
        }

        // Colisiones
        this.verificarColisionesTroncos();
        this.verificarColisionesMoscas();

        // Rotación visual
        if (this.pato.velocidadY < 0) {
            this.pato.rotacion = -25;
        } else {
            this.pato.rotacion = Math.min(35, (this.pato.velocidadY / 600) * 35);
        }
    
        // Techo
        if (this.pato.y < 0) {
            this.pato.y = 0;
            this.pato.velocidadY = 0;
        }
    
        // Piso
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
    
    crearMoneda() {
        const monedaX = this.ancho;
        const monedaY = Math.floor(Math.random() * (this.pisoY - 180 - 80)) + 80;

        this.monedas.push({
            x: monedaX,
            y: monedaY,
            ancho: 50,
            alto: 50,
            recolectada: false
        });
    }
    crearMosca() {
        const moscaX = this.ancho;
        const alturaMinima = 100;
        const alturaMaxima = this.pisoY - 200;
        const posY = Math.floor(Math.random() * (alturaMaxima - alturaMinima)) + alturaMinima;

        this.moscas.push({
            x: moscaX,
            y: posY,
            ancho: 80,
            alto: 80,
            colisionada: false
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
    verificarColisionMoneda(m) {
        const hitboxPato = {
            x: this.pato.x + 75, 
            y: this.pato.y + 75, 
            w: this.pato.ancho - 150, 
            h: this.pato.alto - 150   
        };

        const cajaMoneda = { x: m.x, y: m.y, w: m.ancho, h: m.alto };
        return this.choca(hitboxPato, cajaMoneda);
    }
    verificarColisionesMoscas() {
        const hitboxPato = {
            x: this.pato.x + 75, 
            y: this.pato.y + 75, 
            w: this.pato.ancho - 150, 
            h: this.pato.alto - 150   
        };

        for (let m of this.moscas) {
            if (!m.colisionada) {
                const cajaMosca = { x: m.x, y: m.y, w: m.ancho, h: m.alto };

                if (this.choca(hitboxPato, cajaMosca)) {
                    this.vidas--; // Resta vida
                    m.colisionada = true; // Marcamos que ya impactó
                    
                    this.pato.fueGolpeado = true;
                    
                    if (this.vidas <= 0) {
                        this.gameOver = true; // Si se acaban las vidas, termina el juego
                    }
                }
            }
        }
    }
    choca(a, b) {
        return (a.x < b.x + b.w && a.x + a.w > b.x &&
                a.y < b.y + b.h && a.y + a.h > b.y);
    }

}
