/**
 * SINAPSIS ENGINE CORE - RECONSTRUCCIÓN TOTAL V4
 */

// 1. DICCIONARIOS DE REGLAS
const REGLAS_DICCIONARIO = {
    generala: "<h5>Reglas: Generala</h5><p>Se juega con 5 dados...</p>",
    truco: "<h5>Reglas: Truco</h5><p>Juego de naipes...</p>",
    scrabble: "<h5>Reglas: Scrabble</h5><p>Formar palabras...</p>",
    trivial: "<h5>Reglas: Trivial</h5><p>Preguntas y respuestas...</p>"
};

// 2. FUNCIONES DE PERFIL Y SEGURIDAD
function obtenerUsuario() {
    const userGuardado = localStorage.getItem('user');
    if (!userGuardado) return { nombre: "Mariana", rango: "Jugador", nivel: 1, stats: { partidasJugadas: 0, puntosTotales: 0 } };
    
    const user = JSON.parse(userGuardado);
    // Aseguramos que 'stats' exista para evitar el TypeError
    if (!user.stats) user.stats = { partidasJugadas: 0, puntosTotales: 0 };
    return user;
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
                    <small class="text-cyan">${user.rango} | Nivel ${user.nivel || 1}</small>
                </div>
                <button class="btn btn-xs btn-outline-danger" onclick="cerrarSesion()">Salir</button>
            </div>
        `;
    }
}

// 3. FUNCIONES GLOBALES PARA EL HTML
window.cerrarSesion = function() {
    localStorage.removeItem('sinapsis_sesion_activa');
    location.reload();
};

window.verReglas = function(juego) {
    const visor = document.getElementById('visor-reglas');
    const cuerpo = document.getElementById('reglasCuerpo');
    if (visor && cuerpo) {
        cuerpo.innerHTML = REGLAS_DICCIONARIO[juego] || "<p>Reglas no disponibles en esta versión.</p>";
        visor.classList.remove('d-none');
        visor.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error("Visor de reglas no encontrado en el DOM");
    }
};

window.activarAsistente = function(juego) {
    const workspace = document.getElementById('workspace-asistente');
    const panelDashboard = document.getElementById('dashboard-seccion');
    if (workspace && panelDashboard) {
        workspace.innerHTML = `
            <div class="p-4 text-center">
                <h5>Computar Ronda de ${juego.toUpperCase()}</h5>
                <input type="number" id="ptsNuevosJuego" class="form-control" placeholder="Puntos">
                <button class="btn btn-primary mt-2" onclick="guardarRondaGenerica('${juego}')">Anotar</button>
            </div>
        `;
        panelDashboard.classList.remove('d-none');
        panelDashboard.scrollIntoView({ behavior: 'smooth' });
    }
};

window.guardarRondaGenerica = function(juego) {
    const input = document.getElementById('ptsNuevosJuego');
    const pts = parseInt(input.value) || 0;
    let user = obtenerUsuario();
    
    user.stats.puntosTotales += pts;
    localStorage.setItem('user', JSON.stringify(user));
    alert("Puntaje guardado.");
    verificarSesionExistente();
};

// 4. INICIALIZACIÓN SEGURA
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify({
            nombre: "Mariana Delgado", rango: "Jugador", nivel: 12, 
            stats: { partidasJugadas: 124, puntosTotales: 872 }
        }));
    }
    verificarSesionExistente();
});