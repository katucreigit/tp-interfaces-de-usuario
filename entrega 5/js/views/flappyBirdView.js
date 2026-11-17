class GameView {
    constructor() {
        this.elementosCapas = document.querySelectorAll('.capa');
        this.pato = document.getElementById('pato');
    }

    render(modelo) {
        // 1. Desplazar el fondo parallax mediante backgroundPositionX
        modelo.capas.forEach((capa, index) => {
            const el = this.elementosCapas[index];
            if (el) {
                el.style.backgroundPositionX = `${capa.x}px`;
            }
        });

        this.pato.style.transform = `translate3d(0px, ${modelo.pato.y}px, 0) rotate(${modelo.pato.rotacion}deg)`;

        // 3. Pausar el aleteo del spritesheet si perdió
        if (modelo.gameOver) {
            this.pato.classList.add('choque');
            this.pato.classList.remove('impulso');
        } else if (modelo.pato.velocidadY < 0) {
            this.pato.classList.add('impulso');
            this.pato.classList.remove('choque');
        } else {
            // Cayendo o flotando normal
            this.pato.classList.remove('impulso', 'choque');
        }
    }
}
