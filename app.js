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
    
    // Si hay usuario, activamos todo
    if (nombre) {
        // 1. Mostrar nombre en el navbar
        if (contenedor) {
            contenedor.innerHTML = `
                <span class="text-white me-2">${nombre}</span>
                <button class="btn btn-sm btn-danger" onclick="cerrarSesion()">Salir</button>
            `;
        }
        // 2. Mostrar la sección dashboard
        if (dashboard) {
            dashboard.classList.remove('d-none');
        }
        // 3. Poner nombre en el título de la libreta
        if (bienvenida) {
            bienvenida.innerText = "Bienvenido, " + nombre;
        }
    }
};