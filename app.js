/**
 * SINAPSIS - LÓGICA DE CONTROL E INTERACCIÓN HÍBRIDA
 * Proyecto Integrador - Tercer Año ISEC
 */

// --- INSTANCIA CENTRAL DE ALMACENAMIENTO (LOCALSTORAGE) ---
const SinapsisStorage = {
    KEYS: {
        TRUCO_ACTUAL: 'sinapsis_truco_actual',
        JUGADOR_ACTIVO: 'sinapsis_jugador_activo'
    },
    guardarTruco(data) {
        localStorage.setItem(this.KEYS.TRUCO_ACTUAL, JSON.stringify(data));
    },
    obtenerTruco() {
        const data = localStorage.getItem(this.KEYS.TRUCO_ACTUAL);
        return data ? JSON.parse(data) : null;
    },
    guardarUsuario(nombre) {
        localStorage.setItem(this.KEYS.JUGADOR_ACTIVO, nombre);
    },
    obtenerUsuario() {
        return localStorage.getItem(this.KEYS.JUGADOR_ACTIVO) || 'Lucas';
    }
};

// --- VARIABLES DE ESTADO GLOBAL DE LA SESIÓN ---
let estadoTruco = { nosotros: 0, ellos: 0 };
let jugadorActivo = 'Lucas';

// Variables Reloj Ajedrez (Fischer algorithm)
let clockInterval = null;
let activePlayer = 1; // 1 = Blancas, 2 = Negras
let timePlayer1 = 300; // 5 minutos en segundos
let timePlayer2 = 300;
const INCREMENTO_FISCHER = 3; 

// --- INICIALIZADOR AL CARGAR EL DOM ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Hidratar Usuario Activo
    jugadorActivo = SinapsisStorage.obtenerUsuario();
    actualizarInterfazUsuario();

    // 2. Hidratar Partida de Truco desde LocalStorage
    const partidaGuardada = SinapsisStorage.obtenerTruco();
    if (partidaGuardada) {
        estadoTruco = partidaGuardada;
        document.getElementById('trucoStatus').innerHTML = `<span class="text-success"><i class="bi bi-cloud-check-fill"></i> Partida reanudada desde LocalStorage</span>`;
    }
    actualizarInterfazTruco();
    
    // Inicializar visualizadores de relojes
    renderClock(1);
    renderClock(2);
});

// ==========================================
// MÓDULO: GESTIÓN DE SESIÓN Y USUARIOS (MODAL)
// ==========================================
function seleccionarUsuario(nombre) {
    jugadorActivo = nombre;
    SinapsisStorage.guardarUsuario(nombre);
    actualizarInterfazUsuario();
    
    // Manejo de clase activa visual en el modal
    document.querySelectorAll('.btn-user-select').forEach(btn => {
        btn.classList.remove('active');
        if(btn.querySelector('span').innerText === nombre) {
            btn.classList.add('active');
        }
    });
}

function agregarInvitado(event) {
    event.preventDefault();
    const input = document.getElementById('guestNameInput');
    const nombre = input.value.trim();
    if(nombre.length > 0) {
        // Crear dinámicamente un nodo botón en la rejilla de selección
        const grid = document.getElementById('userSelectionGrid');
        const nuevoBoton = document.createElement('button');
        nuevoBoton.className = "btn btn-user-select flex-fill text-center p-3";
        nuevoBoton.setAttribute('onclick', `seleccionarUsuario('${nombre}')`);
        nuevoBoton.innerHTML = `
            <div class="avatar-circle mx-auto mb-2 bg-secondary text-white">${nombre.charAt(0).toUpperCase()}</div>
            <span class="d-block small fw-bold">${nombre}</span>
            <span class="badge bg-soft-secondary text-muted super-small">Invitado</span>
        `;
        grid.appendChild(nuevoBoton);
        
        // Auto-seleccionar el invitado creado
        seleccionarUsuario(nombre);
        input.value = '';
    }
}

function actualizarInterfazUsuario() {
    document.getElementById('navAvatarName').innerText = jugadorActivo;
    document.getElementById('navAvatarInitials').innerText = jugadorActivo.charAt(0).toUpperCase();
}

// ==========================================
// MÓDULO: ASISTENTE DE TRUCO ARGENTINO
// ==========================================
function modificarTruco(equipo, valor) {
    if (equipo === 'nosotros') {
        estadoTruco.nosotros = Math.max(0, Math.min(30, estadoTruco.nosotros + valor));
    } else {
        estadoTruco.ellos = Math.max(0, Math.min(30, estadoTruco.ellos + valor));
    }
    
    // Guardar inmediatamente en LocalStorage tras la interacción táctil en la mesa
    SinapsisStorage.guardarTruco(estadoTruco);
    document.getElementById('trucoStatus').innerHTML = `<i class="bi bi-hdd-fill text-muted"></i> Modificado por ${jugadorActivo} - Guardado local activo`;
    
    actualizarInterfazTruco();

    // Comprobación de fin de juego
    if(estadoTruco.nosotros === 30 || estadoTruco.ellos === 30) {
        alert(`¡Partida finalizada! Ganador: ${estadoTruco.nosotros === 30 ? 'NOSOTROS' : 'ELLOS'}`);
        estadoTruco = { nosotros: 0, ellos: 0 };
        SinapsisStorage.guardarTruco(estadoTruco);
        actualizarInterfazTruco();
        document.getElementById('trucoStatus').innerText = "Nueva partida iniciada automáticamente";
    }
}

