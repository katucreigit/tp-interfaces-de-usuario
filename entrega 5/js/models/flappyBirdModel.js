class flappyBirdModel {
    constructor(ancho, alto) {
        this.ancho = ancho;
        this.alto = alto;
        this.velocidad = 200; // Velocidad base de desplazamiento en píxeles/segundo

        // Capas con factores de velocidad relativos al fondo
        this.capas = [
            { x: 0, factor: 0.1 }, // Fondo (muy lento)
            { x: 0, factor: 0.2 }, // Nubes
            { x: 0, factor: 0.4 }, // Cerca
            { x: 0, factor: 0.6 }, // Arbustos
            { x: 0, factor: 1.0 }  // Piso (velocidad normal)
        ];

        this.pajaro = {
            y: 250,
            velocidadY: 0,
            rotacion: 0
        };
    }

    actualizar(dt) {
        const ANCHO_TILE = 900; // Coincide con el ancho de diseño de tus imágenes

        // Actualizar el desplazamiento de cada capa en bucle infinito
        for (const capa of this.capas) {
            capa.x = (capa.x - this.velocidad * capa.factor * dt) % ANCHO_TILE;
        }
    }
}
