/**
 * SINAPSIS ENGINE CORE - 2026 EXTENDED V3.5
 */

// --- BASE DE DATOS DE REGLAMENTOS COMPLETOS ---
const REGLAS_DICCIONARIO = {
    generala: "<h5>Reglas Oficiales: Generala</h5><p>Se juega con 5 dados y un vaso. Cada jugador dispone de hasta 3 tiros por turno. Se pueden apartar dados entre tiros para buscar combinaciones: Escalera (20 pts), Full (30 pts), Póker (40 pts) o Generala (50 pts). Si se logra Generala en el primer tiro del turno, es 'Servida' y se gana el partido.</p>",
    truco: "<h5>Reglas Oficiales: Truco</h5><p>Juego de naipes españoles de 2 a 4 jugadores. Se disputa a 30 puntos (divididos en 15 'malas' y 15 'buenas'). Se compite en tres bazas por el truco, y se suman puntos ocultos por el Envido o Flor durante la primera mano.</p>",
    rummy: "<h5>Reglas Oficiales: Rummy</h5><p>El objetivo es descartar todas las fichas del atril formando series (mismo número, distinto color) o escaleras (mismo color). Para la apertura inicial en la mesa, las combinaciones deben sumar una base mínima obligatoria de **30 puntos**.</p>",
    uno: "<h5>Reglas Oficiales: UNO</h5><p>Cada jugador recibe 7 cartas. Se debe descartar una carta por turno que coincida en color, número o símbolo con la de la mesa. Las cartas especiales agregan robos (+2, +4) o cambios de sentido. Al quedar una sola carta, se debe gritar obligatoriamente 'UNO'.</p>",
    ajedrez: "<h5>Reglas Oficiales: Ajedrez</h5><p>Juego de estrategia pura sobre tablero de 8x8. Cada bando controla 16 piezas con movimientos únicos (Peón, Torre, Caballo, Alfil, Dama y Rey). El objetivo absoluto es acorralar al Rey contrario hasta lograr el Jaque Mate.</p>",
    damas: "<h5>Reglas Oficiales: Damas</h5><p>Se juega sobre las casillas oscuras del tablero. Las fichas avanzan un casillero en diagonal hacia adelante. Si saltan sobre una pieza rival, la capturan. Al llegar a la última fila enemiga, la ficha se corona 'Dama' y obtiene movimientos libres en diagonal.</p>",
    teg: "<h5>Reglas Oficiales: T.E.G.</h5><p>Tradicional juego de Planificación de Estrategia Global. Los jugadores atacan y defienden fronteras territoriales lanzando dados según la cantidad de ejércitos. Se gana al completar el Objetivo Secreto asignado o el Objetivo General (30 países).</p>",
    batalla_naval: "<h5>Reglas Oficiales: Batalla Naval</h5><p>Cada jugador posiciona su flota de barcos en una grilla oculta de 10x10. Por turnos, se cantan coordenadas (Ej: 'F4'). El rival debe responder si el tiro dio en 'Agua', resulta 'Tocado' o si la nave ha sido completamente 'Hundida'.</p>",
    scrabble: "<h5>Reglas Oficiales: Scrabble</h5><p>Cada jugador roba 7 letras de la bolsa. Se deben formar palabras sobre el tablero cruzándose con términos existentes. Cada letra tiene un valor individual y las casillas especiales multiplican los puntos del término o de la letra.</p>",
    tutti_frutti: "<h5>Reglas Oficiales: Tutti Frutti</h5><p>Se sortea una letra de juego. Todos los competidores rellenan categorías (Nombres, Colores, Marcas, Animales) a máxima velocidad. El primero en terminar grita '¡Basta para mí!' deteniendo la ronda. Palabras únicas suman 10 pts, repetidas 5 pts.</p>",
    ahorcado: "<h5>Reglas Oficiales: Ahorcado</h5><p>Un jugador piensa una palabra y dibuja guiones vacíos. El oponente arriesga letras por turno. Si la letra es correcta, se rellena el espacio; si es incorrecta, se dibuja una parte del verdugo. Se pierde al llegar a 6 errores visuales.</p>",
    trivial: "<h5>Reglas Oficiales: Trivial Pursuit</h5><p>Los jugadores avanzan por el tablero respondiendo preguntas divididas en categorías cromáticas (Geografía, Historia, Espectáculos, Ciencia, Arte y Deportes). Se gana al obtener los 6 'quesitos' temáticos correspondientes.</p>",
    pictionary: "<h5>Reglas Oficiales: Pictionary</h5><p>Juego de mesa de dibujo en equipo. Un miembro toma una tarjeta con una palabra secreta y debe dibujarla en un papel o pizarra sin usar letras, números ni gestos. Su equipo debe adivinar el concept antes de que acabe el tiempo del reloj de arena.</p>",
    jinete: "<h5>Lienzo de Desarrollo: El 5to Jinete</h5><p>Estructura de despliegue fígital para lienzos multilaterales de 4 a 8 puestos. El reglamento unifica el avance táctico de flotas mediante lecturas de inducción física de fichas en superficie en paralelo con directivas enviadas desde los mandos de las tabletas sincronizadas por Bluetooth.</p>"
};

