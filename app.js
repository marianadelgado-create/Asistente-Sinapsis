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
    const visor = document.getElementById('visor-reglas');
    if(visor) {
        visor.classList.remove('d-none');
        visor.scrollIntoView({ behavior: 'smooth' });
    } else {
        alert("Reglas de " + juego + ": (Contenido pendiente)");
    }
};

window.activarAsistente = function(juego) {
    const panel = document.getElementById('panel-maestro');
    if(panel) {
        panel.classList.remove('d-none');
        panel.scrollIntoView({ behavior: 'smooth' });
    }
};

window.onload = function() {
    const nombre = localStorage.getItem('user');
    const contenedor = document.getElementById('wrapperPerfilAccion');
    const dashboard = document.getElementById('dashboard-seccion');
    const bienvenida = document.getElementById('txtBienvenidaLibreta');
    
    if (contenedor) {
        if (nombre) {
            // CASO: Usuario logueado
            contenedor.innerHTML = `
                <span class="text-white me-2">${nombre}</span>
                <button class="btn btn-sm btn-danger" onclick="cerrarSesion()">Salir</button>
            `;
            if (dashboard) dashboard.classList.remove('d-none');
            if (bienvenida) bienvenida.innerText = "Bienvenido, " + nombre;
        } else {
            // CASO: Usuario NO logueado (AQUÍ ESTABA EL PROBLEMA)
            contenedor.innerHTML = `
                <button class="btn-profile-pill d-flex align-items-center" onclick="iniciarSesionManual()">
                    <div class="avatar-dot">?</div>
                    <span class="small text-white">Iniciar Sesión</span>
                </button>
            `;
        }
    }
};