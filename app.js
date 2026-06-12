/**
 * SINAPSIS ENGINE CORE - 2026 V3.6 (EDICIÓN VINTAGE MODERNO)
 */

// ... [Mantener diccionarios de REGLAS_DICCIONARIO y DICCIONARIO_MASTER intactos] ...

let usuarioLogueado = null; 
let authModoActual = 'login';
let FischerInterval = null;
let activeClock = 1;
let timeP1 = 300;
let timeP2 = 300;

document.addEventListener("DOMContentLoaded", () => {
    verificarSesionExistente();
});

function abrirAuthModal() {
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
        title.innerText = "INGRESAR A LA RED";
        btnSubmit.innerText = "Entrar a la Mesa";
        regFields.classList.add('d-none');
    } else {
        title.innerText = "CREAR CUENTA";
        btnSubmit.innerText = "Completar Registro";
        regFields.classList.remove('d-none');
    }
}

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

// SINCRONIZACIÓN DE PERFIL ADAPTADA A LA LÍNEA DE DISEÑO MINIMALISTA
function verificarSesionExistente() {
    const panelBloqueado = document.getElementById('estado-bloqueado');
    const panelDashboard = document.getElementById('dashboard-seccion');
    const containerPerfilNav = document.getElementById('wrapperPerfilAccion');
    const sesion = localStorage.getItem('sinapsis_sesion_activa');

    if (sesion) {
        usuarioLogueado = sesion;
        
        // Renderizado adaptado: Eliminamos bordes de neón por líneas sutiles y botones limpios
        containerPerfilNav.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <div class="btn-profile-pill d-flex align-items-center" style="cursor:default; border-color: var(--accent-blue-soft);">
                    <div class="avatar-dot">${sesion.charAt(0).toUpperCase()}</div>
                    <span class="small text-dark fw-semibold">${sesion}</span>
                </div>
                <button class="btn btn-xs btn-outline-danger style-btn-flat" onclick="cerrarSesion()"><i class="bi bi-box-arrow-right"></i> Salir</button>
            </div>
        `;

        panelBloqueado.classList.add('d-none');
        panelDashboard.classList.remove('d-none');
        document.getElementById('txtBienvenidaLibreta').innerText = `Libreta Virtual de ${sesion}`;
        
        cargarHistorialUsuario();
    } else {
        usuarioLogueado = null;
        
        containerPerfilNav.innerHTML = `
            <button class="btn-profile-pill d-flex align-items-center" onclick="abrirAuthModal()">
                <div class="avatar-dot" style="background: var(--text-muted);">?</div>
                <span class="small text-dark fw-semibold">Iniciar Sesión</span>
            </button>
        `;

        panelBloqueado.classList.remove('d-none');
        panelDashboard.classList.add('d-none');
    }
}

function cargarHistorialUsuario() {
    const llaveDatos = `sinapsis_libreta_${usuarioLogueado}`;
    let datosUser = JSON.parse(localStorage.getItem(llaveDatos)) || { puntos: 0 };
    document.getElementById('lblRecordPts').innerText = `${datosUser.puntos} Puntos Archivados`;
}

// ... [El resto de las funciones de dados, reloj e ingreso de puntos se mantienen estables] ...
function activarAsistente(juego) {
    if (!usuarioLogueado) { abrirAuthModal(); return; }
    const workspace = document.getElementById('workspace-asistente');
    window.location.href = "#dashboard-seccion";
    const juegosCampeonato = ['rummy', 'ajedrez', 'teg', 'scrabble', 'trivial'];
    
    if (juego === 'truco') {
        workspace.innerHTML = `
            <div class="row text-center py-4 g-3 align-items-center">
                <div class="col-6 border-end border-secondary border-opacity-25">
                    <span class="badge bg-opacity-10 text-dark font-tech mb-2 px-3 py-1" style="background: rgba(95,111,82,0.1)">NOSOTROS</span>
                    <div class="display-counter my-2" id="valNos">0</div>
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary" onclick="sumarPuntosLibreta('nos', -1)">-1</button>
                        <button class="btn btn-sm btn-coral-premium px-4" onclick="sumarPuntosLibreta('nos', 1)">+1 Punto</button>
                    </div>
                </div>
                <div class="col-6">
                    <span class="badge bg-opacity-10 text-muted-custom font-tech mb-2 px-3 py-1">ELLOS</span>
                    <div class="display-counter my-2" id="valEllos">0</div>
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary" onclick="sumarPuntosLibreta('ellos', -1)">-1</button>
                        <button class="btn btn-sm btn-outline-premium px-4" onclick="sumarPuntosLibreta('ellos', 1)">+1 Punto</button>
                    </div>
                </div>
            </div>`;
    } else {
        const isCamp = juegosCampeonato.includes(juego);
        workspace.innerHTML = `
            <div class="p-4 text-center max-width-md mx-auto" style="max-width: 450px;">
                <h5 class="text-dark mb-3 font-tech fs-6">${isCamp ? 'TABLA DE CAMPEONATO' : 'ANOTADOR RÁPIDO'}: ${juego.toUpperCase()}</h5>
                <div class="input-group">
                    <input type="number" id="ptsNuevosJuego" class="form-control input-dark text-center font-tech" placeholder="Puntos logrados" min="0">
                    <button class="btn ${isCamp ? 'btn-cyan-premium':'btn-coral-premium'} px-4" onclick="guardarRondaGenerica('${juego}')">Guardar</button>
                </div>
            </div>`;
    }
}
function sumarPuntosLibreta(bando, val) {
    const el = bando === 'nos' ? document.getElementById('valNos') : document.getElementById('valEllos');
    let act = Number(el.innerText) + val; if (act < 0) act = 0; el.innerText = act;
    if(bando === 'nos' && val > 0) {
        const llaveDatos = `sinapsis_libreta_${usuarioLogueado}`;
        let datosUser = JSON.parse(localStorage.getItem(llaveDatos)) || { puntos: 0 };
        datosUser.puntos += val; localStorage.setItem(llaveDatos, JSON.stringify(datosUser));
        cargarHistorialUsuario();
    }
}
function guardarRondaGenerica(juego) {
    const input = document.getElementById('ptsNuevosJuego'); const pts = Math.abs(Number(input.value)) || 0;
    const llaveDatos = `sinapsis_libreta_${usuarioLogueado}`;
    let datosUser = JSON.parse(localStorage.getItem(llaveDatos)) || { puntos: 0 };
    datosUser.puntos += pts; localStorage.setItem(llaveDatos, JSON.stringify(datosUser));
    input.value = ""; cargarHistorialUsuario(); alert(`Puntaje de ${juego.toUpperCase()} archivado.`);
}
function verReglas(juego) {
    const visor = document.getElementById('visor-reglas'); const titulo = document.getElementById('reglasTitulo'); const cuerpo = document.getElementById('reglasCuerpo');
    if (REGLAS_DICCIONARIO[juego]) {
        titulo.innerHTML = `<i class="bi bi-book text-muted me-2"></i> REGLAMENTO: ${juego.toUpperCase()}`;
        cuerpo.innerHTML = REGLAS_DICCIONARIO[juego]; visor.classList.remove('d-none'); visor.scrollIntoView({ behavior: 'smooth' });
    }
}
function cerrarVisorReglas() { document.getElementById('visor-reglas').classList.add('d-none'); }
function validarDiccionario(event) {
    event.preventDefault(); const input = document.getElementById('inputPalabra'); const palabra = input.value.trim().toUpperCase();
    const box = document.getElementById('alertDiccionario'); const statusTxt = box.querySelector('.id-status-word'); const defTxt = box.querySelector('.id-def-word');
    box.style.display = "block";
    if (DICCIONARIO_MASTER[palabra]) {
        statusTxt.innerHTML = `<span class="text-success">✓ TÉRMINO VALIDADO</span>`; defTxt.innerHTML = `<strong>${palabra}:</strong> ${DICCIONARIO_MASTER[palabra]}`;
        box.style.background = "rgba(95, 111, 82, 0.05)"; box.style.borderColor = "var(--accent-moss)";
    } else {
        statusTxt.innerHTML = `<span class="text-danger">✕ NO ENCONTRADO</span>`; defTxt.innerHTML = `La palabra "${palabra}" no consta en el set léxico local.`;
        box.style.background = "rgba(43, 37, 32, 0.02)"; box.style.borderColor = "var(--border-organic)";
    }
}
function lanzarDadosEngine() {
    const d1 = document.getElementById('uiDado1'); const d2 = document.getElementById('uiDado2');
    d1.classList.add('dice-rolling'); d2.classList.add('dice-rolling');
    setTimeout(() => {
        d1.innerText = Math.floor(Math.random() * 6) + 1; d2.innerText = Math.floor(Math.random() * 6) + 1;
        d1.classList.remove('dice-rolling'); d2.classList.remove('dice-rolling');
    }, 600);
}
function invertirReloj(p) {
    if (FischerInterval && activeClock !== p) return;
    if (FischerInterval) { if (activeClock === 1) timeP1 += 3; else timeP2 += 3; }
    activeClock = p === 1 ? 2 : 1;
    document.getElementById('cBox1').classList.toggle('active', activeClock === 1);
    document.getElementById('cBox2').classList.toggle('active', activeClock === 2);
    if(!FischerInterval) {
        FischerInterval = setInterval(() => { if(activeClock === 1) { timeP1--; refrescarClocks(); } else { timeP2--; refrescarClocks(); } }, 1000);
    }
}
function refrescarClocks() {
    const f = (t) => { if(t < 0) return "00:00"; return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`; };
    document.getElementById('txtC1').innerText = f(timeP1); document.getElementById('txtC2').innerText = f(timeP2);
}
function pausarReloj() { clearInterval(FischerInterval); FischerInterval = null; }
function resetReloj() { pausarReloj(); timeP1 = 300; timeP2 = 300; refrescarClocks(); }