// --- DICCIONARIO MATRIZ ABIERTO ---
const DICCIONARIO_MASTER = {
    "MESA": "Mueble compuesto por una tabla horizontal sostenida por patas, usado para disputar partidas.",
    "JUEGO": "Actividad recreativa o de competición de acuerdo a ciertas reglas fijas.",
    "TRUCO": "Juego criollo de cartas altamente competitivo basado en el engaño y picardía.",
    "SCRABBLE": "Competición léxica de tablero donde se construyen palabras cruzadas con valores diferenciados.",
    "PICTIONARY": "Dinámica grupal basada en la decodificación de conceptos abstractos a través de trazos rápidos.",
    "AJEDREZ": "Estrategia milenaria abstracta de confrontación simulada sobre un damero de 64 casilleros.",
    "SINAPSIS": "Estructura de red interactiva e interconexión funcional; núcleo conceptual de este universo.",
    "LIENZO": "Soporte base de juego fígital diseñado con sensores de inducción electrónica para mapeos globales.",
    "HIBRIDO": "Sistema combinado que fusiona elementos físicos analógicos con despliegues de software digital.",
    "BLUETOOTH": "Especificación tecnológica de radiocomunicación de corto alcance para vincular periféricos inalámbricos."
};

// --- ESTADOS CORE ---
let usuarioLogueado = null; 
let authModoActual = 'login';

// Reloj Fischer
let FischerInterval = null;
let activeClock = 1;
let timeP1 = 300;
let timeP2 = 300;

document.addEventListener("DOMContentLoaded", () => {
    verificarSesionExistente();
});

// --- ENGINES DE CONTROL DE ACCESO ---

// Al iniciar o al loguearse, inicializamos los datos si no existen
// --- CONFIGURACIÓN DE PERFIL: MARIANA DELGADO (FASE 1) ---
const usuarioConfig = {
    nombre: "Mariana Delgado",
    rango: "Jugador",
    nivel: 12,
    fechaRegistro: "22/06/2026",
    juegosFavoritos: ["Truco", "Scrabble", "Rummy"],
    stats: {
        partidasJugadas: 124,
        puntosTotales: 872
    }
};
// Solo guardar si no existe, para no borrar tus avances actuales
if (!localStorage.getItem('user')) {
    localStorage.setItem('user', JSON.stringify(usuarioConfig));
}
// 2. FUNCIÓN DE ACTUALIZACIÓN (Pegá esto justo debajo del bloque anterior)
function actualizarStats(gano) {
    let user = JSON.parse(localStorage.getItem('user'));
    
    user.partidasJugadas += 1;
    if (gano) {
        user.victorias += 1;
    }
    
    // Lógica para subir de nivel
    if (user.partidasJugadas >= 10) {
        user.rango = "Exploradora Neural";
    }
    
    localStorage.setItem('user', JSON.stringify(user));
    console.log("Stats actualizadas:", user); // Esto es útil para testear en la consola
}

function abrirAuthModal() {
    // Si ya hay sesión iniciada, abrir el modal no hace falta
    if(usuarioLogueado) return;
    const modal = new bootstrap.Modal(document.getElementById('authModal'));
    modal.show();
}

function cerrarSesion() {
    localStorage.removeItem('sinapsis_sesion_activa');
    usuarioLogueado = null;
    verificarSesionExistente();
}

