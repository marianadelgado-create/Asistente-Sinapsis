/**
 * SINAPSIS - LOGIC & PERSISTENCE CORE
 * Arquitectura modular preparada para repositorio de producción.
 */

// --- ENGINE DE ALMACENAMIENTO DE CAMPEONATOS ---
const CampeonatoStorage = {
    getTorneos() {
        return JSON.parse(localStorage.getItem('sinapsis_campeonatos')) || [];
    },
    saveTorneos(torneos) {
        localStorage.setItem('sinapsis_campeonatos', JSON.stringify(torneos));
    }
};

// --- ESTADOS DE CONTROL DE JUEGO ---
let torneoActivoId = null;
let modoActual = 'individual'; // 'individual' (Truco/Abierto) o 'campeonato' (Rummy)
let jugadorRegistrador = 'Lucas';

// Variables del Reloj
let clockInterval = null;
let activePlayer = 1;
let timePlayer1 = 300;
let timePlayer2 = 300;

// --- DICCIONARIO OFICIAL (ARRAY REAL EN CLIENTE PARA EL TRABAJO PRÁCTICO) ---
// Compilado con términos clave para validación inmediata sin APIs externas lentas
const DICCIONARIO_SOWPODS = [
    "CASA", "MESA", "JUEGO", "SINAPSIS", "ROBOT", "ALMA", "FOCO", "RUMMY", 
    "TRUCO", "AJEDREZ", "FICHA", "NAIPE", "MESA", "VALOR", "HISTORIA", "DISEÑO"
];

document.addEventListener("DOMContentLoaded", () => {
    actualizarListaCampeonatosModal();
    // Cargar perfil por defecto
    document.getElementById('navAvatarName').innerText = jugadorRegistrador;
});

// --- NAVEGACIÓN Y FLUJO DE PANTALLAS (WELCOME STATE INTERACTION) ---
function irAInicio() {
    document.getElementById('pantalla-juego').classList.add('none-display', 'd-none');
    document.getElementById('pantalla-inicio').classList.remove('d-none');
    pausarReloj();
}

