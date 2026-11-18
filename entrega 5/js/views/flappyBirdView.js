class GameView {
    constructor() {
        this.elementosCapas = document.querySelectorAll('.capa');
        this.pato = document.getElementById('pato');
        this.contenedorEntidades = document.getElementById('entidades');
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
        
        // 2. Dibujar Monedas usando keyframes de forma estable
	modelo.monedas.forEach(m => {
	    const divMoneda = document.createElement('div');
	    divMoneda.className = 'moneda';
	    divMoneda.style.width = `${m.ancho}px`;
	    divMoneda.style.height = `${m.alto}px`;
	    divMoneda.style.transform = `translate3d(${m.x}px, ${m.y}px, 0)`;

	    // ESTO ES LO QUE SALVA EL KEYFRAME:
	    // Al usar la posición 'X' de la moneda como un desfase negativo en el delay,
	    // el navegador calcula exactamente en qué frame del keyframe debe arrancar 
	    // y la animación nunca se traba ni se reinicia al redibujar el DOM.
	    divMoneda.style.animationDelay = `-${m.x * 0.005}s`;

	    this.contenedorEntidades.appendChild(divMoneda);
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

        // --- RENDERIZAR LAS MOSCAS ---
        modelo.moscas.forEach(m => {
            const divMosca = document.createElement('div');
            divMosca.className = 'mosca';
            divMosca.style.width = `${m.ancho}px`;
            divMosca.style.height = `${m.alto}px`;
            divMosca.style.transform = `translate3d(${m.x}px, ${m.y}px, 0)`;
            this.contenedorEntidades.appendChild(divMosca);
        });

        // (Opcional) Actualizar texto de vidas si tienes un span con id="vidas" en el HUD
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
