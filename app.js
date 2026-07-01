// --- FUNCIONES GLOBALES ---

// Variables globales para el juego
let juegoActual = '';
let puntos = 0;
let jugadores = [];
let tiempoActivo = false;
let partidaActual = null;
let equiposActuales = [];

// NUEVA ESTRUCTURA DE DATOS: PARTIDA
class Partida {
    constructor(nombre, jugadores, modo, tipo = 'campeonato') {
        this.id = Date.now();
        this.nombreJuego = nombre;
        this.jugadores = jugadores;
        this.modo = modo; // 'individual' o 'equipos'
        this.tipo = tipo; // 'rapida' o 'campeonato'
        this.puntuaciones = {};
        this.fechaInicio = new Date();
        this.estado = 'activa';
        
        jugadores.forEach(j => {
            this.puntuaciones[j.nombre] = 0;
        });
    }
    
    agregarPunto(jugador, cantidad = 1) {
        if (this.puntuaciones[jugador] !== undefined) {
            this.puntuaciones[jugador] += cantidad;
        }
    }
    
    guardar() {
        let historial = JSON.parse(localStorage.getItem('historialesPartidas') || '[]');
        historial.push(this);
        localStorage.setItem('historialesPartidas', JSON.stringify(historial));
    }
}

// Gestión de sesión
window.gestionarSesion = function() {
    const accion = confirm('¿Deseas cerrar sesión?');
    if (accion) {
        localStorage.clear();
        location.reload();
    }
};

