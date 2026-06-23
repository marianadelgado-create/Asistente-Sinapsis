// Borrado total de datos de sesión
window.cerrarSesion = function() {
    localStorage.removeItem('user');
    window.location.href = window.location.pathname; // Recarga limpia
};

// Asegurar que el usuario no se autogenera si borraste la sesión
document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('user');
    const container = document.getElementById('wrapperPerfilAccion');
    
    if (user && container) {
        const userData = JSON.parse(user);
        container.innerHTML = `
            <span class="text-white me-2">${userData.nombre} | Niv.${userData.nivel}</span>
            <button class="btn btn-sm btn-danger" onclick="cerrarSesion()">Salir</button>
        `;
    } else if (container) {
        container.innerHTML = `<button class="btn btn-sm btn-primary" onclick="window.location.reload()">Ingresar</button>`;
    }
});