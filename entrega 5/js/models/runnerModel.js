const ANCHO_TILE = 900;
const GRAVEDAD = 850;
const IMPULSO_SALTO = -310;
const CONFIG_ITEMS = {
    moneda: { ancho: 50, alto: 50, minY: 80, maxY: 180, puntos: 50 },
    mosca:  { ancho: 80, alto: 80, minY: 100, maxY: 200, puntos: 0 }
};

class runnerModel {
    constructor(ancho, alto) {
        this.ancho = ancho;
        this.alto = alto;
        this.velocidad = 140;
        this.pisoY = this.alto - 55; 
        
        this.capas = [
            { x: 0, factor: 0.1 }, // Fondo
            { x: 0, factor: 0.2 }, // Nubes
            { x: 0, factor: 0.4 }, // Cerca
            { x: 0, factor: 0.6 }, // Arbustos
            { x: 0, factor: 1.0 }  // Piso 
        ];
        
        this.entrada = {
			impulso: false
		};
            
        this.reiniciar();
    }

    reiniciar() {
	    this.estado = 'menu';
		this.troncos = [];
		this.items = [];
		this.puntos = 0;
		this.vidas = 5;
        this.distanciaSpawnTronco = 0;
        this.distanciaSpawnItem = 400;
        this.tiempoTranscurrido = 0;
        this.puntajeFinal = 0;
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
    
    perderPartida() {
        const puntajePartida = this.puntos;
        this.reiniciar();
        this.estado = 'fin';
        this.puntajeFinal = puntajePartida;
    }
    
    saltar() {
		if (this.estado === 'fin') {
            this.reiniciar();
            this.estado = 'jugando';
        } else if (this.estado === 'menu') {
            this.estado = 'jugando';
        }

		this.pato.velocidadY = IMPULSO_SALTO;
	}

    obtenerHitboxPato() {
        return {
            x: this.pato.x + 75, 
            y: this.pato.y + 75, 
            w: this.pato.ancho - 150, 
            h: this.pato.alto - 150  
        };
    }

	recibirDanio(rebote = false) {
        if (this.pato.tiempoInvulnerable > 0) {
            if (rebote) this.pato.velocidadY = IMPULSO_SALTO;
            return;
        }

        this.vidas--;
        this.pato.tiempoChoqueVisual = 1.2;
        this.pato.tiempoInvulnerable = 3.0;
        if (rebote) this.pato.velocidadY = IMPULSO_SALTO;

        if (this.vidas <= 0) {
            this.perderPartida();
        }
    }
    
    aplicarEfectoItem(item) {
        const datos = CONFIG_ITEMS[item.tipo];
        if (!datos) return;

        if (datos.puntos > 0) {
            this.puntos += datos.puntos;
        } else if (item.tipo === 'mosca') {
            this.recibirDanio(false);
        }
    }
    
    actualizar(dt) {
        if (this.entrada.impulso) {
            this.saltar();
            this.entrada.impulso = false;
        }

        // parallax
        for (const capa of this.capas) {
            capa.x = (capa.x - this.velocidad * capa.factor * dt) % ANCHO_TILE;
        }

        if (this.estado !== 'jugando') return;

        // fisica del pato
        this.pato.velocidadY += GRAVEDAD * dt; //calcula cómo cambia la velocidad
        this.pato.y += this.pato.velocidadY * dt; //mueve al pato según esa velocidad

        // descontar y actualizar tiempos
        if (this.pato.tiempoChoqueVisual > 0) this.pato.tiempoChoqueVisual -= dt;
        if (this.pato.tiempoInvulnerable > 0) this.pato.tiempoInvulnerable -= dt;
        this.tiempoTranscurrido += dt;

        // movimiento de troncos
        for (const t of this.troncos) {
            t.x -= this.velocidad * dt; //mueve el tronco a la izq
            if (!t.puntosSumados && this.pato.x > t.x + t.ancho - 50) {
                this.puntos += 10;
                t.puntosSumados = true;
            }
        }
        while (this.troncos.length > 0 && this.troncos[0].x < -100) {
            this.troncos.shift();
        }

        // items
        const hitboxPato = this.obtenerHitboxPato();
        for (const item of this.items) {
            item.x -= this.velocidad * dt;
            const hitBoxItem = { x: item.x, y: item.y, w: item.ancho, h: item.alto };
            if (!item.tomado && this.choca(hitboxPato, hitBoxItem)) {
                item.tomado = true;
                this.aplicarEfectoItem(item);
                if (this.estado === 'fin') return;
            }
        }
        this.items = this.items.filter(item => !item.tomado && item.x > -100);

        // aparicion de troncos
        this.distanciaSpawnTronco -= this.velocidad * dt;
        if (this.distanciaSpawnTronco <= 0) {
            this.crearTronco();
            this.distanciaSpawnTronco = Math.random() * 100 + 250;
        }
        // aparicion de items
        this.distanciaSpawnItem -= this.velocidad * dt;
        if (this.distanciaSpawnItem <= 0) {
            this.crearItemAleatorio();
            this.distanciaSpawnItem = Math.random() * 200 + 300;
        }

        this.verificarColisionesTroncos(hitboxPato);
        if (this.estado === 'fin') return;

        // rotacion y techo
        if (this.pato.velocidadY < 0) {
            this.pato.rotacion = -25;
        } else {
            this.pato.rotacion = Math.min(35, (this.pato.velocidadY / 600) * 35);
        }

        if (this.pato.y < 0) {
            this.pato.y = 0;
            this.pato.velocidadY = 0;
        }

        // choque con el piso
        const hitboxActual = this.obtenerHitboxPato();
        if (hitboxActual.y + hitboxActual.h >= this.pisoY) {
            this.pato.y = this.pisoY - 175;
            this.recibirDanio(true);
        }
    }

    crearTronco() {
        const huecoInicial = 210;
        const huecoMinimo = 60; 
        const tiempoMaxDificultad = 60;

        const progreso = Math.min(1, this.tiempoTranscurrido / tiempoMaxDificultad);

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
		const tipo = Math.random() < 0.8 ? 'moneda' : 'mosca';
        const datos = CONFIG_ITEMS[tipo];

        const espaciosLibres = [];
        for (let i = 0; i < this.troncos.length - 1; i++) {
            const actual = this.troncos[i];
            const siguiente = this.troncos[i + 1];
            const inicio = actual.x + actual.ancho + 20;
            const espacio = (siguiente.x - 20) - inicio;

            if (inicio >= this.pato.x + this.pato.ancho && espacio >= datos.ancho) {
                espaciosLibres.push({ inicio, espacio });
            }
        }

        if (espaciosLibres.length === 0) return;

        const elegido = espaciosLibres[Math.floor(Math.random() * espaciosLibres.length)];
        const x = elegido.inicio + Math.random() * (elegido.espacio - datos.ancho);
        const rangoY = datos.maxY - datos.minY;
		const y = Math.floor(Math.random() * (rangoY + 1)) + datos.minY;

        this.items.push({
            tipo,
            x,
            y,
            ancho: datos.ancho,
            alto: datos.alto,
            tomado: false
        });
	}
    
    verificarColisionesTroncos(hitboxPato = this.obtenerHitboxPato()) {
    for (const t of this.troncos) {
        if (!t.colisionado) {
            const cajaSup = { x: t.x, y: t.superior.y, w: t.ancho, h: t.superior.alto };
            const cajaInf = { x: t.x, y: t.inferior.y, w: t.ancho, h: t.inferior.alto };

            if (this.choca(hitboxPato, cajaSup) || this.choca(hitboxPato, cajaInf)) {
                t.colisionado = true;
                this.recibirDanio(false);

                if (this.estado === 'fin') return;
            }
        }
    }
}

    choca(a, b) {
        return (a.x < b.x + b.w && 
        		a.x + a.w > b.x && 
        		a.y < b.y + b.h && 
        		a.y + a.h > b.y);
    }
}
