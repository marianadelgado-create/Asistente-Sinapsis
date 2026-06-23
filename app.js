/**
 * SINAPSIS ENGINE CORE - SOLUCIÓN DE BLOQUEO DE SESIÓN
 */

window.cerrarSesion = function() {
    // 1. Borramos el usuario
    localStorage.removeItem('user');
    
    // 2. Marcamos en el navegador que NO queremos que se autogenere
    localStorage.setItem('sesion_terminada', 'true');
    
    // 3. Recargamos
    window.location.reload();
};

// 3. INICIALIZACIÓN (Modificada para NO autologuear)
document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('wrapperPerfilAccion');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && contenedor) {
        // Caso: Usuario ya logueado
        contenedor.innerHTML = `
            <span class="text-white me-2">${user.nombre} | Niv.${user.nivel}</span>
            <button class="btn btn-sm btn-danger" onclick="cerrarSesion()">Salir</button>
        `;
    } else if (contenedor) {
        // Caso: Usuario NO logueado. 
        // CAMBIO: Ya no creamos el objeto usuario aquí.
        contenedor.innerHTML = `
            <button class="btn btn-sm btn-primary" onclick="iniciarSesionManual()">Entrar</button>
        `;
    }
});

// Función para simular un inicio de sesión real
window.iniciarSesionManual = function() {
    const nombre = prompt("¿Cuál es tu nombre?");
    if (nombre) {
        const nuevoUser = { nombre: nombre, rango: "Jugador", nivel: 1, stats: { puntosTotales: 0 } };
        localStorage.setItem('user', JSON.stringify(nuevoUser));
        localStorage.removeItem('sesion_terminada');
        window.location.reload();
    }
};