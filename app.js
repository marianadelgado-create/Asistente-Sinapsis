/**
 * SINAPSIS ENGINE CORE - 2026
 * Controlador unificado para interacción One-Page.
 */

// --- PERSISTENCIA LOCAL DE CAMPEONATOS ---
const SistemaCampeonatos = {
    obtenerTodos() {
        return JSON.parse(localStorage.getItem('sinapsis_v2_torneos')) || [];
    },
    guardarTodos(lista) {
        localStorage.setItem('sinapsis_v2_torneos', JSON.stringify(lista));
    }
};

// --- DICCIONARIO LOCAL (SIMULACIÓN REAL PARA TP MULTIMEDIAL) ---
const LEXICO_VALIDO = ["CASA", "MESA", "JUEGO", "SINAPSIS", "RUMMY", "TRUCO", "AJEDREZ", "XILOFON", "ZORRO", "REGLA", "VALOR", "HISTORIA", "DISEÑO"];

// --- ESTADOS VOLÁTILES ---
let torneoSeleccionadoId = null;
let usuarioActivo = "Mariana";

// Variables Reloj Fischer
let intervalReloj = null;
let jugadorActivo = 1; 
let relojP1 = 300;
let relojP2 = 300;

document.addEventListener("DOMContentLoaded", () => {
    actualizarListaModals();
    document.getElementById('lblActiveUser').innerText = usuarioActivo;
});

// --- INTERRUPTOR DE ASISTENTES (INYECCIÓN DE UI AL CANVAS) ---
function cargarHerramienta(tipo, idTorneo = null) {
    const canvas = document.getElementById('canvas-dinamico-juego');
    const titulo = document.getElementById('lblGameTitle');
    const subtitulo = document.getElementById('lblGameSubtitle');

    if (tipo === 'truco') {
        titulo.innerText = "Anotador Táctil: Truco Argentino";
        subtitulo.innerText = "Control rápido de tantos de 0 a 30 puntos.";
        
        let puntos = JSON.parse(localStorage.getItem('quick_truco_v2')) || { nos: 0, ellos: 0 };

        canvas.innerHTML = `
            <div class="row text-center align-items-center g-3 animate-fade-in py-3">
                <div class="col-6 border-end border-secondary">
                    <h5 class="text-muted-custom small tracking-wider">NOSOTROS</h5>
                    <div class="display-2 fw-bold text-white my-2" id="ptsNos">${puntos.nos}</div>
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary rounded-circle" onclick="modificarTruco('nos', -1)">-1</button>
                        <button class="btn btn-sm btn-premium-cyan rounded-circle px-3" onclick="modificarTruco('nos', 1)">+1</button>
                    </div>
                </div>
                <div class="col-6">
                    <h5 class="text-muted-custom small tracking-wider">ELLOS</h5>
                    <div class="display-2 fw-bold text-white my-2" id="ptsEllos">${puntos.ellos}</div>
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary rounded-circle" onclick="modificarTruco('ellos', -1)">-1</button>
                        <button class="btn btn-sm btn-premium-cyan rounded-circle px-3" onclick="modificarTruco('ellos', 1)">+1</button>
                    </div>
                </div>
            </div>
        `;
    } 
    else if (tipo === 'rummy') {
        torneoSeleccionadoId = idTorneo;
        const torneo = SistemaCampeonatos.obtenerTodos().find(t => t.id === idTorneo);
        
        titulo.innerText = `Campeonato: ${torneo.nombre}`;
        subtitulo.innerText = `Torneo oficial iniciado el ${torneo.fecha}`;

        // Renderizar encabezados de los jugadores convocados
        const headers = torneo.jugadores.map(j => `<th class="text-center text-white">${j}</th>`).join('');
        
        // Renderizar las rondas completadas acumuladas
        let filas = torneo.rondas.map((r, index) => {
            const celdas = torneo.jugadores.map(j => `<td class="text-center text-muted-custom font-monospace">${r[j] || 0}</td>`).join('');
            return `<tr><td class="text-center text-cyan small fw-bold">Ronda ${index + 1}</td>${celdas}</tr>`;
        }).join('');

        // Calcular Score Final Acumulado
        const totales = torneo.jugadores.reduce((acc, j) => {
            acc[j] = torneo.rondas.reduce((sum, ronda) => sum + (Number(ronda[j]) || 0), 0);
            return acc;
        }, {});

        const filaTotales = torneo.jugadores.map(j => `<td class="text-center text-gradient-blue fw-bold font-monospace h5">${totales[j]}</td>`).join('');
        
        // Input dinámico para anexar la ronda entrante
        const inputsEntrada = torneo.jugadores.map(j => `
            <td><input type="number" class="form-control form-control-sm text-center input-ronda-puntos" data-player="${j}" placeholder="0" style="background:#050911; border:1px solid #2D3748; color:white;"></td>
        `).join('');

        canvas.innerHTML = `
            <div class="animate-fade-in">
                <div class="table-responsive">
                    <table class="table table-dark table-bordered align-middle table-dark-custom mb-3">
                        <thead>
                            <tr>
                                <th class="text-center" style="width:110px;">Etapa</th>
                                ${headers}
                            </tr>
                        </thead>
                        <tbody>
                            ${filas}
                            <tr class="table-active">
                                <td class="text-center small fw-bold">TOTAL ACUM.</td>
                                ${filaTotales}
                            </tr>
                            <tr style="background-color: rgba(0,242,254,0.02)">
                                <td class="text-center text-coral small fw-bold">Cargar Nueva</td>
                                ${inputsEntrada}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="text-end">
                    <button class="btn btn-sm btn-premium-cyan" onclick="compilarNuevaRondaRummy()">Registrar Puntos de Ronda</button>
                </div>
            </div>
        `;
    }
}

