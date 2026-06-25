window.onload = function() {
    console.log("El script se cargó correctamente");
    
    const contenedor = document.getElementById('wrapperPerfilAccion');
    const nombre = localStorage.getItem('user');
    
    if (!contenedor) {
        console.error("ERROR: No encontré el elemento con id 'wrapperPerfilAccion'. Revisa tu HTML.");
        return;
    }

    if (nombre) {
        console.log("Usuario detectado:", nombre);
        contenedor.innerHTML = `
            <span class="text-white me-2">${nombre}</span>
            <button class="btn btn-sm btn-danger" onclick="cerrarSesion()">Salir</button>
        `;
    } else {
        console.log("No hay usuario. Dibujando botón...");
        contenedor.innerHTML = `
            <button class="btn-profile-pill d-flex align-items-center" onclick="iniciarSesionManual()">
                <div class="avatar-dot">?</div>
                <span class="small text-white">Iniciar Sesión</span>
            </button>
        `;
    }
};