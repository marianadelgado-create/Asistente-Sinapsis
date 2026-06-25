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
    
    // Búsqueda inteligente: mira si existe 'user' o 'userSinapsis'
    const rawUser = localStorage.getItem('user') || localStorage.getItem('userSinapsis');
    
    console.log("Elemento contenedor encontrado:", contenedor);
    console.log("Usuario detectado en localStorage:", rawUser);

    if (contenedor) {
        if (rawUser) {
            // Intentamos obtener el nombre
            let nombreUsuario = "";
            try {
                // Si es un JSON, lo parseamos
                const data = JSON.parse(rawUser);
                nombreUsuario = data.nombre || data;
            } catch (e) {
                // Si es solo texto plano, lo usamos tal cual
                nombreUsuario = rawUser;
            }

            contenedor.innerHTML = `
                <span class="text-white me-2">${nombreUsuario}</span>
                <button class="btn btn-sm btn-danger" onclick="cerrarSesion()">Salir</button>
            `;
        } else {
            // Si sigue siendo null, mostramos el botón de entrar
            contenedor.innerHTML = `
                <button class="btn btn-sm btn-primary" onclick="iniciarSesionManual()">Entrar</button>
            `;
        }
    }
});