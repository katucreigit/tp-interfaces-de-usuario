class runnerController {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.ultimoTiempo = 0;
        this.maxDt = 0.05; 
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

            if (this.modelo.gameOver) {
                this.modelo.reiniciar();
                this.vista.ponerEstado('volando');
            } else {
                this.modelo.pato.tiempoChoqueVisual = 0;
                this.vista.ponerEstado('volando');
            }

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

        // 1. Actualizar lógica en el modelo
        this.modelo.actualizar(dt);

        // 2. Refrescar la vista en el DOM
        this.vista.render(this.modelo);

        // Siguiente frame
        requestAnimationFrame((t) => this.bucle(t));
    }
}
