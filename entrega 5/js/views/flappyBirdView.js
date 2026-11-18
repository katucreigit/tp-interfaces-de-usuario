class GameView {
    constructor() {
        this.elementosCapas = document.querySelectorAll('.capa');
        this.pato = document.getElementById('pato');
        this.contenedorEntidades = document.getElementById('entidades');

        // --- MODO DEBUG: Crear cajas visuales para probar hitboxes ---
        this.debugPato = document.createElement('div');
        this.debugPato.style.position = 'absolute';
        this.debugPato.style.border = '2px solid red'; // Cuadrado rojo para el pato
        this.debugPato.style.pointerEvents = 'none';
        this.debugPato.style.zIndex = '99';
        document.getElementById('juego').appendChild(this.debugPato);
    }

    render(modelo) {
        // Mover las capas del fondo
        modelo.capas.forEach((capa, index) => {
            const el = this.elementosCapas[index];
    
            if (el) {
                el.style.backgroundPositionX = `${capa.x}px`;
            }
        });
    
        // Posición y rotación del pato// Posición y rotación del pato (versión simplificada con top)
        this.pato.style.top = `${modelo.pato.y}px`;
        this.pato.style.transform = `rotate(${modelo.pato.rotacion}deg)`;
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

        // --- RENDERIZAR LOS TRONCOS DENTRO DE #entidades ---
        this.contenedorEntidades.innerHTML = ''; 

        modelo.troncos.forEach(t => {
            // Tronco Superior
            const divSup = document.createElement('div');
            divSup.className = 'tronco tronco-arriba';
            divSup.style.width = `${t.ancho}px`;
            divSup.style.height = `${t.superior.alto}px`;
            divSup.style.transform = `translate3d(${t.x}px, ${t.superior.y}px, 0)`;
            this.contenedorEntidades.appendChild(divSup);

            // Tronco Inferior
            const divInf = document.createElement('div');
            divInf.className = 'tronco tronco-abajo';
            divInf.style.width = `${t.ancho}px`;
            divInf.style.height = `${t.inferior.alto}px`;
            divInf.style.transform = `translate3d(${t.x}px, ${t.inferior.y}px, 0)`;
            this.contenedorEntidades.appendChild(divInf);
        });

        // Actualizar HUD de puntos
        const spanPuntos = document.getElementById('puntos');
        if (spanPuntos) {
            spanPuntos.textContent = modelo.puntos;
        }
    }
}
