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
    
    registrarImpulso() {
        this.modelo.entrada.impulso = true;
    }

    configurarControles() {
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && !e.repeat) {
                e.preventDefault();
                this.registrarImpulso();
            }
        });

        const juego = document.getElementById('juego');
        if (juego) {
            juego.addEventListener('mousedown', () => this.registrarImpulso());
        }
    }

    configurarChoque() {
        this.vista.pato.addEventListener('animationend', (e) => {
            if (e.animationName === 'choque') {
                this.modelo.pato.tiempoChoqueVisual = 0;
                this.vista.ponerEstado('volando');
            }
        });
    }

    actualizarRecord() {
        const puntajeReferencia = Math.max(this.modelo.puntos, this.modelo.puntajeFinal);
        if (puntajeReferencia > this.record) {
            this.record = puntajeReferencia;
            localStorage.setItem('recordDuckRunner', this.record);
        }
    }

    iniciar() {
        requestAnimationFrame((tiempoActual) => this.bucle(tiempoActual));
    }

    bucle(tiempoActual) {
        if (!this.ultimoTiempo) this.ultimoTiempo = tiempoActual;
        const dt = Math.min((tiempoActual - this.ultimoTiempo) / 1000, this.maxDt);
        this.ultimoTiempo = tiempoActual;

        this.modelo.actualizar(dt);
        this.actualizarRecord();
        this.vista.render(this.modelo, this.record);

        requestAnimationFrame((t) => this.bucle(t));
    }
}
