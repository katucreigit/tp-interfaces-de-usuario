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

        this.gravedad = 850;
        this.impulsoSalto = -310;
        this.pisoY = this.alto - 15; 

        this.troncos = [];
        this.items = [];
        
        this.distanciaSpawnTronco = 50;
        this.distanciaSpawnItem = 400;
        this.vidas = 5;
        this.tiempoTranscurrido = 0;
        
        this.entrada = {
			impulso: false
		};
            
        this.reiniciar();
    }

    reiniciar() {
	    this.estado = 'menu';
		this.enJuego = false;
		this.gameOver = false;
		this.troncos = [];
		this.items = [];
		this.puntos = 0;
		this.vidas = 5;
        this.distanciaSpawnTronco = 50;
        this.distanciaSpawnItem = 400;
        this.tiempoTranscurrido = 0;
        this.pato = {
            x: 100,
            y: 200,
            ancho: 200,
            alto: 200,
            velocidadY: 0,
            rotacion: 0,
            tiempoChoqueVisual: 0,
            tiempoInvulnerable: 0
        };
    }
    
    saltar() {
		if (this.estado === 'fin') {
		    this.reiniciar();
		    return;
		}

		if (this.estado === 'menu') {
		    this.estado = 'jugando';
		    this.enJuego = true;
		}

		this.pato.velocidadY = this.impulsoSalto;
	}

    obtenerHitboxPato() {
        return {
            x: this.pato.x + 75, 
            y: this.pato.y + 75, 
            w: this.pato.ancho - 150, 
            h: this.pato.alto - 150  
        };
    }

    actualizar(dt) {
        
		if (this.gameOver) return;

		if (this.entrada.impulso) {
				this.saltar();
				this.entrada.impulso = false;
			}

        const ANCHO_TILE = 900;
        
        // --- 1. MOVIMIENTO DE CAPAS Y PISO (PARALLAX) ---
        for (const capa of this.capas) {
            capa.x = (capa.x - this.velocidad * capa.factor * dt) % ANCHO_TILE;
        }
    
        if (!this.enJuego) return;
    
        // --- 2. FÍSICAS DEL PATO ---
        this.pato.velocidadY += this.gravedad * dt;
        this.pato.y += this.pato.velocidadY * dt;

        // --- 3. TIEMPOS ---
        if (this.pato.tiempoChoqueVisual > 0) this.pato.tiempoChoqueVisual -= dt;
        if (this.pato.tiempoInvulnerable > 0) this.pato.tiempoInvulnerable -= dt;
        
        this.tiempoTranscurrido += dt;

        // --- 4. MOVIMIENTO DE TRONCOS ---
        for (let t of this.troncos) {
            t.x -= this.velocidad * dt;
            if (!t.puntosSumados && t.x + t.ancho < this.pato.x + 200) {
				this.puntos += 10;
				t.puntosSumados = true;
			}
        }

        // --- 5. MANEJADOR UNIFICADO DE ITEMS (Monedas y Moscas) ---
        const EFECTOS = {
            moneda: (modelo) => {
                modelo.puntos += 50;
            },
            mosca: (modelo) => {
                if (modelo.pato.tiempoInvulnerable <= 0) {
                    modelo.vidas--;
                    modelo.pato.tiempoChoqueVisual = 1.2;
                    modelo.pato.tiempoInvulnerable = 3.0;
                    if (modelo.vidas <= 0) modelo.gameOver = true;
                }
            }
        };

        for (let item of this.items) {
            item.x -= this.velocidad * dt;

            if (!item.tomado && this.choca(this.obtenerHitboxPato(), { x: item.x, y: item.y, w: item.ancho, h: item.alto })) {
                item.tomado = true;
                if (EFECTOS[item.tipo]) {
                    EFECTOS[item.tipo](this);
                }
            }
        }

        this.items = this.items.filter(item => !item.tomado && item.x > -100);

        // --- 6. SPAWNS ---
        this.distanciaSpawnTronco -= this.velocidad * dt;
        if (this.distanciaSpawnTronco <= 0) {
            this.crearTronco();
            this.distanciaSpawnTronco = Math.random() * (350 - 250) + 250; 
        }
        
        this.distanciaSpawnItem -= this.velocidad * dt;
        if (this.distanciaSpawnItem <= 0) {
            this.crearItemAleatorio();
            this.distanciaSpawnItem = Math.random() * (500 - 300) + 300; 
        }

        while (this.troncos.length > 0 && this.troncos[0].x < -100) {
            this.troncos.shift();
        }

        this.verificarColisionesTroncos();

        // --- 7. ROTACIÓN Y TECHO ---
        if (this.pato.velocidadY < 0) {
            this.pato.rotacion = -25;
        } else {
            this.pato.rotacion = Math.min(35, (this.pato.velocidadY / 600) * 35);
        }
    
        if (this.pato.y < 0) {
            this.pato.y = 0;
            this.pato.velocidadY = 0;
        }
    
		// --- COLISIÓN CON EL PISO ---
		const limitePisoVisual = this.pisoY - 40; 
		const hitbox = this.obtenerHitboxPato();
		
		if (hitbox.y + hitbox.h >= limitePisoVisual) {
		    this.pato.y = limitePisoVisual - 175; 

		    if (this.pato.tiempoInvulnerable <= 0) {
		        this.vidas--;
		        this.pato.tiempoChoqueVisual = 1.2;
		        this.pato.velocidadY = this.impulsoSalto;
		        this.pato.tiempoInvulnerable = 3.0;

		        if (this.vidas <= 0) {
		            this.gameOver = true; 
		        }
		    } else {
		        this.pato.velocidadY = this.impulsoSalto;
		    }
		}
		
		if (this.gameOver) {
			this.estado = 'fin';
		}
    }

    crearTronco() {
        const huecoInicial = 210;
        const huecoMinimo = 60; 
        const tiempoMaxDificultad = 60; // Segundos que tarda en llegar al hueco mínimo

        // Progreso de 0 a 1 según el tiempo transcurrido
        const progreso = Math.min(1, this.tiempoTranscurrido / tiempoMaxDificultad);

        // Baja gradualmente de 180 hacia 100
        const hueco = huecoInicial - (huecoInicial - huecoMinimo) * progreso;
        const alturaMinima = 40;
        const alturaMaxima = this.pisoY - hueco - 60;
        
        const altoSuperior = Math.floor(Math.random() * (alturaMaxima - alturaMinima)) + alturaMinima;
        const yInferior = altoSuperior + hueco;
        const altoInferior = this.pisoY - yInferior;
    
        this.troncos.push({
            x: this.ancho,
            ancho: 80,
            superior: { y: 0, alto: altoSuperior },
            inferior: { y: yInferior, alto: altoInferior },
            puntosSumados: false,
            colisionado: false
        });

    }

    crearItemAleatorio() {
		const esMoneda = Math.random() < 0.8;

		const tipo = esMoneda ? 'moneda' : 'mosca';
		const anchoItem = esMoneda ? 50 : 80;
		const altoItem = esMoneda ? 50 : 80;

		const espaciosLibres = [];

		for (let i = 0; i < this.troncos.length - 1; i++) {
		    const troncoActual = this.troncos[i];
		    const troncoSiguiente = this.troncos[i + 1];

		    const inicio = troncoActual.x + troncoActual.ancho + 10;
		    const fin = troncoSiguiente.x - 10;

		    const espacioDisponible = fin - inicio;

		    if (inicio >= this.pato.x + this.pato.ancho && espacioDisponible >= anchoItem) {
		        espaciosLibres.push({
		            inicio: inicio,
		            espacio: espacioDisponible
		        });
		    }
		}

		if (espaciosLibres.length === 0) return;

		const espacioElegido = espaciosLibres[Math.floor(Math.random() * espaciosLibres.length)];

		const x = espacioElegido.inicio + Math.random() * (espacioElegido.espacio - anchoItem);

		let y;

		if (tipo === 'moneda') {
		    y = Math.floor(Math.random() * (this.pisoY - 180 - 80)) + 80;
		} else {
		    y = Math.floor(Math.random() * (this.pisoY - 200 - 100)) + 100;
		}

		this.items.push({
		    tipo: tipo,
		    x: x,
		    y: y,
		    ancho: anchoItem,
		    alto: altoItem,
		    tomado: false
		});
	}
    
    verificarColisionesTroncos() {
        const hitboxPato = this.obtenerHitboxPato();
        for (let t of this.troncos) {
            if (!t.colisionado) {
                const cajaSup = { x: t.x, y: t.superior.y, w: t.ancho, h: t.superior.alto };
                const cajaInf = { x: t.x, y: t.inferior.y, w: t.ancho, h: t.inferior.alto };
        
                if (this.choca(hitboxPato, cajaSup) || this.choca(hitboxPato, cajaInf)) {
                    if (this.pato.tiempoInvulnerable <= 0) {
                        this.vidas--; 
                        t.colisionado = true; 
                        this.pato.tiempoChoqueVisual = 1.2;
                        this.pato.tiempoInvulnerable = 3.0;
                        if (this.vidas <= 0) this.gameOver = true; 
                    }
                }
            }
        }
    }

    choca(a, b) {
        return (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y);
    }
}