function cambiarFrenteAuth(modo) {
    authModoActual = modo;
    const title = document.getElementById('authModalTitle');
    const btnSubmit = document.getElementById('btnAuthSubmit');
    const regFields = document.querySelector('.id-registro-only');

    document.getElementById('tabLogin').classList.toggle('active', modo === 'login');
    document.getElementById('tabRegistro').classList.toggle('active', modo === 'registro');

    if (modo === 'login') {
        title.innerText = "UNIRSE A SINAPSIS";
        btnSubmit.innerText = "Entrar a la Mesa";
        regFields.classList.add('d-none');
    } else {
        title.innerText = "CREAR NUEVA CUENTA";
        btnSubmit.innerText = "Completar Registro";
        regFields.classList.remove('d-none');
    }
}

// --- LÍNEA 98 ---
function procesarAutenticacion(event) {
    event.preventDefault();
    const username = document.getElementById('authUsername').value.trim();
    if (!username) return;

    if (authModoActual === 'registro') {
        let usuarios = JSON.parse(localStorage.getItem('sinapsis_usuarios')) || [];
        if (usuarios.includes(username)) {
            alert("Este nombre ya se encuentra registrado.");
            return;
        }
        usuarios.push(username);
        localStorage.setItem('sinapsis_usuarios', JSON.stringify(usuarios));
    }

    localStorage.setItem('sinapsis_sesion_activa', username);
    usuarioLogueado = username;
    
    const mEl = document.getElementById('authModal');
    const instance = bootstrap.Modal.getInstance(mEl);
    if (instance) instance.hide();

    verificarSesionExistente();
}
// --- LÍNEA 116 ---
// --- INICIALIZADOR DE DATOS DE USUARIO ---
if (!localStorage.getItem('user')) {
    const usuarioDefault = {
        nombre: "Mariana Delgado",
        rango: "Jugador",
        nivel: 12,
        stats: { partidasJugadas: 124, puntosTotales: 872 }
    };
    localStorage.setItem('user', JSON.stringify(usuarioDefault));
    console.log("Datos de usuario inicializados.");
}


function cargarHistorialUsuario() {
    const llaveDatos = `sinapsis_libreta_${usuarioLogueado}`;
    let datosUser = JSON.parse(localStorage.getItem(llaveDatos)) || { puntos: 0 };
    document.getElementById('lblRecordPts').innerText = `${datosUser.puntos} Puntos Guardados`;
}

