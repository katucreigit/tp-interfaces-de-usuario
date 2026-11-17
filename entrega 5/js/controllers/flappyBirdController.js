class GameController {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.ultimoTiempo = 0;
        this.maxDt = 0.05; // Capping de seguridad para evitar saltos al cambiar de pestaña
        this.configurarChoque();
        this.configurarControles();
    }
    
    configurarControles() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                this.modelo.saltar();
            }
        });

        const juegoEl = document.getElementById('juego');
        if (juegoEl) {
            juegoEl.addEventListener('mousedown', () => {
                this.modelo.saltar();
            });
        }
    }

    configurarChoque() {
        this.vista.pato.addEventListener('animationend', (e) => {
            if (e.animationName === 'choque' && this.modelo.gameOver) {
                this.modelo.reiniciar();
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
