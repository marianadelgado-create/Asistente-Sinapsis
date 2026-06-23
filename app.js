/**
 * SINAPSIS ENGINE CORE - RECONSTRUCCIÓN TOTAL V5
 */

// 1. DICCIONARIO MAESTRO (Más contenido para reglas)
const BIBLIOTECA_JUEGOS = {
    generala: { titulo: "Generala", texto: "Juego de dados donde el objetivo es obtener la mayor puntuación completando jugadas como la Generala, Poker o Full. ¡Requiere azar y estrategia al decidir qué dados guardar!" },
    truco: { titulo: "Truco", texto: "El juego de naipes por excelencia en Argentina. Combina engaño, memoria y estrategia. Se juega a 30 puntos y utiliza señas para comunicarse con el compañero." },
    scrabble: { titulo: "Scrabble", texto: "Un desafío léxico donde cada letra tiene un valor. El objetivo es formar palabras sobre un tablero aprovechando casillas multiplicadoras de puntos." },
    trivial: { titulo: "Trivial", texto: "Pone a prueba tus conocimientos generales. Debes recorrer el tablero y responder preguntas de distintas categorías para obtener todos los quesitos." }
};

// 2. FUNCIONES DE SESIÓN
window.abrirAuthModal = function() {
    const modalEl = document.getElementById('authModal');
    if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    } else {
        console.error("No se encontró el modal de autenticación.");
    }
};

window.cerrarSesion = function() {
    localStorage.removeItem('user');
    location.reload();
};

// 3. FUNCIONES DE JUEGO (Reglas y Anotador)
window.verReglas = function(juegoId) {
    const juego = BIBLIOTECA_JUEGOS[juegoId];
    const visor = document.getElementById('visor-reglas');
    const cuerpo = document.getElementById('reglasCuerpo');
    
    if (visor && cuerpo) {
        cuerpo.innerHTML = juego ? `<h5>${juego.titulo}</h5><p>${juego.texto}</p>` : "Reglas no encontradas.";
        visor.classList.remove('d-none');
        visor.scrollIntoView({ behavior: 'smooth' });
    }
};

window.activarAsistente = function(juegoId) {
    const workspace = document.getElementById('workspace-asistente');
    if (workspace) {
        workspace.innerHTML = `
            <div class="p-4 text-center">
                <h5>Computar Ronda de ${juegoId.toUpperCase()}</h5>
                <input type="number" id="ptsNuevosJuego" class="form-control" placeholder="Puntos obtenidos">
                <button class="btn btn-primary mt-2" onclick="guardarRondaGenerica('${juegoId}')">Confirmar Anotación</button>
            </div>
        `;
    }
};

window.guardarRondaGenerica = function(juegoId) {
    const pts = parseInt(document.getElementById('ptsNuevosJuego').value) || 0;
    let user = JSON.parse(localStorage.getItem('user'));
    user.stats.puntosTotales += pts;
    localStorage.setItem('user', JSON.stringify(user));
    alert("¡Puntaje registrado con éxito!");
    location.reload(); // Refresca para actualizar el perfil
};

// 4. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    // Si no hay usuario, forzamos uno para que el sitio funcione
    if (!localStorage.getItem('user')) {
        const userDefault = { 
            nombre: "Mariana Delgado", rango: "Jugador", nivel: 12, 
            stats: { partidasJugadas: 124, puntosTotales: 872 } 
        };
        localStorage.setItem('user', JSON.stringify(userDefault));
    }
    
    // Sincronizar UI
    const user = JSON.parse(localStorage.getItem('user'));
    const container = document.getElementById('wrapperPerfilAccion');
    if (container) {
        container.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <div class="text-end">
                    <div class="fw-bold text-white">${user.nombre}</div>
                    <small class="text-cyan">${user.rango} | Nivel ${user.nivel}</small>
                </div>
                <button class="btn btn-xs btn-outline-danger" onclick="cerrarSesion()">Salir</button>
            </div>
        `;
    }
});