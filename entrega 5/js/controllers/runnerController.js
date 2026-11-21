class runnerController {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.ultimoTiempo = 0;
        this.maxDt = 0.05; 
        
        this.record = Number(localStorage.getItem('recordDuckRunner')) || 0;
        
        this.configurarChoque();
        this.configurarControles();
    }
    
    configurarControles() {
		document.addEventListener('keydown', e => {
		    if ((e.code === 'Space' || e.code === 'ArrowUp') && !e.repeat) {
		        e.preventDefault();
		        this.modelo.entrada.impulso = true;
		    }
		});

		document.getElementById('juego').addEventListener('mousedown', () => {
		    this.modelo.entrada.impulso = true;
		});
	}

	configurarChoque() {
		this.vista.pato.addEventListener('animationend', (e) => {
		    if (e.animationName === 'choque') {
		        this.modelo.pato.tiempoChoqueVisual = 0;
		        this.vista.ponerEstado('volando');
		    }
		});
}

    iniciar() {
        requestAnimationFrame((tiempoActual) => this.bucle(tiempoActual));
    }

    bucle(tiempoActual) {
        if (!this.ultimoTiempo) this.ultimoTiempo = tiempoActual;
        let dt = (tiempoActual - this.ultimoTiempo) / 1000;
        this.ultimoTiempo = tiempoActual;

        // Limitar dt máximo
        if (dt > this.maxDt) dt = this.maxDt;

        this.modelo.actualizar(dt);

		// Comprobar si se consiguió un nuevo récord
		if (this.modelo.puntos > this.record) {
			this.record = this.modelo.puntos;
			localStorage.setItem('recordDuckRunner', this.record);
		}

		// Actualizar la vista
		this.vista.render(this.modelo, this.record);

        // Siguiente frame
        requestAnimationFrame((t) => this.bucle(t));
    }
}
