/**
 * SINAPSIS ENGINE CORE - RECONEXIÓN GLOBAL DEFINITIVA
 */

// 1. FUNCIONES GLOBALES (Para que los botones siempre las encuentren)
window.verReglas = function(juego) {
    alert("¡Conexión exitosa! Abriendo reglas de: " + juego);
    // Aquí iremos expandiendo a medida que verifiques que el botón funciona
};

window.activarAsistente = function(juego) {
    alert("¡Conexión exitosa! Abriendo libreta para: " + juego);
};

window.iniciarSesionManual = function() {
    const nombre = prompt("Ingresa tu nombre:");
    if (nombre) {
        localStorage.setItem('user', JSON.stringify({ nombre: nombre, nivel: 1 }));
        window.location.reload();
    }
};

window.cerrarSesion = function() {
    localStorage.clear();
    window.location.reload();
};

// 2. INICIALIZACIÓN DE INTERFAZ
document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('wrapperPerfilAccion');
    // Buscamos tanto 'user' (que pusimos en el nuevo script) 
    // como 'userSinapsis' (que quedó de las pruebas anteriores)
    const userGuardado = localStorage.getItem('user') || localStorage.getItem('userSinapsis');
    
    console.log("Elemento contenedor encontrado:", contenedor);
    console.log("Usuario detectado:", userGuardado);

    if (contenedor) {
        if (userGuardado) {
            // Si es un objeto JSON, lo parseamos, si es solo el nombre, lo usamos directo
            let nombre = userGuardado;
            try { nombre = JSON.parse(userGuardado).nombre; } catch(e) {}
            
            contenedor.innerHTML = `
                <span class="text-white me-2">${nombre}</span>
                <button class="btn btn-sm btn-danger" onclick="cerrarSesion()">Salir</button>
            `;
        } else {
            contenedor.innerHTML = `
                <button class="btn btn-sm btn-primary" onclick="iniciarSesionManual()">Entrar</button>
            `;
        }
    }
});