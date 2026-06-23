/**
 * SINAPSIS ENGINE CORE - 2026 EXTENDED V3.5
 */

// --- 1. VARIABLES GLOBALES ---
let usuarioLogueado = null;
let authModoActual = 'login';
let FischerInterval = null;
let activeClock = 1;
let timeP1 = 300;
let timeP2 = 300;

// --- 2. DICCIONARIOS ---
const REGLAS_DICCIONARIO = {
    generala: "<h5>Reglas Oficiales: Generala</h5><p>Se juega con 5 dados y un vaso. Cada jugador dispone de hasta 3 tiros por turno...</p>",
    truco: "<h5>Reglas Oficiales: Truco</h5><p>Juego de naipes españoles de 2 a 4 jugadores...</p>",
    rummy: "<h5>Reglas Oficiales: Rummy</h5><p>El objetivo es descartar todas las fichas...</p>",
    uno: "<h5>Reglas Oficiales: UNO</h5><p>Cada jugador recibe 7 cartas...</p>",
    ajedrez: "<h5>Reglas Oficiales: Ajedrez</h5><p>Juego de estrategia pura sobre tablero de 8x8...</p>",
    damas: "<h5>Reglas Oficiales: Damas</h5><p>Se juega sobre las casillas oscuras del tablero...</p>",
    teg: "<h5>Reglas Oficiales: T.E.G.</h5><p>Tradicional juego de Planificación de Estrategia Global...</p>",
    batalla_naval: "<h5>Reglas Oficiales: Batalla Naval</h5><p>Cada jugador posiciona su flota de barcos...</p>",
    scrabble: "<h5>Reglas Oficiales: Scrabble</h5><p>Cada jugador roba 7 letras de la bolsa...</p>",
    tutti_frutti: "<h5>Reglas Oficiales: Tutti Frutti</h5><p>Se sortea una letra de juego...</p>",
    ahorcado: "<h5>Reglas Oficiales: Ahorcado</h5><p>Un jugador piensa una palabra...</p>",
    trivial: "<h5>Reglas Oficiales: Trivial Pursuit</h5><p>Los jugadores avanzan por el tablero...</p>",
    pictionary: "<h5>Reglas Oficiales: Pictionary</h5><p>Juego de mesa de dibujo en equipo...</p>",
    jinete: "<h5>Lienzo de Desarrollo: El 5to Jinete</h5><p>Estructura de despliegue fígital...</p>"
};

const DICCIONARIO_MASTER = {
    "MESA": "Mueble compuesto por una tabla horizontal...",
    "JUEGO": "Actividad recreativa o de competición...",
    "TRUCO": "Juego criollo de cartas altamente competitivo...",
    "SCRABBLE": "Competición léxica de tablero...",
    "PICTIONARY": "Dinámica grupal basada en la decodificación...",
    "AJEDREZ": "Estrategia milenaria abstracta...",
    "SINAPSIS": "Estructura de red interactiva e interconexión...",
    "LIENZO": "Soporte base de juego fígital...",
    "HIBRIDO": "Sistema combinado que fusiona elementos...",
    "BLUETOOTH": "Especificación tecnológica de radiocomunicación..."
};

// --- 3. FUNCIONES DE LÓGICA (CORE) ---

function verificarSesionExistente() {
    const sesion = localStorage.getItem('sinapsis_sesion_activa');
    let user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        user = { nombre: "Mariana Delgado", rango: "Jugador", nivel: 12, stats: { partidasJugadas: 124, puntosTotales: 872 } };
        localStorage.setItem('user', JSON.stringify(user));
    }

    const container = document.getElementById('wrapperPerfilAccion');
    const panelDashboard = document.getElementById('dashboard-seccion');
    const panelBloqueado = document.getElementById('estado-bloqueado');

    if (sesion && container) {
        usuarioLogueado = sesion;
        container.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <div class="perfil-info text-end">
                    <div class="fw-bold text-white">${user.nombre}</div>
                    <small class="text-cyan">${user.rango} | Nivel ${user.nivel}</small>
                </div>
                <button class="btn btn-xs btn-outline-danger" onclick="cerrarSesion()">Salir</button>
            </div>
        `;
        if (panelDashboard) panelDashboard.classList.remove('d-none');
        if (panelBloqueado) panelBloqueado.classList.add('d-none');
        
        const elBienvenida = document.getElementById('txtBienvenidaLibreta');
        if (elBienvenida) elBienvenida.innerText = `Libreta Virtual de ${user.nombre}`;
        
        const elStats = document.getElementById('lblRecordPts');
        if (elStats) elStats.innerHTML = `<div><small>Partidas</small> <strong>${user.stats.partidasJugadas}</strong></div><div><small>Puntos</small> <strong>${user.stats.puntosTotales}</strong></div>`;
    } else if (container) {
        container.innerHTML = `<button class="btn-profile-pill" onclick="abrirAuthModal()">Iniciar Sesión</button>`;
        if (panelDashboard) panelDashboard.classList.add('d-none');
        if (panelBloqueado) panelBloqueado.classList.remove('d-none');
    }
}

function abrirAuthModal() {
    const modalEl = document.getElementById('authModal');
    if (modalEl) new bootstrap.Modal(modalEl).show();
}

function cerrarSesion() {
    localStorage.removeItem('sinapsis_sesion_activa');
    location.reload();
}

function procesarAutenticacion(event) {
    if(event) event.preventDefault();
    const username = document.getElementById('authUsername').value.trim();
    if (!username) return;
    localStorage.setItem('sinapsis_sesion_activa', username);
    const modalEl = document.getElementById('authModal');
    const instance = bootstrap.Modal.getInstance(modalEl);
    if (instance) instance.hide();
    verificarSesionExistente();
}

function cerrarAsistente() {
    const dashboard = document.getElementById('dashboard-seccion');
    if (dashboard) dashboard.classList.add('d-none');
}

// --- 4. INICIALIZACIÓN FINAL ---
window.addEventListener('load', () => {
    // Inicializar datos si no existen
    if (!localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify({
            nombre: "Mariana Delgado", rango: "Jugador", nivel: 12, 
            stats: { partidasJugadas: 124, puntosTotales: 872 }
        }));
    }
    // Ejecutar verificación
    verificarSesionExistente();
});