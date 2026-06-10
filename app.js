document.addEventListener('DOMContentLoaded', () => {
    
    // 1. INTERACTIVIDAD DE LA CENTRAL DE HERRAMIENTAS (CONTADOR)
    let lanzamientos = 0;
    const btnContador = document.getElementById('btn-contador');
    const txtContador = document.getElementById('txt-contador');

    if (btnContador && txtContador) {
        btnContador.addEventListener('click', () => {
            lanzamientos++;
            if (lanzamientos > 3) lanzamientos = 1; // Reseteo de tiros reglamentarios de dados
            txtContador.innerText = `Lanzamiento: ${lanzamientos} / 3`;
        });
    }

    // 2. VALIDACIÓN DE FORMULARIOS BOOTSTRAP Y CONTROL DE ENVÍO
    const formulario = document.getElementById('form-registro');
    const alertaExito = document.getElementById('registro-alerta');

    if (formulario) {
        formulario.addEventListener('submit', function (event) {
            // Si el formulario no cumple las reglas nativas de Bootstrap
            if (!formulario.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault(); // Detiene recarga en el prototipo
                
                // Extrae datos para el feedback del usuario
                const username = document.getElementById('username').value;
                
                // Muestra la alerta de éxito de Bootstrap
                if (alertaExito) {
                    alertaExito.innerText = `¡Bienvenido, ${username}! Tu cuenta de Sinapsis fue generada con éxito.`;
                    alertaExito.classList.remove('d-none');
                    
                    // Remueve estilos de validación previos
                    formulario.classList.remove('was-validated');
                    formulario.reset();

                    // Oculta la alerta automáticamente tras 4 segundos
                    setTimeout(() => {
                        alertaExito.classList.add('d-none');
                    }, 4000);
                }
            }
            // Añade la clase de Bootstrap para renderizar estilos válidos/inválidos
            formulario.classList.add('was-validated');
        }, false);
    }
});