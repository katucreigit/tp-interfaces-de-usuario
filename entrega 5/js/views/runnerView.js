class runnerView {
    constructor() {
        this.elementosCapas = document.querySelectorAll('.capa');
        this.pato = document.getElementById('pato');
        this.contenedorTroncos = document.getElementById('troncos');
        this.pantallaInicio = document.getElementById('pantalla-inicio');
        this.pantallaReinicio = document.getElementById('pantalla-reinicio');
        this.mejorRecord = document.getElementById('mejor-record');
        this.puntajeFinal = document.getElementById('puntaje-final');
        this.contenedorVidas = document.getElementById('vidas');
        this.spanPuntos = document.getElementById('puntos');

        this.puntajeAnterior = 0;
        this.elementosTroncos = new Map();
        this.elementosItems = new Map();
        this.corazones = [];

        this.inicializarVidas();
    }
    
	inicializarVidas(totalVidas = 5) {
		    if (!this.contenedorVidas) return;
		    this.contenedorVidas.innerHTML = '';
		    this.corazones = [];

		    for (let i = 0; i < totalVidas; i++) {
		        const corazon = document.createElement('span');
		        corazon.className = 'corazon';
		        corazon.textContent = '♥';
		        this.contenedorVidas.appendChild(corazon);
		        this.corazones.push(corazon);
		    }
    }
    
    render(modelo, record) {
        this.actualizarFondoYPato(modelo);
        this.actualizarPantallas(modelo, record);
        this.actualizarEstadoPato(modelo);
        this.dibujarTroncos(modelo);
        this.dibujarItems(modelo);
        this.actualizarVidas(modelo);
        this.actualizarPuntaje(modelo);
    }
    
   actualizarFondoYPato(modelo) {
        modelo.capas.forEach((capa, index) => {
            const el = this.elementosCapas[index];
            if (el) el.style.backgroundPositionX = `${capa.x}px`;
        });

        if (this.pato) {
            this.pato.style.transform = `translate(${modelo.pato.x}px, ${modelo.pato.y}px) rotate(${modelo.pato.rotacion}deg)`;
        }
    }

    actualizarPantallas(modelo, record) {
        if (this.pantallaInicio) {
            this.pantallaInicio.style.display = modelo.estado === 'menu' ? 'flex' : 'none';
        }
        if (this.pantallaReinicio) {
            this.pantallaReinicio.style.display = modelo.estado === 'fin' ? 'flex' : 'none';
        }
        if (modelo.estado === 'fin') {
            if (this.mejorRecord) this.mejorRecord.textContent = record;
            if (this.puntajeFinal) this.puntajeFinal.textContent = modelo.puntajeFinal;
        }
    }

    actualizarEstadoPato(modelo) {
        if (modelo.pato.tiempoChoqueVisual > 0) {
            this.ponerEstado('choque');
        } else if (modelo.estado === 'jugando' && modelo.pato.velocidadY < 0) {
            this.ponerEstado('impulso');
        } else {
            this.ponerEstado('volando');
        }
    }

    actualizarVidas(modelo) {
        const vidasActuales = Math.max(0, modelo.vidas);
        this.corazones.forEach((corazon, i) => {
            corazon.classList.toggle('vacio', i >= vidasActuales);
        });
    }

    actualizarPuntaje(modelo) {
        if (modelo.puntos > this.puntajeAnterior) {
            const diferencia = modelo.puntos - this.puntajeAnterior;
            this.mostrarFlotante(`+${diferencia}`, modelo.pato.x + 50, modelo.pato.y);
            this.puntajeAnterior = modelo.puntos;
        } else if (modelo.puntos === 0) {
            this.puntajeAnterior = 0;
        }

        if (this.spanPuntos) {
            this.spanPuntos.textContent = modelo.puntos;
        }
    }

    ponerEstado(estado) {
        if (!this.pato || this.pato.classList.contains(estado)) return;

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

                this.elementosTroncos.set(t, { superior: divSup, inferior: divInf });
            }

            const elementos = this.elementosTroncos.get(t);
            elementos.superior.style.width = `${t.ancho}px`;
            elementos.superior.style.height = `${t.superior.alto}px`;
            elementos.superior.style.transform = `translate3d(${t.x}px, ${t.superior.y}px, 0)`;

            elementos.inferior.style.width = `${t.ancho}px`;
            elementos.inferior.style.height = `${t.inferior.alto}px`;
            elementos.inferior.style.transform = `translate3d(${t.x}px, ${t.inferior.y}px, 0)`;
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
            if (!this.elementosItems.has(item)) {
                const div = document.createElement('div');
                div.className = item.tipo;

                if (item.tipo === 'moneda') {
                    div.style.animationDelay = `${-item.x * 0.005}s`;
                } else if (item.tipo === 'mosca') {
                    div.style.animationDelay = `${-item.x * 0.01}s`;
                }

                this.contenedorTroncos.appendChild(div);
                this.elementosItems.set(item, div);
            }

            const div = this.elementosItems.get(item);
            div.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
        });

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
