class GameView {
    constructor() {
        this.elementosCapas = document.querySelectorAll('.capa');
    }

    render(modelo) {
        // 1. Desplazar el fondo parallax mediante backgroundPositionX
        modelo.capas.forEach((capa, index) => {
            const el = this.elementosCapas[index];
            if (el) {
                el.style.backgroundPositionX = `${capa.x}px`;
            }
        });

        // 2. Actualizar posición del pájaro en pantalla
    }
}