function iniciarModo(modo, torneoId = null) {
    modoActual = modo;
    document.getElementById('pantalla-inicio').classList.add('d-none');
    document.getElementById('pantalla-juego').classList.remove('d-none');
    
    const contenedor = document.getElementById('contenedor-dinamico-izq');

    if (modo === 'individual') {
        document.getElementById('txtTipoSesion').innerText = "Herramientas Rápidas";
        document.getElementById('titleNombreSesion').innerText = "Truco Argentino";
        
        // Inyectar UI limpia del Anotador de Truco
        contenedor.innerHTML = `
            <div class="card game-card p-4 text-center animate-fade-in">
                <h4 class="fw-bold mb-4">Anotador Bipartito Táctil</h4>
                <div class="row">
                    <div class="col-6 border-end">
                        <h5 class="text-muted small">NOSOTROS</h5>
                        <div class="display-3 fw-bold my-2" id="valNosotros">0</div>
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-action btn-light border rounded-circle" onclick="sumarTruco('nosotros', -1)">-1</button>
                            <button class="btn btn-action btn-primary-custom text-white rounded-circle" onclick="sumarTruco('nosotros', 1)">+1</button>
                        </div>
                    </div>
                    <div class="col-6">
                        <h5 class="text-muted small">ELLOS</h5>
                        <div class="display-3 fw-bold my-2" id="valEllos">0</div>
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-action btn-light border rounded-circle" onclick="sumarTruco('ellos', -1)">-1</button>
                            <button class="btn btn-action btn-primary-custom text-white rounded-circle" onclick="sumarTruco('ellos', 1)">+1</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // Recuperar si hay historial guardado del truco rápido
        let tr = JSON.parse(localStorage.getItem('quick_truco')) || {n:0, e:0};
        document.getElementById('valNosotros').innerText = tr.n;
        document.getElementById('valEllos').innerText = tr.e;

    } else if (modo === 'campeonato') {
        torneoActivoId = torneoId;
        const torneo = CampeonatoStorage.getTorneos().find(t => t.id === torneoId);
        document.getElementById('txtTipoSesion').innerText = `Campeonato Activo • Creado el ${torneo.fecha}`;
        document.getElementById('titleNombreSesion').innerText = torneo.nombre;
        
        renderizarTablaCampeonato(torneo);
    }
}

// ==========================================
// MÓDULO: GESTIÓN DE CAMPEONATOS (RUMMY)
// ==========================================
function crearCampeonato(event) {
    event.preventDefault();
    const nombre = document.getElementById('campNombre').value.trim();
    const jugadoresRaw = document.getElementById('campJugadores').value;
    
    // Convertir string de jugadores en array limpio
    const listaJugadores = jugadoresRaw.split(',').map(j => j.trim()).filter(j => j.length > 0);
    
    if(listaJugadores.length < 2) {
        alert("Por favor, ingresá al menos dos jugadores para el torneo.");
        return;
    }

    const nuevoTorneo = {
        id: 'torneo_' + Date.now(),
        nombre: nombre,
        fecha: new Date().toLocaleDateString(),
        jugadores: listaJugadores,
        rondas: [
            // Inicializamos la Ronda 1 con 0 puntos para todos
            listaJugadores.reduce((acc, j) => ({ ...acc, [j]: 0 }), {})
        ]
    };

    const torneos = CampeonatoStorage.getTorneos();
    torneos.push(nuevoTorneo);
    CampeonatoStorage.saveTorneos(torneos);

    // Limpiar formulario y cerrar modal de Bootstrap de forma nativa
    document.getElementById('formNuevoCampeonato').reset();
    const modalEl = document.getElementById('modalCampeonato');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if(modalInstance) modalInstance.hide();

    actualizarListaCampeonatosModal();
    iniciarModo('campeonato', nuevoTorneo.id);
}

function actualizarListaCampeonatosModal() {
    const lista = document.getElementById('listaCampeonatos');
    const torneos = CampeonatoStorage.getTorneos();
    
    if(torneos.length === 0) {
        lista.innerHTML = `<p class="text-muted small text-center my-2">No hay campeonatos guardados en este dispositivo.</p>`;
        return;
    }

    lista.innerHTML = torneos.map(t => `
        <button class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onclick="cargarTorneoDesdeModal('${t.id}')">
            <div>
                <strong class="text-accent">${t.nombre}</strong>
                <span class="d-block super-small text-muted">${t.jugadores.length} Competidores • ${t.fecha}</span>
            </div>
            <i class="bi bi-chevron-right text-muted"></i>
        </button>
    `).join('');
}

function cargarTorneoDesdeModal(id) {
    const modalEl = document.getElementById('modalCampeonato');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if(modalInstance) modalInstance.hide();
    iniciarModo('campeonato', id);
}

function renderizarTablaCampeonato(torneo) {
    const contenedor = document.getElementById('contenedor-dinamico-izq');
    
    // Generar cabeceras de tabla para cada jugador
    const ths = torneo.jugadores.map(j => `<th class="text-center">${j}</th>`).join('');
    
    // Procesar las filas de las rondas jugadas
    let filasRondas = torneo.rondas.map((ronda, index) => {
        const celdas = torneo.jugadores.map(j => `<td class="text-center font-monospace">${ronda[j] || 0}</td>`).join('');
        return `<tr><td class="fw-bold text-muted small text-center">Ronda ${index + 1}</td>${celdas}</tr>`;
    }).join('');

    // Calcular Totales Acumulados
    const totales = torneo.jugadores.reduce((acc, j) => {
        acc[j] = torneo.rondas.reduce((suma, ronda) => suma + (Number(ronda[j]) || 0), 0);
        return acc;
    }, {});

    const filaTotales = torneo.jugadores.map(j => `<td class="text-center fw-bold text-accent font-monospace h5">${totales[j]}</td>`).join('');

    // Input dinámico de carga para la siguiente ronda de Rummy
    const inputsCarga = torneo.jugadores.map(j => `
        <td>
            <input type="number" class="form-control form-control-sm text-center input-score-ronda" data-player="${j}" placeholder="Pts" style="min-width:70px;">
        </td>
    `).join('');

    contenedor.innerHTML = `
        <div class="card game-card p-3 animate-fade-in">
            <h4 class="h5 fw-bold mb-3"><i class="bi bi-table text-earth me-2"></i>Planilla de Posiciones</h4>
            <div class="table-responsive">
                <table class="table table-bordered table-hover align-middle table-rummy mb-3">
                    <thead>
                        <tr>
                            <th style="width: 100px;" class="text-center">Etapa</th>
                            ${ths}
                        </tr>
                    </thead>
                    <tbody>
                        ${filasRondas}
                        <tr class="table-active border-top-2">
                            <td class="fw-bold text-center small">TOTAL</td>
                            ${filaTotales}
                        </tr>
                        <tr class="bg-soft-earth">
                            <td class="fw-bold text-center text-earth small">Nueva Ronda</td>
                            ${inputsCarga}
                        </tr>
                    </tbody>
                </table>
            </div>
            <button class="btn btn-earth-custom text-white btn-sm ms-auto" onclick="guardarRondaCampeonato()">
                <i class="bi bi-floppy-fill me-1"></i> Cerrar Ronda de Puntos
            </button>
        </div>
    `;
}

function guardarRondaCampeonato() {
    const torneos = CampeonatoStorage.getTorneos();
    const torneo = torneos.find(t => t.id === torneoActivoId);
    const inputs = document.querySelectorAll('.input-score-ronda');
    
    let nuevaRonda = {};
    inputs.forEach(input => {
        const jugador = input.getAttribute('data-player');
        const puntos = Number(input.value) || 0;
        nuevaRonda[jugador] = puntos;
    });

    torneo.rondas.push(nuevaRonda);
    CampeonatoStorage.saveTorneos(torneos);
    
    // Volver a renderizar la planilla actualizada
    renderizarTablaCampeonato(torneo);
}

// ==========================================
// MÓDULO: VALIDACIÓN LÉXICA REAL (SCRABBLE)
// ==========================================
function validarPalabraReal(event) {
    event.preventDefault();
    const input = document.getElementById('inputPalabra');
    const palabra = input.value.trim().toUpperCase();
    const box = document.getElementById('scrabbleAlert');
    
    box.style.display = "block";
    box.classList.remove('alert-success', 'alert-danger');

    // Validación algorítmica sobre la estructura de datos local
    if(DICCIONARIO_SOWPODS.includes(palabra)) {
        box.className = "alert alert-success py-2 text-center small animate-fade-in";
        box.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> Éxito: <strong>${palabra}</strong> es una palabra aprobada por el réferi.`;
    } else {
        box.className = "alert alert-danger py-2 text-center small animate-fade-in";
        box.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i> Error: <strong>${palabra}</strong> no existe en el léxico oficial local.`;
    }
}

// ==========================================
// MÓDULO: CONTROL DE TRUCO INDIVIDUAL RÁPIDO
// ==========================================
function sumarTruco(equipo, valor) {
    let tr = JSON.parse(localStorage.getItem('quick_truco')) || {n:0, e:0};
    if (equipo === 'nosotros') tr.n = Math.max(0, Math.min(30, tr.n + valor));
    else tr.e = Math.max(0, Math.min(30, tr.e + valor));
    
    localStorage.setItem('quick_truco', JSON.stringify(tr));
    document.getElementById('valNosotros').innerText = tr.n;
    document.getElementById('valEllos').innerText = tr.e;
}

// ==========================================
// MÓDULO: RELOJ FISCHER (MANTENIDO Y REFINADO)
// ==========================================
function cambiarTurnoReloj(player) {
    if (clockInterval && activePlayer !== player) return;
    if (clockInterval) {
        if (activePlayer === 1) timePlayer1 += 3;
        else timePlayer2 += 3;
    }
    activePlayer = player === 1 ? 2 : 1;
    document.getElementById('btnTimer1').classList.toggle('active', activePlayer === 1);
    document.getElementById('btnTimer2').classList.toggle('active', activePlayer === 2);
    renderClock(1); renderClock(2);
    if (!clockInterval) clockInterval = setInterval(() => {
        if (activePlayer === 1) { timePlayer1--; renderClock(1); checkTime(1, timePlayer1); }
        else { timePlayer2--; renderClock(2); checkTime(2, timePlayer2); }
    }, 1000);
}
function checkTime(p, t) {
    const btn = document.getElementById(`btnTimer${p}`);
    if (t <= 30) btn.classList.add('warning-active');
    if (t <= 0) { pausarReloj(); alert(`Tiempo cumplido para jugador ${p}`); reiniciarReloj(); }
}
function renderClock(p) {
    const t = p === 1 ? timePlayer1 : timePlayer2;
    const m = String(Math.floor(t / 60)).padStart(2, '0');
    const s = String(t % 60).padStart(2, '0');
    document.getElementById(`clock${p}`).innerText = `${m}:${s}`;
}
function pausarReloj() { clearInterval(clockInterval); clockInterval = null; }
function reiniciarReloj() { pausarReloj(); timePlayer1 = 300; timePlayer2 = 300; renderClock(1); renderClock(2); }
function seleccionarUsuario(n) { jugadorRegistrador = n; document.getElementById('navAvatarName').innerText = n; document.getElementById('navAvatarInitials').innerText = n.charAt(0); }