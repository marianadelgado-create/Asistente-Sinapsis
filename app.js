/**
 * SINAPSIS ENGINE CORE - 2026 EXTENDED V3.6
 */

// --- 1. DATOS DE SESIÓN Y USUARIO ---
const obtenerUsuario = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user || { nombre: "Mariana", rango: "Jugador", nivel: 1, stats: { partidasJugadas: 0, puntosTotales: 0 } };
};

// --- 2. LÓGICA DE INTERFAZ (Dashboard Inteligente) ---
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
    if (panelDashboard) panelDashboard.classList.remove('d-none');
}

// --- 3. MÓDULO DE JUEGOS DINÁMICO ---
// Esta función ahora será el corazón para tus futuros juegos (Sudoku, Ludo, etc)
function abrirModuloJuego(juegoId) {
    console.log("Cargando módulo:", juegoId);
    // Aquí es donde agregaremos el texto flotante y la navegación a la historia
    verReglas(juegoId);
}

// --- 4. INICIALIZACIÓN ---
window.addEventListener('load', () => {
    // Si no hay datos, inicializamos a Mariana
    if (!localStorage.getItem('user')) {
        const datosDefault = {
            nombre: "Mariana Delgado",
            rango: "Jugador",
            nivel: 12,
            stats: { partidasJugadas: 124, puntosTotales: 872 }
        };
        localStorage.setItem('user', JSON.stringify(datosDefault));
    }
    verificarSesionExistente();
});
// --- RESTAURACIÓN DE MÓDULOS DE JUEGO ---

function activarAsistente(juego) {
    const workspace = document.getElementById('workspace-asistente');
    if (!workspace) return;
    
    // Aquí es donde vive la lógica que anotaba puntos
    workspace.innerHTML = `
        <div class="p-4 text-center">
            <h5 class="text-white">Computar Ronda de ${juego.toUpperCase()}</h5>
            <div class="input-group justify-content-center">
                <input type="number" id="ptsNuevosJuego" class="form-control max-w-100" placeholder="Puntos logrados">
                <button class="btn btn-cyan-premium" onclick="guardarRondaGenerica('${juego}')">Anotar</button>
            </div>
        </div>
    `;
    document.getElementById('dashboard-seccion').classList.remove('d-none');
}

function verReglas(juego) {
    const visor = document.getElementById('visor-reglas');
    const cuerpo = document.getElementById('reglasCuerpo');
    if (!visor || !cuerpo) return;

    // Usamos el diccionario que ya teníamos definido arriba
    const reglas = REGLAS_DICCIONARIO[juego] || "<p>Reglas no encontradas para este juego.</p>";
    cuerpo.innerHTML = reglas;
    visor.classList.remove('d-none');
    visor.scrollIntoView({ behavior: 'smooth' });
}

function guardarRondaGenerica(juego) {
    const input = document.getElementById('ptsNuevosJuego');
    const pts = Number(input.value) || 0;
    
    let user = JSON.parse(localStorage.getItem('user'));
    user.stats.puntosTotales += pts;
    localStorage.setItem('user', JSON.stringify(user));
    
    alert(`Puntaje de ${juego.toUpperCase()} guardado.`);
    verificarSesionExistente(); // Refresca el dashboard con los nuevos puntos
}