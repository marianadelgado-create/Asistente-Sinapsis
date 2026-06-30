// --- FUNCIONES GLOBALES ---

// Variables globales para el juego
let juegoActual = '';
let puntos = 0;
let jugadores = [];
let tiempoActivo = false;

// Gestión de sesión
window.gestionarSesion = function() {
    const accion = confirm('¿Deseas cerrar sesión?');
    if (accion) {
        localStorage.clear();
        location.reload();
    }
};

// Iniciar una mesa de juego
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
    if (display) display.innerText = puntos;
};

window.restarPunto = function() {
    if (puntos > 0) {
        puntos--;
        const display = document.getElementById('display-puntos');
        if (display) display.innerText = puntos;
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
