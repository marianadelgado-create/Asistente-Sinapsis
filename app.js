/**
 * SINAPSIS ENGINE CORE - 2026
 * Arquitectura unificada de Autenticación y Libreta Virtual Local
 */

// --- BASE DE DATOS DE REGLAMENTOS ---
const REGLAS_DICCIONARIO = {
    generala: "<h5>Reglas Generala</h5><p>Se tiran 5 dados en un vaso táctil. Disponés de 3 tiros para apartar dados y formar Escalera (20 pts), Full (30 pts), Póker (40 pts) o Generala (50 pts). Si sacás Generala de un tiro ganas de forma Servida.</p>",
    rummy: "<h5>Reglas Rummy</h5><p>Para abrir juego y bajar tus fichas a la mesa por primera vez, tus series de tercetos, cuartetos o escaleras consecutivas deben sumar una base mínima obligatoria de **30 puntos**.</p>",
    truco: "<h5>Reglas Truco</h5><p>Juego de engaño criollo disputado a 30 puntos. Las cartas dominantes son el Ancho de Espada (1) y el Ancho de Bastos (1). El Envido se canta únicamente durante la primera mano.</p>"
};

const DICCIONARIO_VALIDO = ["MESA", "JUEGO", "RUMMY", "TRUCO", "SINAPSIS", "DADOS", "ALMA", "FOCO", "LETRAS"];

// --- PERSISTENCIA DE USUARIOS ---
let usuarioLogueado = null; 
let authModoActual = 'login'; // 'login' o 'registro'

// Variables Reloj Fischer
let FischerInterval = null;
let activeClock = 1;
let timeP1 = 300;
let timeP2 = 300;

document.addEventListener("DOMContentLoaded", () => {
    verificarSesionExistente();
});

