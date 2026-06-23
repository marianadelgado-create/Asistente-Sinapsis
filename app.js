/**
 * SINAPSIS ENGINE CORE - RECONSTRUCCIÓN TOTAL
 */

// 1. DICCIONARIOS
const REGLAS_DICCIONARIO = {
    generala: "<h5>Reglas: Generala</h5><p>Se juega con 5 dados...</p>",
    truco: "<h5>Reglas: Truco</h5><p>Juego de naipes...</p>",
    scrabble: "<h5>Reglas: Scrabble</h5><p>Formar palabras...</p>",
    trivial: "<h5>Reglas: Trivial</h5><p>Preguntas y respuestas...</p>"
};

// 2. FUNCIONES DE PERFIL Y SESIÓN
function obtenerUsuario() {
    return JSON.parse(localStorage.getItem('user')) || { nombre: "Mariana Delgado", rango: "Jugador", nivel: 12, stats: { partidasJugadas: 124, puntosTotales: 872 } };
}

function verificarSesionExistente() {
    const user = obtenerUsuario();
    const container = document.getElementById('wrapperPerfilAccion');
    const panelDashboard = document.getElementById('dashboard-seccion');

    if (container) {
        container.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <div class="perfil-info text-end">
                    <div class="fw-bold text-white">${user.nombre}</div>
                    <small class="text-cyan">${user.rango} | Nivel ${user.nivel}</small>
                </div>
                <button class="btn btn-xs btn-outline-danger" onclick="cerrarSesion()">Salir</button>
            </div>
        `;
    }
    if (panelDashboard) panelDashboard.classList.remove('d-none');
}

function cerrarSesion() {
    localStorage.removeItem('sinapsis_sesion_activa');
    location.reload();
}

// 3. FUNCIONES DE JUEGO (REGLAS Y ASISTENTE)
window.verReglas = function(juego) {
    const visor = document.getElementById('visor-reglas');
    const cuerpo = document.getElementById('reglasCuerpo');
    if (visor && cuerpo) {
        cuerpo.innerHTML = REGLAS_DICCIONARIO[juego] || "Reglas no disponibles.";
        visor.classList.remove('d-none');
        visor.scrollIntoView({ behavior: 'smooth' });
    }
};

window.activarAsistente = function(juego) {
    const workspace = document.getElementById('workspace-asistente');
    if (workspace) {
        workspace.innerHTML = `
            <div class="p-4 text-center">
                <h5>Computar Ronda de ${juego.toUpperCase()}</h5>
                <input type="number" id="ptsNuevosJuego" placeholder="Puntos">
                <button onclick="guardarRondaGenerica('${juego}')">Anotar</button>
            </div>
        `;
        document.getElementById('dashboard-seccion').classList.remove('d-none');
    }
};

window.guardarRondaGenerica = function(juego) {
    const pts = Number(document.getElementById('ptsNuevosJuego').value) || 0;
    let user = obtenerUsuario();
    user.stats.puntosTotales += pts;
    localStorage.setItem('user', JSON.stringify(user));
    alert("Puntaje guardado.");
    verificarSesionExistente();
};

// 4. CARGA INICIAL
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify({
            nombre: "Mariana Delgado", rango: "Jugador", nivel: 12, 
            stats: { partidasJugadas: 124, puntosTotales: 872 }
        }));
    }
    verificarSesionExistente();
});