// ========== MODAL DE SELECCIÓN: PARTIDA RÁPIDA O CAMPEONATO ==========
window.abrirModalSeleccion = function(nombreJuego) {
    juegoActual = nombreJuego;
    
    const modal = document.getElementById('modalSeleccion');
    const titulo = document.getElementById('modalSeleccionTitulo');
    
    if (modal && titulo) {
        titulo.innerText = `${nombreJuego.toUpperCase()} - ¿Cómo querés jugar?`;
        modal.classList.remove('d-none');
        modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

window.cerrarModalSeleccion = function() {
    const modal = document.getElementById('modalSeleccion');
    if (modal) modal.classList.add('d-none');
};

window.seleccionarModo = function(modo) {
    cerrarModalSeleccion();
    
    if (modo === 'rapida') {
        // Modo partida rápida: sin guardar
        abrirAnotadorRapido(juegoActual);
    } else if (modo === 'campeonato') {
        // Modo campeonato: abre modal para configurar
        abrirModalCampeonato(juegoActual);
    }
};

// ========== MODAL DE CONFIGURACIÓN DE CAMPEONATO ==========
window.abrirModalCampeonato = function(nombreJuego) {
    juegoActual = nombreJuego;
    
    const modal = document.getElementById('modalCampeonato');
    const titulo = document.getElementById('campeonatoTitulo');
    
    if (modal && titulo) {
        titulo.innerText = `Configurar ${nombreJuego.toUpperCase()}`;
        modal.classList.remove('d-none');
        modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

window.cerrarModalCampeonato = function() {
    const modal = document.getElementById('modalCampeonato');
    if (modal) modal.classList.add('d-none');
};

// Cambiar modo (individual o equipos)
window.cambiarModoCampeonato = function(modo) {
    const btnIndividual = document.getElementById('btnModoIndividual');
    const btnEquipos = document.getElementById('btnModoEquipos');
    const formIndividual = document.getElementById('formIndividual');
    const formEquipos = document.getElementById('formEquipos');
    
    if (modo === 'individual') {
        btnIndividual.classList.add('active');
        btnEquipos.classList.remove('active');
        formIndividual.classList.remove('d-none');
        formEquipos.classList.add('d-none');
    } else {
        btnEquipos.classList.add('active');
        btnIndividual.classList.remove('active');
        formEquipos.classList.remove('d-none');
        formIndividual.classList.add('d-none');
    }
};

// Agregar campo de jugador
window.agregarCampoJugador = function() {
    const contenedor = document.getElementById('listaJugadores');
    const cantidad = contenedor.querySelectorAll('input').length + 1;
    
    const campo = document.createElement('div');
    campo.className = 'input-group mb-2';
    campo.innerHTML = `
        <input type="text" class="form-control input-dark" placeholder="Jugador ${cantidad}" value="Jugador ${cantidad}">
        <button class="btn btn-outline-danger" onclick="this.parentElement.remove()">✕</button>
    `;
    contenedor.appendChild(campo);
};

// Agregar campo de equipo
window.agregarCampoEquipo = function() {
    const contenedor = document.getElementById('listaEquipos');
    const cantidad = contenedor.querySelectorAll('input').length + 1;
    
    const campo = document.createElement('div');
    campo.className = 'input-group mb-2';
    campo.innerHTML = `
        <input type="text" class="form-control input-dark" placeholder="Equipo ${cantidad}" value="Equipo ${cantidad}">
        <button class="btn btn-outline-danger" onclick="this.parentElement.remove()">✕</button>
    `;
    contenedor.appendChild(campo);
};

// Iniciar partida desde modal
window.iniciarPartidaCampeonato = function() {
    const modoActive = document.getElementById('btnModoIndividual').classList.contains('active') ? 'individual' : 'equipos';
    let nombres = [];
    
    if (modoActive === 'individual') {
        const inputs = document.getElementById('listaJugadores').querySelectorAll('input');
        nombres = Array.from(inputs).map(i => ({ nombre: i.value || 'Sin nombre', tipo: 'jugador' }));
    } else {
        const inputs = document.getElementById('listaEquipos').querySelectorAll('input');
        nombres = Array.from(inputs).map(i => ({ nombre: i.value || 'Sin nombre', tipo: 'equipo' }));
    }
    
    if (nombres.length === 0) {
        alert('Debes agregar al menos un jugador o equipo');
        return;
    }
    
    // Crear partida (tipo campeonato)
    partidaActual = new Partida(juegoActual, nombres, modoActive, 'campeonato');
    equiposActuales = nombres;
    
    // Cerrar modal
    cerrarModalCampeonato();
    
    // Abrir anotador según juego
    abrirAnotador(juegoActual, 'campeonato');
};

// ========== MODO PARTIDA RÁPIDA ==========
window.abrirAnotadorRapido = function(juego) {
    const contenedor = document.getElementById('contenedor-anotador');
    const titulo = document.getElementById('anotadorTitulo');
    const tablaJugadores = document.getElementById('tablaJugadores');
    
    if (!contenedor || !tablaJugadores) return;
    
    // Título
    titulo.innerText = `Partida Rápida: ${juego.toUpperCase()}`;
    
    // Para partida rápida, solo mostrar panel simple
    let html = `
        <div class="alert alert-info">
            <i class="bi bi-lightning-charge-fill me-2"></i>
            <strong>Modo Rápido:</strong> Esta partida NO será guardada en tu historial
        </div>
        <div class="text-center">
            <div class="p-3 bg-dark rounded border border-cyan">
                <h3 class="text-cyan mb-3">Panel de Puntos</h3>
                <div class="d-flex justify-content-center align-items-center gap-3">
                    <button class="btn btn-lg btn-outline-danger" onclick="restarPunto()">-</button>
                    <span id="display-puntos-rapido" class="display-4 text-cyan">0</span>
                    <button class="btn btn-lg btn-outline-success" onclick="sumarPunto()">+</button>
                </div>
            </div>
        </div>
        <div class="mt-3">
            <button class="btn btn-outline-light w-100" onclick="cerrarAnotador()">Volver</button>
        </div>
    `;
    
    tablaJugadores.innerHTML = html;
    contenedor.classList.remove('d-none');
    contenedor.scrollIntoView({ behavior: 'smooth' });
};

// ========== SISTEMAS DE ANOTACIÓN POR JUEGO ==========
const sistemasAnotacion = {
    'Truco': {
        tipo: 'tantos',
        descripcion: 'Registra malas y buenas',
        campos: ['Malas', 'Buenas']
    },
    'Rummy': {
        tipo: 'puntos',
        descripcion: 'Suma de puntos acumulados',
        campos: ['Puntos']
    },
    'Ajedrez': {
        tipo: 'resultados',
        descripcion: 'Registra: Gana, Empata, Pierde',
        campos: ['Victorias', 'Empates', 'Derrotas']
    },
    'Generala': {
        tipo: 'tabla',
        descripcion: 'Tabla de combinaciones',
        campos: ['Total']
    },
    'Damas': {
        tipo: 'resultados',
        descripcion: 'Registra resultados de partidas',
        campos: ['Gana', 'Pierde']
    },
    'T.E.G.': {
        tipo: 'puntos',
        descripcion: 'Puntos de conquista',
        campos: ['Puntos']
    }
};

window.abrirAnotador = function(juego, tipoPartida = 'campeonato') {
    const contenedor = document.getElementById('contenedor-anotador');
    const titulo = document.getElementById('anotadorTitulo');
    const tablaJugadores = document.getElementById('tablaJugadores');
    const config = sistemasAnotacion[juego] || { tipo: 'puntos', descripcion: 'Sistema genérico', campos: ['Puntos'] };
    
    if (!contenedor || !tablaJugadores) return;
    
    // Título
    titulo.innerText = `Anotador: ${juego.toUpperCase()} (${tipoPartida === 'campeonato' ? 'Campeonato' : 'Rápido'})`;
    
    // Construir tabla dinámicamente
    let html = `
        <div class="table-responsive">
            <table class="table table-dark table-hover">
                <thead>
                    <tr>
                        <th class="text-cyan">Jugador/Equipo</th>
                        ${config.campos.map(f => `<th class="text-cyan">${f}</th>`).join('')}
                        <th class="text-cyan">Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    equiposActuales.forEach(eq => {
        html += `
            <tr>
                <td class="text-white fw-bold">${eq.nombre}</td>
                ${config.campos.map(f => `<td><span class="pts-${eq.nombre.replace(/ /g, '_')}" data-campo="${f}">0</span></td>`).join('')}
                <td>
                    <button class="btn btn-sm btn-outline-success" onclick="sumarPuntoAnotador('${eq.nombre}', 1)">+1</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="restarPuntoAnotador('${eq.nombre}', 1)">-1</button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        <div class="mt-3">
            ${tipoPartida === 'campeonato' ? `<button class="btn btn-cyan-premium" onclick="guardarPartida()">Finalizar Partida</button>` : ''}
            <button class="btn btn-outline-light ms-2" onclick="cerrarAnotador()">Volver</button>
        </div>
    `;
    
    tablaJugadores.innerHTML = html;
    contenedor.classList.remove('d-none');
    contenedor.scrollIntoView({ behavior: 'smooth' });
};

window.sumarPuntoAnotador = function(nombre, cantidad = 1) {
    if (partidaActual) {
        partidaActual.agregarPunto(nombre, cantidad);
        actualizarVistaAnotador();
    }
};

window.restarPuntoAnotador = function(nombre, cantidad = 1) {
    if (partidaActual) {
        const nuevoValor = (partidaActual.puntuaciones[nombre] || 0) - cantidad;
        partidaActual.puntuaciones[nombre] = Math.max(0, nuevoValor);
        actualizarVistaAnotador();
    }
};

window.actualizarVistaAnotador = function() {
    if (!partidaActual) return;
    
    Object.keys(partidaActual.puntuaciones).forEach(nombre => {
        const selector = `.pts-${nombre.replace(/ /g, '_')}`;
        const elementos = document.querySelectorAll(selector);
        elementos.forEach(el => {
            el.innerText = partidaActual.puntuaciones[nombre];
        });
    });
};

window.guardarPartida = function() {
    if (partidaActual) {
        partidaActual.guardar();
        alert('¡Partida guardada exitosamente!');
        cerrarAnotador();
        location.reload();
    }
};

window.cerrarAnotador = function() {
    const contenedor = document.getElementById('contenedor-anotador');
    if (contenedor) contenedor.classList.add('d-none');
    partidaActual = null;
};

// Iniciar una mesa de juego (versión clásica)
window.iniciarMesa = function(nombreJuego, listaJugadores = []) {
    juegoActual = nombreJuego;
    puntos = 0;
    jugadores = listaJugadores.length > 0 ? listaJugadores : [];
    
    const panel = document.getElementById('panel-maestro');
    const titulo = document.getElementById('panel-titulo');
    const display = document.getElementById('display-puntos');
    
    if (panel && titulo && display) {
        panel.classList.remove('d-none');
        titulo.innerText = `Mesa: ${nombreJuego.toUpperCase()}`;
        display.innerText = '0';
        panel.scrollIntoView({ behavior: 'smooth' });
    }
    
    console.log(`Mesa iniciada: ${nombreJuego}`);
};

// Controles de puntos
window.sumarPunto = function() {
    puntos++;
    const display = document.getElementById('display-puntos');
    const displayRapido = document.getElementById('display-puntos-rapido');
    if (display) display.innerText = puntos;
    if (displayRapido) displayRapido.innerText = puntos;
};

window.restarPunto = function() {
    if (puntos > 0) {
        puntos--;
        const display = document.getElementById('display-puntos');
        const displayRapido = document.getElementById('display-puntos-rapido');
        if (display) display.innerText = puntos;
        if (displayRapido) displayRapido.innerText = puntos;
    }
};

window.cambiarPuntos = function(cantidad) {
    puntos += cantidad;
    if (puntos < 0) puntos = 0;
    const display = document.getElementById('display-puntos');
    if (display) display.innerText = puntos;
};

// Ver reglas del juego
window.verReglas = function(juego) {
    const reglas = {
        'rummy': 'RUMMY: Combina piernas y escaleras numéricas. Descargá tus fichas antes que tus oponentes.',
        'truco': 'TRUCO: Estrategia y mentiras. Administrá los tantos de las malas y las buenas.',
        'uno': 'UNO: Deshacete de tus cartas haciendo coincidir colores o números. ¡No olvides gritar UNO!',
        'ajedrez': 'AJEDREZ: El juego de reyes. Desplegá tus aperturas tácticas.',
        'damas': 'DAMAS: Capturá todas las piezas saltando en diagonal. Coroná tus fichas.',
        'teg': 'T.E.G.: Estrategia global. Conquistá continentes y defendé fronteras.',
        'generala': 'GENERALA: Competencia de dados. Consigue Full, Póker o Generala.',
        'batalla_naval': 'BATALLA NAVAL: Localizá la flota enemiga antes de que derriben tus naves.',
        'scrabble': 'SCRABBLE: Cruzá letras y armá términos de alto valor.',
        'tutti_frutti': 'TUTTI FRUTTI: Completá casilleros con la letra del turno a máxima velocidad.',
        'ahorcado': 'AHORCADO: Adiviná la palabra letra por letra antes de 6 errores.',
        'trivial': 'TRIVIAL: Respondé preguntas sobre Arte, Ciencia, Historia y Espectáculos.',
        'pictionary': 'PICTIONARY: Dibujá conceptos para que tu equipo adivine.'
    };
    
    const textoRegla = reglas[juego] || 'Reglas no disponibles para este juego.';
    
    const visor = document.getElementById('visor-reglas');
    const titulo = document.getElementById('reglasTitulo');
    const cuerpo = document.getElementById('reglasCuerpo');
    
    if (visor && titulo && cuerpo) {
        visor.classList.remove('d-none');
        titulo.innerText = `Reglamento: ${juego.toUpperCase()}`;
        cuerpo.innerHTML = `<p>${textoRegla}</p>`;
        visor.scrollIntoView({ behavior: 'smooth' });
    }
};

// Cerrar visor de reglas
window.cerrarVisorReglas = function() {
    const visor = document.getElementById('visor-reglas');
    if (visor) visor.classList.add('d-none');
};

// Validar palabra en diccionario
window.validarDiccionario = function() {
    const input = document.getElementById('inputPalabra');
    if (input && input.value) {
        alert(`Palabra "${input.value}" validada ✓`);
        input.value = '';
    } else {
        alert('Escribe una palabra para validar');
    }
};

// Reloj Fischer
let tiempoRestante = 300; // 5 minutos en segundos
window.iniciarReloj = function() {
    if (tiempoActivo) return;
    
    tiempoActivo = true;
    const reloj = document.getElementById('txtC1');
    
    const intervalo = setInterval(() => {
        if (tiempoRestante > 0) {
            tiempoRestante--;
            const minutos = Math.floor(tiempoRestante / 60);
            const segundos = tiempoRestante % 60;
            const formato = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
            if (reloj) reloj.innerText = formato;
        } else {
            clearInterval(intervalo);
            tiempoActivo = false;
            alert('¡Tiempo agotado!');
            tiempoRestante = 300;
            if (reloj) reloj.innerText = '05:00';
        }
    }, 1000);
};

// Lanzar dados
window.lanzarDadosEngine = function() {
    const dado1 = Math.floor(Math.random() * 6) + 1;
    const dado2 = Math.floor(Math.random() * 6) + 1;
    const total = dado1 + dado2;
    
    const displayDado = document.getElementById('display-dado');
    if (displayDado) {
        displayDado.innerHTML = `<strong>${dado1}</strong> + <strong>${dado2}</strong> = <strong>${total}</strong>`;
    }
    
    console.log(`Dados: ${dado1} + ${dado2} = ${total}`);
};

// Activar asistente para un juego
window.activarAsistente = function(juego) {
    const contenedor = document.getElementById('contenedor-asistente');
    const contenido = document.getElementById('contenido-asistente');
    
    if (contenedor && contenido) {
        contenedor.style.display = 'block';
        contenido.innerHTML = `
            <h3 class="text-cyan mb-3">Asistente: ${juego.toUpperCase()}</h3>
            <p>Panel de control para ${juego}. Aquí podrás registrar puntos, jugadores y más.</p>
            <div class="mt-3">
                <input type="text" class="form-control input-dark mb-2" placeholder="Nombre del jugador...">
                <button class="btn btn-cyan-premium w-100" onclick="alert('Jugador agregado')">Agregar Jugador</button>
            </div>
        `;
    }
};

// Abrir librería virtual
window.abrirLibreta = function() {
    const seccion = document.getElementById('seccion-libreta');
    if (seccion) {
        seccion.classList.remove('d-none');
        seccion.scrollIntoView({ behavior: 'smooth' });
    }
};

// ========== DROPDOWN DEL PERFIL: MIS JUEGOS ==========
window.abrirMisJuegos = function(event) {
    event.preventDefault();
    
    const modal = document.getElementById('modalMisJuegos');
    const contenido = document.getElementById('contenidoMisJuegos');
    
    if (!modal || !contenido) return;
    
    const historial = JSON.parse(localStorage.getItem('historialesPartidas') || '[]');
    
    if (historial.length === 0) {
        contenido.innerHTML = `<p class="text-muted">Aún no has jugado ninguna partida guardada.</p>`;
    } else {
        let html = `<div class="table-responsive"><table class="table table-dark table-sm">
            <thead><tr><th>Juego</th><th>Fecha</th><th>Modo</th><th>Ganador</th></tr></thead><tbody>`;
        
        historial.forEach(partida => {
            const fecha = new Date(partida.fechaInicio).toLocaleDateString('es-AR');
            const ganador = Object.keys(partida.puntuaciones).reduce((a, b) => 
                partida.puntuaciones[a] > partida.puntuaciones[b] ? a : b
            );
            html += `<tr>
                <td>${partida.nombreJuego}</td>
                <td>${fecha}</td>
                <td>${partida.modo === 'individual' ? 'Individual' : 'Equipos'}</td>
                <td><strong>${ganador}</strong></td>
            </tr>`;
        });
        
        html += `</tbody></table></div>`;
        contenido.innerHTML = html;
    }
    
    modal.classList.remove('d-none');
};

// ========== DROPDOWN DEL PERFIL: MIS PUNTOS ==========
window.abrirMisPuntos = function(event) {
    event.preventDefault();
    
    const modal = document.getElementById('modalMisPuntos');
    const contenido = document.getElementById('contenidoMisPuntos');
    
    if (!modal || !contenido) return;
    
    const historial = JSON.parse(localStorage.getItem('historialesPartidas') || '[]');
    
    // Agrupar puntuaciones por juego
    const estadisticas = {};
    
    historial.forEach(partida => {
        if (!estadisticas[partida.nombreJuego]) {
            estadisticas[partida.nombreJuego] = {
                totalPartidas: 0,
                puntosPromedio: 0,
                maxPuntos: 0,
                totalPuntos: 0
            };
        }
        
        const stats = estadisticas[partida.nombreJuego];
        stats.totalPartidas++;
        
        const puntosPorPartida = Object.values(partida.puntuaciones);
        const promedio = puntosPorPartida.reduce((a, b) => a + b, 0) / puntosPorPartida.length;
        const max = Math.max(...puntosPorPartida);
        
        stats.puntosPromedio += promedio;
        stats.totalPuntos += max;
        if (max > stats.maxPuntos) stats.maxPuntos = max;
    });
    
    // Calcular promedios
    Object.keys(estadisticas).forEach(juego => {
        estadisticas[juego].puntosPromedio = (estadisticas[juego].puntosPromedio / estadisticas[juego].totalPartidas).toFixed(2);
    });
    
    if (Object.keys(estadisticas).length === 0) {
        contenido.innerHTML = `<p class="text-muted">Aún no tienes estadísticas registradas.</p>`;
    } else {
        let html = `<div class="table-responsive"><table class="table table-dark table-sm">
            <thead><tr><th>Juego</th><th>Partidas</th><th>Pts. Promedio</th><th>Max Pts</th></tr></thead><tbody>`;
        
        Object.entries(estadisticas).forEach(([juego, stats]) => {
            html += `<tr>
                <td>${juego}</td>
                <td>${stats.totalPartidas}</td>
                <td>${stats.puntosPromedio}</td>
                <td><strong>${stats.maxPuntos}</strong></td>
            </tr>`;
        });
        
        html += `</tbody></table></div>`;
        contenido.innerHTML = html;
    }
    
    modal.classList.remove('d-none');
};

// ========== DROPDOWN DEL PERFIL: CAMPEONATOS ==========
window.abrirCampeonatos = function(event) {
    event.preventDefault();
    
    const modal = document.getElementById('modalCampeonatosGestion');
    const contenido = document.getElementById('contenidoCampeonatos');
    
    if (!modal || !contenido) return;
    
    const historial = JSON.parse(localStorage.getItem('historialesPartidas') || '[]');
    const campeonatos = historial.filter(p => p.tipo === 'campeonato');
    
    if (campeonatos.length === 0) {
        contenido.innerHTML = `<p class="text-muted">No tienes campeonatos registrados aún.</p>`;
    } else {
        let html = `<div class="row g-3">`;
        
        campeonatos.forEach(campeonato => {
            const fecha = new Date(campeonato.fechaInicio).toLocaleDateString('es-AR');
            const ganador = Object.keys(campeonato.puntuaciones).reduce((a, b) => 
                campeonato.puntuaciones[a] > campeonato.puntuaciones[b] ? a : b
            );
            
            html += `<div class="col-md-6">
                <div class="card bg-dark border-cyan">
                    <div class="card-body">
                        <h5 class="card-title text-cyan">${campeonato.nombreJuego}</h5>
                        <p class="small text-muted mb-2">Fecha: ${fecha}</p>
                        <p class="small mb-2"><strong>Ganador:</strong> ${ganador}</p>
                        <p class="small mb-3"><strong>Modo:</strong> ${campeonato.modo === 'individual' ? 'Individual' : 'Equipos'}</p>
                        <button class="btn btn-sm btn-outline-cyan" onclick="alert('Detalle del campeonato: ' + JSON.stringify(campeonato.puntuaciones))">Ver Detalles</button>
                    </div>
                </div>
            </div>`;
        });
        
        html += `</div>`;
        contenido.innerHTML = html;
    }
    
    modal.classList.remove('d-none');
};

// Autenticación - Modal
window.abrirAuthModal = function() {
    const modal = new bootstrap.Modal(document.getElementById('authModal'));
    modal.show();
};

window.cambiarFrenteAuth = function(tipo) {
    const tabLogin = document.getElementById('tabLogin');
    const tabRegistro = document.getElementById('tabRegistro');
    const reglasoloRegistro = document.querySelectorAll('.id-registro-only');
    const btnSubmit = document.getElementById('btnAuthSubmit');
    const titulo = document.getElementById('authModalTitle');
    
    if (tipo === 'login') {
        tabLogin.classList.add('active');
        tabRegistro.classList.remove('active');
        reglasoloRegistro.forEach(el => el.classList.add('d-none'));
        btnSubmit.innerText = 'Entrar a la Mesa';
        titulo.innerText = 'UNIRSE A SINAPSIS';
    } else {
        tabRegistro.classList.add('active');
        tabLogin.classList.remove('active');
        reglasoloRegistro.forEach(el => el.classList.remove('d-none'));
        btnSubmit.innerText = 'Crear Cuenta';
        titulo.innerText = 'REGISTRO';
    }
};

window.procesarAutenticacion = function(event) {
    event.preventDefault();
    
    const username = document.getElementById('authUsername').value;
    const email = document.getElementById('authEmail').value;
    
    if (username) {
        localStorage.setItem('usuarioSinapsis', username);
        if (email) localStorage.setItem('emailSinapsis', email);
        
        actualizarUI(username);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
        if (modal) modal.hide();
        
        alert(`¡Bienvenido ${username}! Tu sesión ha sido iniciada.`);
        location.reload();
    }
    
    return false;
};

// Actualizar UI tras login
function actualizarUI(nombre) {
    const textoLogin = document.getElementById('texto-login');
    const avatar = document.getElementById('avatar-icon');
    const bloqueado = document.getElementById('estado-bloqueado');
    const dashboard = document.getElementById('dashboard-seccion');
    const bienvenida = document.getElementById('txtBienvenidaLibreta');
    const headerUsuario = document.getElementById('header-usuario');
    
    if (textoLogin) textoLogin.innerText = nombre;
    if (avatar) avatar.innerText = nombre.charAt(0).toUpperCase();
    if (bloqueado) bloqueado.classList.add('d-none');
    if (dashboard) dashboard.classList.remove('d-none');
    if (bienvenida) bienvenida.innerText = `Bienvenido, ${nombre}`;
    if (headerUsuario) headerUsuario.innerText = nombre;
}

// --- INICIALIZACIÓN ---
window.addEventListener('load', function() {
    console.log('Sistema Sinapsis cargado correctamente');
    
    const nombreGuardado = localStorage.getItem('usuarioSinapsis');
    
    if (nombreGuardado) {
        actualizarUI(nombreGuardado);
    } else {
        // Mostrar modal de bienvenida si no hay usuario
        const modalAuth = document.getElementById('authModal');
        if (modalAuth) {
            const modal = new bootstrap.Modal(modalAuth);
            modal.show();
        }
    }
});