// --- SISTEMA DE AUTENTICACIÓN LOCAL ---
function abrirAuthModal() {
    const modal = new bootstrap.Modal(document.getElementById('authModal'));
    modal.show();
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

function procesarAutenticacion(event) {
    event.preventDefault();
    const username = document.getElementById('authUsername').value.trim();

    if (!username) return;

    if (authModoActual === 'registro') {
        // Registrar en la lista global de usuarios ficticios de Sinapsis
        let usuarios = JSON.parse(localStorage.getItem('sinapsis_usuarios')) || [];
        if (usuarios.includes(username)) {
            alert("Este nombre ya se encuentra en la comunidad. Elegí otro.");
            return;
        }
        usuarios.push(username);
        localStorage.setItem('sinapsis_usuarios', JSON.stringify(usuarios));
        alert("¡Registro exitoso! Iniciando tu sesión.");
    } else {
        // Login: Verificamos si existe (o lo creamos de cortesía en el TP)
        let usuarios = JSON.parse(localStorage.getItem('sinapsis_usuarios')) || ["Mariana", "Lucas"];
        if (!usuarios.includes(username)) {
            usuarios.push(username);
            localStorage.setItem('sinapsis_usuarios', JSON.stringify(usuarios));
        }
    }

    // Guardar sesión activa en la memoria del navegador
    localStorage.setItem('sinapsis_sesion_activa', username);
    
    // Cerrar el modal de Bootstrap
    const mEl = document.getElementById('authModal');
    const instance = bootstrap.Modal.getInstance(mEl);
    if (instance) instance.hide();

    verificarSesionExistente();
}

function verificarSesionExistente() {
    const sesion = localStorage.getItem('sinapsis_sesion_activa');
    
    const panelBloqueado = document.getElementById('estado-bloqueado');
    const panelDashboard = document.getElementById('dashboard-seccion');
    const lblUser = document.getElementById('navUserName');
    const avatar = document.getElementById('navAvatar');

    if (sesion) {
        usuarioLogueado = sesion;
        lblUser.innerText = sesion;
        avatar.innerText = sesion.charAt(0).toUpperCase();

        // Cambiar interfaz visible
        panelBloqueado.classList.add('d-none');
        panelDashboard.classList.remove('d-none');
        document.getElementById('txtBienvenidaLibreta').innerText = `Libreta Virtual de ${sesion}`;
        
        cargarHistorialUsuario();
    } else {
        usuarioLogueado = null;
        lblUser.innerText = "Iniciar Sesión";
        avatar.innerText = "?";
        panelBloqueado.classList.remove('d-none');
        panelDashboard.classList.add('d-none');
    }
}

// --- GESTIÓN DE LA LIBRETA VIRTUAL PERSONALIZADA ---
function cargarHistorialUsuario() {
    const llaveDatos = `sinapsis_libreta_${usuarioLogueado}`;
    let datosUser = JSON.parse(localStorage.getItem(llaveDatos)) || { totalRondas: 0, juegoActivo: null, puntos: 0 };
    
    document.getElementById('lblRecordPts').innerText = `${datosUser.puntos} Puntos Acumulados`;
}

// --- ASISTENTES DINÁMICOS DE MESA ---
function activarAsistente(juego) {
    if (!usuarioLogueado) {
        abrirAuthModal();
        return;
    }

    const workspace = document.getElementById('workspace-asistente');
    window.location.href = "#dashboard-seccion";

    if (juego === 'truco') {
        workspace.innerHTML = `
            <div class="row text-center py-3 g-2">
                <div class="col-6 border-end border-secondary">
                    <span class="small text-muted d-block">NOSOTROS</span>
                    <h4 class="display-3 fw-bold text-white my-1" id="valNos">0</h4>
                    <button class="btn btn-xs btn-coral-premium text-white px-3" onclick="sumarPuntosLibreta('nos', 1)">+1 Punto</button>
                </div>
                <div class="col-6">
                    <span class="small text-muted d-block">ELLOS</span>
                    <h4 class="display-3 fw-bold text-white my-1" id="valEllos">0</h4>
                    <button class="btn btn-xs btn-outline-light px-3" onclick="sumarPuntosLibreta('ellos', 1)">+1 Punto</button>
                </div>
            </div>
        `;
    } else if (juego === 'rummy' || juego === 'generala') {
        workspace.innerHTML = `
            <div class="p-3 text-center">
                <h5 class="text-white mb-3 text-uppercase font-tech">Carga rápida a la Libreta de ${usuarioLogueado}</h5>
                <div class="input-group justify-content-center mx-auto" style="max-width:300px;">
                    <input type="number" id="ptsNuevosJuego" class="form-control input-dark text-center" placeholder="Puntos logrados">
                    <button class="btn btn-cyan-premium" onclick="guardarRondaGenerica('${juego}')">Guardar en Libreta</button>
                </div>
            </div>
        `;
    }
}

function sumarPuntosLibreta(bando, val) {
    const el = bando === 'nos' ? document.getElementById('valNos') : document.getElementById('valEllos');
    let act = Number(el.innerText) + val;
    el.innerText = act;

    // Guardar récord acumulado si suma a "nosotros"
    if(bando === 'nos') {
        const llaveDatos = `sinapsis_libreta_${usuarioLogueado}`;
        let datosUser = JSON.parse(localStorage.getItem(llaveDatos)) || { totalRondas: 0, juegoActivo: null, puntos: 0 };
        datosUser.puntos += val;
        localStorage.setItem(llaveDatos, JSON.stringify(datosUser));
        cargarHistorialUsuario();
    }
}

function guardarRondaGenerica(juego) {
    const input = document.getElementById('ptsNuevosJuego');
    const pts = Number(input.value) || 0;

    const llaveDatos = `sinapsis_libreta_${usuarioLogueado}`;
    let datosUser = JSON.parse(localStorage.getItem(llaveDatos)) || { totalRondas: 0, juegoActivo: null, puntos: 0 };
    
    datosUser.puntos += pts;
    localStorage.setItem(llaveDatos, JSON.stringify(datosUser));
    
    alert(`Ronda de ${juego} archivada con éxito en tu libreta virtual.`);
    input.value = "";
    cargarHistorialUsuario();
}

// --- MANEJO DE MANUALES Y REGLAS ---
function verReglas(juego) {
    const visor = document.getElementById('visor-reglas');
    const titulo = document.getElementById('reglasTitulo');
    const cuerpo = document.getElementById('reglasCuerpo');

    if (REGLAS_DICCIONARIO[juego]) {
        titulo.innerText = `Lector Oficial: ${juego.toUpperCase()}`;
        cuerpo.innerHTML = REGLAS_DICCIONARIO[juego];
        visor.classList.remove('d-none');
        visor.scrollIntoView({ behavior: 'smooth' });
    }
}

function cerrarVisorReglas() { document.getElementById('visor-reglas').classList.add('d-none'); }

// --- DICCIONARIO ---
function validarDiccionario(event) {
    event.preventDefault();
    const input = document.getElementById('inputPalabra');
    const p = input.value.trim().toUpperCase();
    const alertBox = document.getElementById('alertDiccionario');

    alertBox.style.display = "block";
    alertBox.classList.remove('alert-success', 'alert-danger');

    if (DICCIONARIO_VALIDO.includes(p)) {
        alertBox.className = "alert alert-success mt-3 text-center small animate-fade-in";
        alertBox.innerHTML = `✓ <strong>${p}</strong> es válida en el léxico oficial local.`;
    } else {
        alertBox.className = "alert alert-danger mt-3 text-center small animate-fade-in";
        alertBox.innerHTML = `✕ <strong>${p}</strong> no existe en este set referil.`;
    }
}

// --- RELOJ PROFESSIONAL ---
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
    const f = (t) => `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
    document.getElementById('txtC1').innerText = f(timeP1);
    document.getElementById('txtC2').innerText = f(timeP2);
}
function pausarReloj() { clearInterval(FischerInterval); FischerInterval = null; }
function resetReloj() { pausarReloj(); timeP1 = 300; timeP2 = 300; refrescarClocks(); }