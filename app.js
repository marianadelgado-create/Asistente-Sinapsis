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

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('wrapperPerfilAccion');
    const sesionTerminada = localStorage.getItem('sesion_terminada');
    let user = JSON.parse(localStorage.getItem('user'));

    // Si NO hay sesión terminada y NO hay usuario, creamos uno (esto es lo que te molestaba)
    if (!user && !sesionTerminada) {
        user = { nombre: "Mariana Delgado", rango: "Jugador", nivel: 12, stats: { puntosTotales: 872 } };
        localStorage.setItem('user', JSON.stringify(user));
    }

    // Mostrar UI solo si hay usuario
    if (user && contenedor) {
        contenedor.innerHTML = `
            <span class="text-white me-2">${user.nombre} | Niv.${user.nivel}</span>
            <button class="btn btn-sm btn-danger" onclick="cerrarSesion()">Salir</button>
        `;
    } else if (contenedor) {
        // Si no hay usuario, mostramos un botón de acceso
        contenedor.innerHTML = `<button class="btn btn-sm btn-primary" onclick="location.reload()">Entrar</button>`;
        // Limpiamos la bandera para que la próxima vez sí pueda entrar
        localStorage.removeItem('sesion_terminada');
    }
});