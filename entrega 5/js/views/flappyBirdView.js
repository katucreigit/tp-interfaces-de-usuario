class GameView {
    constructor() {
        this.elementosCapas = document.querySelectorAll('.capa');
        this.pato = document.getElementById('pato');
    }

    render(modelo) {
        // Mover las capas del fondo
        modelo.capas.forEach((capa, index) => {
            const el = this.elementosCapas[index];
    
            if (el) {
                el.style.backgroundPositionX = `${capa.x}px`;
            }
        });
    
        // Posición y rotación del pato
        this.pato.style.transform =
            `translate3d(0px, ${modelo.pato.y}px, 0) rotate(${modelo.pato.rotacion}deg)`;
    
        // Estados del pato
        if (modelo.gameOver) {
            this.pato.classList.remove('impulso');
        
            if (!this.pato.classList.contains('choque')) {
                this.pato.classList.add('choque');
            }
        
        } else if (modelo.enJuego && modelo.pato.velocidadY < 0) {
            this.pato.classList.remove('choque');
            this.pato.classList.add('impulso');
        
        } else {
            this.pato.classList.remove('impulso', 'choque');
        }
    }
}
