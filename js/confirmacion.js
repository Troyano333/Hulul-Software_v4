document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Función para llenar los datos en la página una vez que los recibimos del servidor
    function rellenarDetalles(datos) {
        document.getElementById("nombre_reserva").textContent = datos.nombre;
        document.getElementById("apellido_reserva").textContent = datos.apellido;
        document.getElementById("evento_reserva").textContent = datos.evento;
        document.getElementById("fecha_reserva").textContent = datos.fecha;
        document.getElementById("hora_reserva").textContent = datos.hora;
        document.getElementById("lugar_reserva").textContent = datos.lugar;
        document.getElementById("zona_reserva").textContent = datos.zona;
        document.getElementById("precio_reserva").textContent = `$${datos.precio}`;
        
        // Creamos la imagen del QR dinámicamente y la añadimos al div
        const qrContenedor = document.getElementById("codigo-qr");
        if (qrContenedor) {
            // Creamos un nuevo elemento de imagen para el QR
            const qrImagen = document.createElement('img');
            qrImagen.src = datos.qr_base64; // Le ponemos el QR que viene del servidor
            qrImagen.alt = "Código QR de tu reserva";
            qrImagen.style.maxWidth = '100%'; // Le damos un estilo básico para que sea responsive
            
            // Limpiamos el contenedor y añadimos la nueva imagen QR y el párrafo de instrucción
            qrContenedor.innerHTML = `<h2><i class="bi bi-qr-code"></i> Tu Código QR</h2>`; // Reseteamos el título
            qrContenedor.appendChild(qrImagen); // Añadimos la imagen del QR
            qrContenedor.innerHTML += `<p class="qr-instruction">Presenta este código QR en la entrada de la discoteca para validar tu reserva.</p>`;
        }
    }

    // --- LÓGICA DE PRUEBA: SIEMPRE SE EJECUTA ---
    // (Hemos mantenido la lógica de la versión de prueba que siempre genera el tiquete)

    const formData = new FormData();
    for (const [key, value] of urlParams.entries()) {
        if (key === 'evento') formData.append('eventoSeleccionado', value);
        else if (key === 'zona') formData.append('zonaSeleccionada', value);
        else if (key === 'fecha') formData.append('fechaEvento', value);
        else if (key === 'hora') formData.append('horaEvento', value);
        else if (key === 'precio') formData.append('precioZona', value);
        else formData.append(key, value);
    }

    // Verificamos que los datos mínimos (nombre y email) hayan llegado en la URL
    if (!urlParams.has('nombre') || !urlParams.has('email')) {
         document.body.innerHTML = `<div style="text-align:center; padding: 50px;"><h1>Error</h1><p>No se encontraron los datos de la reserva en la URL. Asegúrate de que el formulario los esté enviando.</p></div>`;
         return;
    }

    // Mostramos un estado de "cargando" mientras se procesa
    document.getElementById('resumen_pago').innerHTML = `<p class="lead text-center">Procesando tu tiquete...</p>`;
    
    // Llamamos a nuestro PHP para guardar la reserva y generar los datos del tiquete
    fetch('php/guardar_reserva.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json()) // Esperamos una respuesta en formato JSON
    .then(result => {
        if (result.success) {
            // SI TODO SALIÓ BIEN...
            // Ocultamos el mensaje "Procesando..."
            document.getElementById('resumen_pago').style.display = 'none';
            // Llenamos toda la página con los datos que nos devolvió el servidor
            rellenarDetalles(result.data);
            
            // Cambiamos el título principal para reflejar el éxito
            document.querySelector('h1').innerHTML = `<i class="bi bi-patch-check-fill"></i> ¡Reserva Confirmada!`;
        } else {
            // Si el PHP devolvió un error (ej: la base de datos falló)
            document.getElementById('resumen_pago').innerHTML = `<p class="text-center text-danger"><b>Error:</b> ${result.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('resumen_pago').innerHTML = `<p class="text-center text-danger"><b>Error de conexión.</b> Revisa la consola (F12) para más detalles.</p>`;
    });
});