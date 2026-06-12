// --- BASE DE DATOS DE REGLAMENTOS INTEGRADOS ---
const REGLAMENTOS_MESA = {
    generala: {
        titulo: "Manual Completo: La Generala",
        cuerpo: "<p><strong>Estructura del Juego:</strong> Se juega con 5 dados y un vaso. Cada jugador dispone de tres tiros por ronda. Puede separar los dados que le sirvan y volver a tirar los restantes.</p><p><strong>Categorías de Anotación:</strong><ul><li><strong>Escalera:</strong> 20 puntos (o 25 si es servida). Ej: 1-2-3-4-5.</li><li><strong>Full:</strong> 30 puntos (tres dados iguales y dos iguales).</li><li><strong>Póker:</strong> 40 puntos (cuatro dados iguales).</li><li><strong>Generala:</strong> 50 puntos (cinco dados iguales). Si se logra en el primer tiro de la ronda, ¡ganás el juego automáticamente de forma servida!</li></ul></p>"
    },
    rummy: {
        titulo: "Manual Completo: El Rummy",
        cuerpo: "<p><strong>Combinaciones Válidas:</strong> Para poder descargar fichas o cartas en la mesa, debés formar series de mínimo 3 elementos.<ul><li><strong>Tercetos/Cuartetos:</strong> Mismo número pero de diferente color o palo.</li><li><strong>Escaleras:</strong> Números consecutivos pertenecientes al mismo color o palo (Ej: 4, 5 y 6 de Corazones).</li></ul></p><p><strong>La Regla de los 30 puntos:</strong> Tu primera descarga en la mesa debe sumar obligatoriamente 30 puntos o más utilizando los valores faciales de tus combinaciones.</p>"
    },
    truco: {
        titulo: "Manual Completo: Truco Argentino",
        cuerpo: "<p><strong>Puntaje y Estructura:</strong> Se juega a 30 puntos globales. Se divide en dos etapas de 15 tantos conocidos popularmente como 'Malas' y 'Buenas'.</p><p><strong>La Jerarquía de las Cartas (De mayor a menor):</strong><br>1. Ancho de Espada (1 de Espada)<br>2. Ancho de Basto (1 de Basto)<br>3. Siete de Espada<br>4. Siete de Oro<br>5. Los Tres<br>6. Los Dos<br>7. Los Anchos Falsos (Copa y Oro).</p>"
    },
    ajedrez: {
        titulo: "Manual de Disputa: Ajedrez",
        cuerpo: "<p><strong>Reglas de Oro:</strong> Las blancas abren siempre la partida. El movimiento de las piezas es asimétrico: la Torre avanza en línea recta, el Alfil en diagonal, el Caballo en forma de 'L' saltando piezas, y la Reina tiene libertad absoluta direccional.</p><p><strong>El Enroque:</strong> Movimiento táctico especial de defensa que involucra al Rey y a la Torre, siempre y cuando ninguna de las dos piezas se haya movido previamente y no haya obstáculos en el medio.</p>"
    },
    scrabble: {
        titulo: "Manual de Referato: Scrabble",
        cuerpo: "<p><strong>Validación Léxica:</strong> Cada competidor extrae 7 fichas de la bolsa. Al armar una palabra en el tablero, sumás los valores de cada letra. Si lográs usar las 7 letras de tu atril en un solo turno, obtenés un bono especial de **50 puntos extras** (Bingo).</p>"
    },
    pictionary: {
        titulo: "Manual Técnico: Pictionary",
        cuerpo: "<p><strong>Mecánica contra Reloj:</strong> El dibujante toma una tarjeta de categoría y dispone de exactamente 60 segundos (controlados en el Panel del Reloj) para plasmar la idea. Está estrictamente penalizado emitir sonidos, gesticular, o trazar números/letras en la hoja o pizarra.</p>"
    }
};

// --- CONTROLADOR DE CONSULTAS EN PANTALLA ---
function mostrarReglamentoPantalla(juegoKey) {
    const lector = document.getElementById('seccion-lector-reglas');
    const titulo = document.getElementById('txtLectorTitulo');
    const cuerpo = document.getElementById('txtLectorCuerpo');

    if (REGLAMENTOS_MESA[juegoKey]) {
        titulo.innerText = REGLAMENTOS_MESA[juegoKey].titulo;
        cuerpo.innerHTML = REGLAMENTOS_MESA[juegoKey].cuerpo;
        
        lector.classList.remove('d-none');
        // Smooth scroll automático para centrar la lectura en móviles y PC
        lector.scrollIntoView({ behavior: 'smooth' });
    }
}

function cerrarLectorReglas() {
    document.getElementById('seccion-lector-reglas').classList.add('d-none');
}

// --- REDIRECCIONAMIENTO INTERNO ---
function inicializarAnotadorRapido(juegoKey) {
    // Si es truco o rummy, activa automáticamente sus respectivas herramientas en el Dashboard
    if(juegoKey === 'truco') {
        window.location.href = "#herramientas";
        cargarHerramienta('truco');
    } else if(juegoKey === 'rummy') {
        window.location.href = "#herramientas";
        // Dispara el Modal de Campeonato de forma nativa para que inicie la planilla
        const modalTorneo = new bootstrap.Modal(document.getElementById('modalTorneoRummy'));
        modalTorneo.show();
    } else {
        window.location.href = "#herramientas";
    }
}