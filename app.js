// 1. Funciones de Sesión
window.iniciarSesionManual = function() {
    const nombre = prompt("Ingresa tu nombre:");
    if (nombre) {
        localStorage.setItem('user', nombre);
        location.reload(); // Recarga para aplicar los cambios
    }
};

window.cerrarSesion = function() {
    localStorage.clear();
    location.reload();
};

// 2. Control de Interfaz (Se ejecuta al cargar la página)
window.onload = function() {
    const nombre = localStorage.getItem('user');
    const textoLogin = document.getElementById('texto-login');
    const btnLogin = document.getElementById('btn-login');
    const dashboard = document.getElementById('dashboard-seccion');
    const bienvenida = document.getElementById('txtBienvenidaLibreta');

    if (nombre) {
        // --- SI HAY USUARIO ---
        // Cambiamos el texto del botón
        if (textoLogin) textoLogin.innerText = nombre;
        // Cambiamos la función del botón a "Cerrar Sesión"
        if (btnLogin) btnLogin.onclick = window.cerrarSesion;
        
        // Mostramos la Libreta Virtual (quitamos el d-none)
        if (dashboard) dashboard.classList.remove('d-none');
        if (bienvenida) bienvenida.innerText = "Bienvenido, " + nombre;
    }
};