// --- CONTROLES DE ARITMÉTICA DINÁMICA ---
function activarAsistente(juego) {
    if (!usuarioLogueado) {
        abrirAuthModal();
        return;
    }
// --- FUNCIÓN DE VERIFICACIÓN BLINDADA ---
function verificarSesionExistente() {
    const panelBloqueado = document.getElementById('estado-bloqueado');
    const panelDashboard = document.getElementById('dashboard-seccion');
    const containerPerfilNav = document.getElementById('wrapperPerfilAccion');
    const sesion = localStorage.getItem('sinapsis_sesion_activa');
    
    // Obtenemos los datos, si no existen, el inicializador ya los creó
    let user = JSON.parse(localStorage.getItem('user'));

    if (sesion && user) {
        usuarioLogueado = sesion;
        
        if (containerPerfilNav) {
            containerPerfilNav.innerHTML = `
                <div class="d-flex align-items-center gap-3">
                    <div class="perfil-info text-end">
                        <div class="fw-bold text-white">${user.nombre}</div>
                        <small class="text-cyan">${user.rango} | Nivel ${user.nivel}</small>
                    </div>
                    <button class="btn btn-xs btn-outline-danger" onclick="cerrarSesion()">Salir</button>
                </div>
            `;
        }

        if (panelBloqueado) panelBloqueado.classList.add('d-none');
        if (panelDashboard) panelDashboard.classList.remove('d-none');
        
        const elBienvenida = document.getElementById('txtBienvenidaLibreta');
        if (elBienvenida) elBienvenida.innerText = `Libreta Virtual de ${user.nombre}`;
        
        const elStats = document.getElementById('lblRecordPts');
        if (elStats && user.stats) {
            elStats.innerHTML = `
                <div class="d-flex justify-content-center gap-4 text-center">
                    <div><small>Partidas</small><br><strong>${user.stats.partidasJugadas}</strong></div>
                    <div><small>Puntos</small><br><strong>${user.stats.puntosTotales}</strong></div>
                </div>
            `;
        }
    } else {
        if (containerPerfilNav) {
            containerPerfilNav.innerHTML = `<button class="btn-profile-pill" onclick="abrirAuthModal()">Iniciar Sesión</button>`;
        }
        if (panelBloqueado) panelBloqueado.classList.remove('d-none');
        if (panelDashboard) panelDashboard.classList.add('d-none');
    }
}

// --- FUNCIÓN DE CIERRE DEL ASISTENTE ---
function cerrarAsistente() {
    const dashboard = document.getElementById('dashboard-seccion');
    if (dashboard) {
        dashboard.classList.add('d-none');
    }
}
    const workspace = document.getElementById('workspace-asistente');
    window.location.href = "#dashboard-seccion";

    const juegosCampeonato = ['rummy', 'ajedrez', 'teg', 'scrabble', 'trivial'];
    
    if (juego === 'truco') {
        workspace.innerHTML = `
            <div class="row text-center py-4 g-3 align-items-center">
                <div class="col-6 border-end border-secondary border-opacity-25">
                    <span class="badge bg-danger bg-opacity-10 text-coral font-tech mb-2 px-3 py-1">NOSOTROS (ANOTADOR)</span>
                    <div class="display-counter my-2" id="valNos">0</div>
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="sumarPuntosLibreta('nos', -1)">-1</button>
                        <button class="btn btn-sm btn-coral-premium px-4" onclick="sumarPuntosLibreta('nos', 1)">+1 Punto</button>
                    </div>
                </div>
                <div class="col-6">
                    <span class="badge bg-secondary bg-opacity-10 text-muted-custom font-tech mb-2 px-3 py-1">ELLOS (ANOTADOR)</span>
                    <div class="display-counter my-2" id="valEllos">0</div>
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" onclick="sumarPuntosLibreta('ellos', -1)">-1</button>
                        <button class="btn btn-sm btn-outline-premium px-4" onclick="sumarPuntosLibreta('ellos', 1)">+1 Punto</button>
                    </div>
                </div>
            </div>
        `;
    } else if (juegosCampeonato.includes(juego)) {
        workspace.innerHTML = `
            <div class="p-4 text-center max-width-md mx-auto" style="max-width: 450px;">
                <span class="badge badge-tech mb-2 text-uppercase">MODULO: CAMPEONATO GENERAL</span>
                <h5 class="text-white mb-3 font-tech fs-6">Sincronizar puntos de ${juego.toUpperCase()}</h5>
                <div class="input-group">
                    <input type="number" id="ptsNuevosJuego" class="form-control input-dark text-center font-tech" placeholder="Cargar puntos ganados..." min="0">
                    <button class="btn btn-cyan-premium px-4" onclick="guardarRondaGenerica('${juego}')"><i class="bi bi-floppy me-2"></i>Guardar Tabla</button>
                </div>
            </div>
        `;
    } else {
        workspace.innerHTML = `
            <div class="p-4 text-center max-width-md mx-auto" style="max-width: 450px;">
                <span class="badge bg-secondary bg-opacity-10 text-muted-custom font-tech mb-2 px-3 py-1">MODULO: ANOTADOR RÁPIDO</span>
                <h5 class="text-white mb-3 font-tech fs-6">Computar Ronda de ${juego.toUpperCase()}</h5>
                <div class="input-group">
                    <input type="number" id="ptsNuevosJuego" class="form-control input-dark text-center font-tech" placeholder="Puntos logrados" min="0">
                    <button class="btn btn-coral-premium text-white px-4" onclick="guardarRondaGenerica('${juego}')"><i class="bi bi-plus-circle me-2"></i>Anotar Puntos</button>
                </div>
            </div>
        `;
    }
}

function sumarPuntosLibreta(bando, val) {
    const el = bando === 'nos' ? document.getElementById('valNos') : document.getElementById('valEllos');
    let act = Number(el.innerText) + val;
    if (act < 0) act = 0;
    el.innerText = act;

    if(bando === 'nos' && val > 0) {
        const llaveDatos = `sinapsis_libreta_${usuarioLogueado}`;
        let datosUser = JSON.parse(localStorage.getItem(llaveDatos)) || { puntos: 0 };
        datosUser.puntos += val;
        localStorage.setItem(llaveDatos, JSON.stringify(datosUser));
        cargarHistorialUsuario();
    }
}

function guardarRondaGenerica(juego) {
    const input = document.getElementById('ptsNuevosJuego');
    const pts = Math.abs(Number(input.value)) || 0;

    const llaveDatos = `sinapsis_libreta_${usuarioLogueado}`;
    let datosUser = JSON.parse(localStorage.getItem(llaveDatos)) || { puntos: 0 };
    
    datosUser.puntos += pts;
    localStorage.setItem(llaveDatos, JSON.stringify(datosUser));
    
    input.value = "";
    cargarHistorialUsuario();
    alert(`Puntaje de ${juego.toUpperCase()} archivado en la libreta virtual.`);
}

