// --- FUNCIONES GLOBALES ---
window.iniciarSesionManual = function() {
    const nombre = prompt("Ingresa tu nombre:");
    if (nombre) {
        localStorage.setItem('user', nombre);
        location.reload();
    }
};

window.cerrarSesion = function() {
    localStorage.clear();
    location.reload();
};

window.verReglas = function(juego) {
    alert("Abriendo reglas de: " + juego);
};

window.activarAsistente = function(juego) {
    alert("Abriendo libreta para: " + juego);
};

// --- INICIALIZACIÓN ---
window.onload = function() {
    console.log("Sistema Sinapsis cargado");
    const nombre = localStorage.getItem('user');
    const textoLogin = document.getElementById('texto-login');
    const btnLogin = document.getElementById('btn-login');
    const dashboard = document.getElementById('dashboard-seccion');
    const bienvenida = document.getElementById('txtBienvenidaLibreta');

    if (nombre) {
        if (textoLogin) textoLogin.innerText = nombre;
        if (btnLogin) btnLogin.onclick = window.cerrarSesion;
        if (dashboard) dashboard.classList.remove('d-none');
        if (bienvenida) bienvenida.innerText = "Bienvenido, " + nombre;
    }
};