// --- MANEJO DE CAMPEONATOS (RUMMY) ---
function procesarCreacionTorneo(event) {
    event.preventDefault();
    const nombre = document.getElementById('inNombreTorneo').value.trim();
    const jugadoresRaw = document.getElementById('inJugadoresTorneo').value;
    const lista = jugadoresRaw.split(',').map(j => j.trim()).filter(j => j.length > 0);

    if (lista.length < 2) {
        alert("El campeonato requiere un mínimo de 2 competidores en la mesa.");
        return;
    }

    const nuevoTorneo = {
        id: 'torneo_' + Date.now(),
        nombre: nombre,
        fecha: new Date().toLocaleDateString(),
        jugadores: lista,
        rondas: [
            lista.reduce((obj, j) => ({ ...obj, [j]: 0 }), {}) // Ronda inicial en 0
        ]
    };

    const existentes = SistemaCampeonatos.obtenerTodos();
    existentes.push(nuevoTorneo);
    SistemaCampeonatos.guardarTodos(existentes);

    document.getElementById('frmNuevoTorneo').reset();
    
    // Ocultar modal mediante la instancia nativa de Bootstrap
    const mEl = document.getElementById('modalTorneoRummy');
    const instance = bootstrap.Modal.getInstance(mEl);
    if(instance) instance.hide();

    actualizarListaModals();
    cargarHerramienta('rummy', nuevoTorneo.id);
}

function actualizarListaModals() {
    const contenedor = document.getElementById('contenedorListaTorneos');
    const torneos = SistemaCampeonatos.obtenerTodos();

    if(torneos.length === 0) {
        contenedor.innerHTML = `<p class="text-muted-custom small text-center my-2">No registrás campeonatos activos en este navegador.</p>`;
        return;
    }

    contenedor.innerHTML = torneos.map(t => `
        <button class="list-group-item list-group-item-action bg-dark text-white border-secondary d-flex justify-content-between align-items-center" onclick="ejecutarCargaDesdeLista('${t.id}')">
            <div>
                <span class="text-cyan fw-bold d-block">${t.nombre}</span>
                <small class="text-muted-custom">${t.jugadores.length} Integrantes • Registrado el ${t.fecha}</small>
            </div>
            <i class="bi bi-play-circle text-cyan"></i>
        </button>
    `).join('');
}

function ejecutarCargaDesdeLista(id) {
    const mEl = document.getElementById('modalTorneoRummy');
    const instance = bootstrap.Modal.getInstance(mEl);
    if(instance) instance.hide();
    cargarHerramienta('rummy', id);
}