// --- VISOR DE REGLAMENTOS ---
function verReglas(juego) {
    const visor = document.getElementById('visor-reglas');
    const titulo = document.getElementById('reglasTitulo');
    const cuerpo = document.getElementById('reglasCuerpo');

    if (REGLAS_DICCIONARIO[juego]) {
        titulo.innerHTML = `<i class="bi bi-book text-cyan me-2"></i> REGLAMENTO OFICIAL: ${juego.toUpperCase()}`;
        cuerpo.innerHTML = REGLAS_DICCIONARIO[juego];
        visor.classList.remove('d-none');
        visor.scrollIntoView({ behavior: 'smooth' });
    }
}
function cerrarVisorReglas() { document.getElementById('visor-reglas').classList.add('d-none'); }

// --- ENGINE LÉXICO (VALIDADOR MATRIZ) ---
function validarDiccionario(event) {
    event.preventDefault();
    const input = document.getElementById('inputPalabra');
    const palabra = input.value.trim().toUpperCase();
    const box = document.getElementById('alertDiccionario');
    const statusTxt = box.querySelector('.id-status-word');
    const defTxt = box.querySelector('.id-def-word');

    box.style.display = "block";

    if (DICCIONARIO_MASTER[palabra]) {
        statusTxt.innerHTML = `<span class="text-success"><i class="bi bi-check-circle-fill me-2"></i>✓ PALABRA CORRECTA</span>`;
        defTxt.innerHTML = `<strong>${palabra}:</strong> ${DICCIONARIO_MASTER[palabra]}`;
        box.style.background = "rgba(25, 135, 84, 0.05)";
    } else {
        statusTxt.innerHTML = `<span class="text-danger"><i class="bi bi-x-circle-fill me-2"></i>✕ TÉRMINO NO ENCONTRADO</span>`;
        defTxt.innerHTML = `La palabra "<strong>${palabra}</strong>" no consta en el set léxico local de Sinapsis Core. Probá con términos del ecosistema (MESA, LIENZO, JUEGO, HIBRIDO, TABLERO, BLUETOOTH).`;
        box.style.background = "rgba(220, 53, 69, 0.05)";
    }
}

// --- EXTRA ENGINE: LANZADOR DE DADOS ---
function lanzarDadosEngine() {
    const d1 = document.getElementById('uiDado1');
    const d2 = document.getElementById('uiDado2');

    d1.classList.add('dice-rolling');
    d2.classList.add('dice-rolling');

    setTimeout(() => {
        const val1 = Math.floor(Math.random() * 6) + 1;
        const val2 = Math.floor(Math.random() * 6) + 1;

        d1.innerText = val1;
        d2.innerText = val2;

        d1.classList.remove('dice-rolling');
        d2.classList.remove('dice-rolling');
    }, 600);
}

// --- RELOJ FISCHER ---
function invertirReloj(p) {
    if (FischerInterval && activeClock !== p) return;
    if (FischerInterval) {
        if (activeClock === 1) timeP1 += 3; else timeP2 += 3;
    }
    activeClock = p === 1 ? 2 : 1;
    document.getElementById('cBox1').classList.toggle('active', activeClock === 1);
    document.getElementById('cBox2').classList.toggle('active', activeClock === 2);
    
    if(!FischerInterval) {
        FischerInterval = setInterval(() => {
            if(activeClock === 1) { timeP1--; refrescarClocks(); } 
            else { timeP2--; refrescarClocks(); }
        }, 1000);
    }
}
function refrescarClocks() {
    const f = (t) => {
        if(t < 0) return "00:00";
        return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
    };
    document.getElementById('txtC1').innerText = f(timeP1);
    document.getElementById('txtC2').innerText = f(timeP2);
}
function pausarReloj() { clearInterval(FischerInterval); FischerInterval = null; }
function resetReloj() { pausarReloj(); timeP1 = 300; timeP2 = 300; refrescarClocks(); }
// --- FUNCIÓN DE CIERRE DEL ASISTENTE ---
function cerrarAsistente() {
    document.getElementById('dashboard-seccion').classList.add('d-none');
}