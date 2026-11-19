class runnerView {
    constructor() {
        this.elementosCapas = document.querySelectorAll('.capa');
        this.pato = document.getElementById('pato');
        this.contenedorTroncos = document.getElementById('troncos');
        this.puntajeAnterior = 0;
        this.choqueActivo = false;
    }
    activarAnimacionChoque() {
        this.pato.classList.remove('impulso', 'choque');
        // Forzar reflow para que CSS vuelva a arrancar la animación desde el frame 0
        this.pato.offsetWidth;
        this.pato.classList.add('choque');
        this.choqueActivo = true;
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
        this.pato.style.top = `${modelo.pato.y}px`;
        this.pato.style.transform = `rotate(${modelo.pato.rotacion}deg)`;
        // 3. Estados visuales del pato
        if (modelo.gameOver) {
            if (!this.choqueActivo) {
                this.activarAnimacionChoque();
            }
        } else if (modelo.pato.tiempoChoqueVisual > 0) {
            if (!this.choqueActivo) {
                this.activarAnimacionChoque();
            }
        } else {
            this.choqueActivo = false;
            this.pato.classList.remove('choque');

            if (modelo.enJuego && modelo.pato.velocidadY < 0) {
                this.pato.classList.add('impulso');
            } else {
                this.pato.classList.remove('impulso');
            }
        }
             
        this.contenedorTroncos.innerHTML = ''; 

        modelo.troncos.forEach(t => {      
            const divSup = document.createElement('div');
            divSup.className = 'tronco tronco-arriba';
            divSup.style.width = `${t.ancho}px`;
            divSup.style.height = `${t.superior.alto}px`;
            divSup.style.transform = `translate3d(${t.x}px, ${t.superior.y}px, 0)`;
            this.contenedorTroncos.appendChild(divSup);

            const divInf = document.createElement('div');
            divInf.className = 'tronco tronco-abajo';
            divInf.style.width = `${t.ancho}px`;
            divInf.style.height = `${t.inferior.alto}px`;
            divInf.style.transform = `translate3d(${t.x}px, ${t.inferior.y}px, 0)`;
            this.contenedorTroncos.appendChild(divInf);
        });
        
        // 2. Dibujar Monedas usando keyframes de forma estable
        modelo.items.forEach(item => {
            const div = document.createElement('div');
            div.className = item.tipo;
            div.style.width = `${item.ancho}px`;
            div.style.height = `${item.alto}px`;
            div.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
            if (item.tipo === 'moneda') div.style.animationDelay = `-${item.x * 0.005}s`;
            if (item.tipo === 'mosca') div.style.animationDelay = `-${item.x * 0.01}s`;
            this.contenedorTroncos.appendChild(div);
        });
	if (modelo.puntos > this.puntajeAnterior) {
            const diferencia = modelo.puntos - this.puntajeAnterior;
            this.mostrarFlotante(`+${diferencia}`, modelo.pato.x + 50, modelo.pato.y);
            this.puntajeAnterior = modelo.puntos;
        }
        
        if (modelo.puntos === 0) {
            this.puntajeAnterior = 0;
        }

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

		    setTimeout(() => el.remove(), 800);
		}   
}
