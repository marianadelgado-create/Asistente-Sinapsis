// ==========================================================================
// MOTOR LOGICO DE SINAPSIS - BITÁCORA INTERACTIVA GENERACIONAL
// ==========================================================================

function guardarEnBitacora(event) {
    event.preventDefault();
    
    // Captura de datos del ecosistema de entrada
    const juego = document.getElementById('bitacora-juego').value;
    const jugadores = document.getElementById('bitacora-jugadores').value.trim();
    const resultado = document.getElementById('bitacora-resultado').value.trim();
    const trackedAnecdota = document.getElementById('bitacora-anecdota').value.trim();
    
    // Formateo de fecha localizada en Argentina
    const fecha = new Date().toLocaleDateString('es-AR', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });

    const nuevaEntrada = { 
        juego, 
        jugadores, 
        resultado, 
        anecdota: trackedAnecdota, 
        fecha 
    };

    // Almacenamiento local persistente
    let historial = JSON.parse(localStorage.getItem('sinapsis_bitacora_generacional')) || [];
    historial.unshift(nuevaEntrada); // Inserción superior para mantener la última partida visible
    
    localStorage.setItem('sinapsis_bitacora_generacional', JSON.stringify(historial));
    
    // Reset del formulario e inyección visual inmediata
    document.getElementById('form-bitacora').reset();
    renderizarBitacora();
}

function renderizarBitacora() {
    const contenedor = document.getElementById('contenedor-memorias');
    const contador = document.getElementById('lblRecordPts');
    const historial = JSON.parse(localStorage.getItem('sinapsis_bitacora_generacional')) || [];

    if (historial.length === 0) {
        contador.innerText = "0 Encuentros Archivados";
        contenedor.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-journal-richtext d-block mb-2" style="font-size: 32px; color: var(--accent-mist);"></i>
                <span class="small" style="font-family: var(--font-clean); font-weight: 300;">La bitácora está esperando su primera crónica.</span>
            </div>
        `;
        return;
    }

    // Actualización del label indicador de partidas guardadas
    contador.innerText = `${historial.length} ${historial.length === 1 ? 'Encuentro Archivado' : 'Encuentros Archivados'}`;
    contenedor.innerHTML = '';

    // Renderizado del pergamino de historias con animación fluida por retraso
    historial.forEach((item, index) => {
        const tarjetaMemoria = document.createElement('div');
        tarjetaMemoria.className = 'mb-3 p-4';
        
        tarjetaMemoria.style.cssText = `
            background: var(--surface-pure);
            border-radius: 12px;
            border: 1px solid rgba(26, 36, 45, 0.06);
            box-shadow: 0 4px 20px rgba(26, 36, 45, 0.01);
            animation: effectFocusReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            animation-delay: ${index * 0.04}s;
            opacity: 0;
        `;

        tarjetaMemoria.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <span class="font-editorial me-2" style="font-family: var(--font-editorial); font-size: 20px; font-style: italic; color: var(--accent-mist); font-weight: 600;">${item.juego}</span>
                    <span class="badge" style="background: rgba(26, 36, 45, 0.04); color: var(--ink-deep); font-size: 11px; font-family: var(--font-clean); font-weight: 600;">${item.fecha}</span>
                </div>
                <button class="btn btn-link p-0 text-danger opacity-50" style="font-size: 13px; text-decoration: none;" onclick="eliminarEntradaBitacora(${index})">Eliminar</button>
            </div>
            <div class="mb-2" style="font-size: 12.5px; font-weight: 600; color: var(--accent-sage); text-transform: uppercase; letter-spacing: 0.02em;">
                <i class="bi bi-people-fill me-1"></i> ${item.jugadores} 
                <span class="mx-2" style="color: rgba(26, 36, 45, 0.15);">|</span> 
                <i class="bi bi-trophy-fill me-1"></i> ${item.resultado}
            </div>
            <p class="mb-0 text-muted-custom" style="font-size: 14.5px; font-style: italic; font-weight: 400; line-height: 1.5;">
                "${item.anecdota}"
            </p>
        `;
        contenedor.appendChild(tarjetaMemoria);
    });
}

function eliminarEntradaBitacora(index) {
    let historial = JSON.parse(localStorage.getItem('sinapsis_bitacora_generacional')) || [];
    historial.splice(index, 1);
    localStorage.setItem('sinapsis_bitacora_generacional', JSON.stringify(historial));
    renderizarBitacora();
}

// Inicialización de la persistencia de datos al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    renderizarBitacora();
});