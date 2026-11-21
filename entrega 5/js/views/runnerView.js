class runnerView {
    constructor() {
        this.elementosCapas = document.querySelectorAll('.capa');
        this.pato = document.getElementById('pato');
        this.contenedorTroncos = document.getElementById('troncos');
        this.puntajeAnterior = 0;
        this.elementosTroncos = new Map();
		this.elementosItems = new Map();
    }

    render(modelo, record) {
        // Mover las capas del fondo
        modelo.capas.forEach((capa, index) => {
            const el = this.elementosCapas[index];
    
            if (el) {
                el.style.backgroundPositionX = `${capa.x}px`;
            }
        });
    
        // Posición y rotación del pato
        this.pato.style.transform = `translate(${modelo.pato.x}px, ${modelo.pato.y}px) rotate(${modelo.pato.rotacion}deg)`;
        
        const pantallaInicio = document.getElementById('pantalla-inicio');

		if (pantallaInicio) {
			pantallaInicio.style.display =
			modelo.estado === 'menu' ? 'flex' : 'none';
		}
		const pantallaReinicio = document.getElementById('pantalla-reinicio');

		if (pantallaReinicio) {
			pantallaReinicio.style.display =
				modelo.estado === 'fin' ? 'flex' : 'none';
		}
		
		if (modelo.estado === 'fin') {
			document.getElementById('mejor-record').textContent = record;
		}
        //Estados visuales del pato
        if (modelo.pato.tiempoChoqueVisual > 0) {
			this.ponerEstado('choque');
		} else if (modelo.enJuego && modelo.pato.velocidadY < 0) {
			this.ponerEstado('impulso');
		} else {
			this.ponerEstado('volando');
		}
		
		this.dibujarTroncos(modelo);
        this.dibujarItems(modelo);

        const contenedorVidas = document.getElementById('vidas');
        
        if (contenedorVidas) {
            const totalVidas = 5;

            if (contenedorVidas.children.length !== totalVidas) {
                contenedorVidas.innerHTML = '';
                
                for (let i = 0; i < totalVidas; i++) {
                    const corazon = document.createElement('span');
                    corazon.className = 'corazon';
                    corazon.textContent = '♥';
                    contenedorVidas.appendChild(corazon);
                }
            }

            const vidasActuales = Math.max(0, modelo.vidas);
            const corazones = contenedorVidas.children;
            for (let i = 0; i < corazones.length; i++) {
                corazones[i].classList.toggle('vacio', i >= vidasActuales);
            }
        }

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

    }
    
    ponerEstado(estado) {
	    if (this.pato.classList.contains(estado)) return;

	    this.pato.classList.remove('volando', 'impulso', 'choque');

	    void this.pato.offsetWidth;

	    this.pato.classList.add(estado);
	}
	
	dibujarTroncos(modelo) {
		modelo.troncos.forEach(t => {

		    if (!this.elementosTroncos.has(t)) {

		        const divSup = document.createElement('div');
		        divSup.className = 'tronco tronco-arriba';

		        const divInf = document.createElement('div');
		        divInf.className = 'tronco';

		        this.contenedorTroncos.appendChild(divSup);
		        this.contenedorTroncos.appendChild(divInf);

		        this.elementosTroncos.set(t, {
		            superior: divSup,
		            inferior: divInf
		        });
		    }

		    const elementos = this.elementosTroncos.get(t);

		    elementos.superior.style.width = `${t.ancho}px`;
		    elementos.superior.style.height = `${t.superior.alto}px`;
		    elementos.superior.style.transform =`translate3d(${t.x}px, ${t.superior.y}px, 0)`;

		    elementos.inferior.style.width = `${t.ancho}px`;
		    elementos.inferior.style.height = `${t.inferior.alto}px`;
		    elementos.inferior.style.transform =
		        `translate3d(${t.x}px, ${t.inferior.y}px, 0)`;
		});

		const troncosActuales = new Set(modelo.troncos);

		for (const [tronco, elementos] of this.elementosTroncos) {
		    if (!troncosActuales.has(tronco)) {
		        elementos.superior.remove();
		        elementos.inferior.remove();

		        this.elementosTroncos.delete(tronco);
		    }
		}
	}
dibujarItems(modelo) {
    modelo.items.forEach(item => {

        // Si el item todavía no tiene elemento, lo creamos
        if (!this.elementosItems.has(item)) {

            const div = document.createElement('div');

            div.className = item.tipo;

            if (item.tipo === 'moneda') {
                div.style.animationDelay = `${-item.x * 0.005}s`;
            }

            if (item.tipo === 'mosca') {
                div.style.animationDelay = `${-item.x * 0.01}s`;
            }

            this.contenedorTroncos.appendChild(div);

            this.elementosItems.set(item, div);
        }

        // Recuperamos el elemento existente
        const div = this.elementosItems.get(item);

        // Actualizamos su posición
        div.style.transform =
            `translate3d(${item.x}px, ${item.y}px, 0)`;
    });

    // Eliminamos los items que ya no están en el modelo
    const itemsActuales = new Set(modelo.items);

    for (const [item, div] of this.elementosItems) {
        if (!itemsActuales.has(item)) {
            div.remove();

            this.elementosItems.delete(item);
        }
    }
}

 mostrarFlotante(texto, x, y) {
        const juego = document.getElementById('juego');
        if (!juego) return;

        const el = document.createElement('div');
        el.className = 'texto-flotante';
        el.textContent = texto;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;

        juego.appendChild(el);

        setTimeout(() => el.remove(), 800);
    }   
}