function actualizarInterfazTruco() {
    document.getElementById('scoreNosotros').innerText = estadoTruco.nosotros;
    document.getElementById('scoreEllos').innerText = estadoTruco.ellos;
}

// ==========================================
// MÓDULO: RELOJ DE AJEDREZ (FISCHER TRANSITION)
// ==========================================
function cambiarTurnoReloj(playerPulsado) {
    if (clockInterval && activePlayer !== playerPulsado) return; // Evitar disparos erróneos

    // Aplicar Fórmula Fischer si el juego ya estaba corriendo: Tn+1 = Tn - dt + I
    if (clockInterval) {
        if (activePlayer === 1) {
            timePlayer1 += INCREMENTO_FISCHER;
            renderClock(1);
        } else {
            timePlayer2 += INCREMENTO_FISCHER;
            renderClock(2);
        }
    }

    // Invertir el turno del jugador activo
    activePlayer = playerPulsado === 1 ? 2 : 1;
    
    // Ajuste visual de foco de los botones
    document.getElementById('btnTimer1').classList.toggle('active', activePlayer === 1);
    document.getElementById('btnTimer2').classList.toggle('active', activePlayer === 2);

    // Iniciar el intervalo si no estaba corriendo
    if (!clockInterval) {
        clockInterval = setInterval(ejecutarTicTac, 1000);
    }
}

function ejecutarTicTac() {
    if (activePlayer === 1) {
        timePlayer1--;
        renderClock(1);
        evaluarTiempoCritico(1, timePlayer1);
    } else {
        timePlayer2--;
        renderClock(2);
        evaluarTiempoCritico(2, timePlayer2);
    }
}

function evaluarTiempoCritico(player, tiempoRestante) {
    const btn = document.getElementById(`btnTimer${player}`);
    if (tiempoRestante <= 30 && tiempoRestante > 0) {
        btn.classList.add('warning-active');
    }
    if (tiempoRestante <= 0) {
        pausarReloj();
        btn.classList.remove('warning-active');
        alert(`¡Tiempo agotado! El Jugador ${player === 1 ? 'Blancas' : 'Negras'} ha perdido por tiempo.`);
        reiniciarReloj();
    }
}

function renderClock(player) {
    const tiempo = player === 1 ? timePlayer1 : timePlayer2;
    const min = String(Math.floor(tiempo / 60)).padStart(2, '0');
    const seg = String(tiempo % 60).padStart(2, '0');
    document.getElementById(`clock${player}`).innerText = `${min}:${seg}`;
}

function pausarReloj() {
    clearInterval(clockInterval);
    clockInterval = null;
}

function reiniciarReloj() {
    pausarReloj();
    activePlayer = 1;
    timePlayer1 = 300;
    timePlayer2 = 300;
    document.getElementById('btnTimer1').className = "btn btn-timer w-100 mb-3 active";
    document.getElementById('btnTimer2').className = "btn btn-timer w-100";
    renderClock(1);
    renderClock(2);
}

// ==========================================
// MÓDULO: VALIDACIÓN LÉXICA (SCRABBLE LOCAL)
// ==========================================
function validarPalabra(event) {
    event.preventDefault();
    const input = document.getElementById('inputPalabra');
    const palabra = input.value.trim().toUpperCase();
    const alertBox = document.getElementById('scrabbleAlert');
    
    // Simulación de Diccionario SOWPODS Local rápido
    const diccionarioFicticioLocal = ["CASA", "MESA", "JUEGO", "SINAPSIS", "ROBOT", "ALMA", "FOCO"];
    
    alertBox.style.display = "block";
    alertBox.classList.remove('alert-success', 'alert-danger');

    // Soporte ergonómico para comodines '?'
    if (palabra.includes('?')) {
        alertBox.className = "alert alert-info py-2 px-3 mb-0 text-center small";
        alertBox.innerHTML = `<i class="bi bi-info-circle-fill"></i> Comodín detectado. Buscando combinaciones viables en cliente...`;
        return;
    }

    if (diccionarioFicticioLocal.includes(palabra)) {
        alertBox.classList.add('alert-success');
        alertBox.innerHTML = `<i class="bi bi-check-circle-fill"></i> <strong>${palabra}</strong> es válida.`;
    } else {
        alertBox.classList.add('alert-danger');
        alertBox.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> <strong>${palabra}</strong> no figura en el diccionario local.`;
    }
    input.value = '';
}