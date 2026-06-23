/**
 * SINAPSIS ENGINE CORE - REINICIO Y ESTABILIZACIÓN V6
 */

// 1. DICCIONARIO MAESTRO
const BIBLIOTECA_JUEGOS = {
    generala: { titulo: "Generala", texto: "Juego de dados: busca obtener Generala, Poker o Full." },
    truco: { titulo: "Truco", texto: "Juego de naipes de engaño y estrategia por puntos." },
    scrabble: { titulo: "Scrabble", texto: "Desafío léxico: forma palabras con valores de letras." },
    trivial: { titulo: "Trivial", texto: "Responde preguntas de diversas categorías." }
};

// 2. FUNCIONES DE INTERFAZ (Forzadas a nivel global)
window.cerrarSesion = function() {
    localStorage.removeItem('user');
    window.location.reload();
};

window.abrirAuthModal = function() {
    const modalEl = document.getElementById('authModal');
    if (modalEl) {
        new bootstrap.Modal(modalEl).show();
    }
};

window.verReglas = function(id) {
    const visor = document.getElementById('visor-reglas');
    const cuerpo = document.getElementById('reglasCuerpo');
    const juego = BIBLIOTECA_JUEGOS[id];
    
    if (visor && cuerpo) {
        cuerpo.innerHTML = juego ? `<h5>${juego.titulo}</h5><p>${juego.texto}</p>` : "Reglas no encontradas.";
        visor.classList.remove('d-none');
        visor.scrollIntoView({ behavior: 'smooth' });
    }
};

window.activarAsistente = function(id) {
    const workspace = document.getElementById('workspace-asistente');
    const dashboard = document.getElementById('dashboard-seccion');
    
    if (workspace && dashboard) {
        workspace.innerHTML = `
            <div class="p-4 border border-cyan rounded mt-3">
                <h5>Anotador: ${id.toUpperCase()}</h5>
                <input type="number" id="ptsInput" class="form-control" placeholder="Puntos...">
                <button class="btn btn-success mt-2" onclick="guardarPuntos('${id}')">Registrar</button>
            </div>
        `;
        dashboard.classList.remove('d-none');
    }
};

window.guardarPuntos = function(id) {
    let user = JSON.parse(localStorage.getItem('user'));
    const pts = parseInt(document.getElementById('ptsInput').value) || 0;
    user.stats.puntosTotales += pts;
    localStorage.setItem('user', JSON.stringify(user));
    alert("Puntos sumados.");
    window.location.reload();
};

// 3. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    let user = JSON.parse(localStorage.getItem('user'));
    
    // Si Mariana es el usuario predeterminado, forzamos su estado
    if (!user) {
        user = { nombre: "Mariana Delgado", rango: "Jugador", nivel: 12, stats: { puntosTotales: 872 } };
        localStorage.setItem('user', JSON.stringify(user));
    }
    
    // Actualizar el DOM
    const container = document.getElementById('wrapperPerfilAccion');
    if (container) {
        container.innerHTML = `
            <span class="text-white me-2">${user.nombre} | Niv.${user.nivel}</span>
            <button class="btn btn-sm btn-danger" onclick="cerrarSesion()">Salir</button>
        `;
    }
});