function compilarNuevaRondaRummy() {
    const torneos = SistemaCampeonatos.obtenerTodos();
    const tIdx = torneos.findIndex(t => t.id === torneoSeleccionadoId);
    const inputs = document.querySelectorAll('.input-ronda-puntos');

    let mapeoRonda = {};
    inputs.forEach(inp => {
        const pName = inp.getAttribute('data-player');
        const pValue = Number(inp.value) || 0;
        mapeoRonda[pName] = pValue;
    });

    torneos[tIdx].rondas.push(mapeoRonda);
    SistemaCampeonatos.guardarTodos(torneos);
    cargarHerramienta('rummy', torneoSeleccionadoId);
}

// --- LÓGICA DE TRUCO INDIVIDUAL ---
function modificarTruco(bando, valor) {
    let puntos = JSON.parse(localStorage.getItem('quick_truco_v2')) || { nos: 0, ellos: 0 };
    if (bando === 'nos') puntos.nos = Math.max(0, Math.min(30, puntos.nos + valor));
    else puntos.ellos = Math.max(0, Math.min(30, puntos.ellos + valor));

    localStorage.setItem('quick_truco_v2', JSON.stringify(puntos));
    document.getElementById('ptsNos').innerText = puntos.nos;
    document.getElementById('ptsEllos').innerText = puntos.ellos;
}

// --- REFERATO LÉXICO (SCRABBLE) ---
function ejecutarValidacionDiccionario(event) {
    event.preventDefault();
    const box = document.getElementById('feedbackDiccionario');
    const texto = document.getElementById('txtPalabraScrabble').value.trim().toUpperCase();

    box.style.display = "block";
    box.classList.remove('alert-success', 'alert-danger');

    if (LEXICO_VALIDO.includes(texto)) {
        box.className = "alert alert-success mt-3 py-2 animate-fade-in small";
        box.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i><strong>${texto}</strong> es válida en el referato local oficial.`;
    } else {
        box.className = "alert alert-danger mt-3 py-2 animate-fade-in small";
        box.innerHTML = `<i class="bi bi-exclamation-octagon-fill me-2"></i><strong>${texto}</strong> no se encuentra en el índice local.`;
    }
}

// --- RELOJ FISCHER PROFESIONAL ---
function conmutarTurnoReloj(origen) {
    if (intervalReloj && jugadorActivo !== origen) return;
    
    if (intervalReloj) {
        if (jugadorActivo === 1) relojP1 += 3;
        else relojP2 += 3;
    }

    jugadorActivo = (origen === 1) ? 2 : 1;
    document.getElementById('timerBox1').classList.toggle('active', jugadorActivo === 1);
    document.getElementById('timerBox2').classList.toggle('active', jugadorActivo === 2);
    
    renderizarContadores();

    if(!intervalReloj) {
        intervalReloj = setInterval(() => {
            if (jugadorActivo === 1) {
                relojP1--;
                renderizarContadores();
                analizarAlertaTiempo(1, relojP1);
            } else {
                relojP2--;
                renderizarContadores();
                analizarAlertaTiempo(2, relojP2);
            }
        }, 1000);
    }
}

function analizarAlertaTiempo(p, t) {
    const box = document.getElementById(`timerBox${p}`);
    if (t <= 20) box.classList.add('warning-critical');
    if (t <= 0) {
        pausarContador();
        alert(`¡Tiempo agotado para Jugador ${p}!`);
        reiniciarContador();
    }
}

function renderizarContadores() {
    const format = (t) => {
        const m = String(Math.floor(t / 60)).padStart(2, '0');
        const s = String(t % 60).padStart(2, '0');
        return `${m}:${s}`;
    };
    document.getElementById('valClock1').innerText = format(relojP1);
    document.getElementById('valClock2').innerText = format(relojP2);
}

function pausarContador() { clearInterval(intervalReloj); intervalReloj = null; }
function reiniciarContador() {
    pausarContador();
    relojP1 = 300; relojP2 = 300;
    document.getElementById('timerBox1').classList.remove('warning-critical', 'active');
    document.getElementById('timerBox2').classList.remove('warning-critical', 'active');
    renderizarContadores();
}

function modificarUsuarioActivo(nombre) {
    usuarioActivo = nombre;
    document.getElementById('lblActiveUser').innerText = nombre;
}