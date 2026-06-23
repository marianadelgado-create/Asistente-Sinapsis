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