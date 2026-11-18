class runnerView {
    constructor() {
        this.elementosCapas = document.querySelectorAll('.capa');
        this.pato = document.getElementById('pato');
        this.contenedorEntidades = document.getElementById('entidades');
        this.puntajeAnterior = 0;
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
        // 3. Estados visuales del pato
        if (modelo.gameOver || modelo.pato.tiempoChoqueVisual > 0) {
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
        
        // 2. Dibujar Monedas usando keyframes de forma estable
        modelo.items.forEach(item => {
            const div = document.createElement('div');
            div.className = item.tipo; // Se llamará 'moneda' o 'mosca' y tomará su CSS automáticamente
            div.style.width = `${item.ancho}px`;
            div.style.height = `${item.alto}px`;
            div.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
            if (item.tipo === 'moneda') div.style.animationDelay = `-${item.x * 0.005}s`;
            if (item.tipo === 'mosca') div.style.animationDelay = `-${item.x * 0.01}s`;
            this.contenedorEntidades.appendChild(div);
        });
	if (modelo.puntos > this.puntajeAnterior) {
            const diferencia = modelo.puntos - this.puntajeAnterior;
            // Mostramos el texto a la altura del pato
            this.mostrarFlotante(`+${diferencia}`, modelo.pato.x + 50, modelo.pato.y);
            this.puntajeAnterior = modelo.puntos;
        }
        
        if (modelo.puntos === 0) {
            this.puntajeAnterior = 0;
        }

        // Actualizar HUD de puntos
        const spanPuntos = document.getElementById('puntos');
        if (spanPuntos) {
            spanPuntos.textContent = modelo.puntos;
        }

        const spanVidas = document.getElementById('vidas');
        if (spanVidas) {
            spanVidas.textContent = modelo.vidas;
        }
    }
 mostrarFlotante(texto, x, y) {
        const juegoEl = document.getElementById('juego');
        if (!juegoEl) return;

        const el = document.createElement('div');
        el.className = 'texto-flotante';
        el.textContent = texto;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;

        juegoEl.appendChild(el);

        // Se borra solo cuando termina la animación
        setTimeout(() => el.remove(), 800);
    }   
}
