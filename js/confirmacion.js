// Pega este código completo en tu archivo confirmacion.js

// --- FUNCIÓN PARA OBTENER PARÁMETROS DE LA URL ---
function getParams() {
    const params = {};
    if (window.location.search) {
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            const value = (pair[1] || '').replace(/\+/g, ' ');
            params[decodeURIComponent(pair[0])] = decodeURIComponent(value);
        }
    }
    return params;
}

// --- CAMBIO: Nueva función para los estados de PayPal ---
function estadoPaypal(estado) {
    // Los estados de PayPal usualmente son texto en inglés
    switch (estado) {
        case "Completed":
        case "Processed":
            return '<span class="badge badge-success">Aprobada</span>';
        case "Pending":
            return '<span class="badge badge-warning">Pendiente</span>';
        case "Denied":
        case "Failed":
        case "Refunded":
        case "Reversed":
            return '<span class="badge badge-danger">Rechazada/Reversada</span>';
        default:
            return `<span class="badge badge-secondary">${estado || 'Desconocido'}</span>`;
    }
}

// --- CÓDIGO PRINCIPAL QUE SE EJECUTA CUANDO LA PÁGINA CARGA ---
document.addEventListener("DOMContentLoaded", () => {
    const datos = getParams();
    console.log("Datos recibidos de la URL (PayPal):", datos); // Para depurar

    // PARTE 1: Llenar el resumen del pago
    const resumenPagoElement = document.getElementById('resumen_pago');
    if (resumenPagoElement) {
        let html = '';
        // CAMBIO: La condición ahora busca 'tx', el ID de transacción de PayPal
        if (datos.tx) {
            html += `<h3>¡Gracias por tu compra!</h3>`;
            // CAMBIO: Usamos la función y variable de estado de PayPal ('st')
            html += `<p>Estado de la transacción: ${estadoPaypal(datos.st)}</p>`;
            
            // CAMBIO: Usamos las variables de PayPal como 'tx' y 'amt'
            html += `<ul class="list-group mt-3">
                <li class="list-group-item"><strong>ID de Transacción:</strong> ${datos.tx}</li>
                <li class="list-group-item"><strong>Artículo:</strong> ${datos.item_name || '-'}</li>
                <li class="list-group-item"><strong>Valor pagado:</strong> ${datos.cc || '$'} ${datos.amt || '-'}</li>
                <li class="list-group-item"><strong>Método de pago:</strong> PayPal</li>
            </ul>`;
            html += `<p class="mt-3 small">Si tienes dudas, contáctanos con tu ID de Transacción.<br>¡Nos vemos en la fiesta!</p>`;
        } else {
            // Este mensaje ahora solo aparecerá si no hay ID de transacción de PayPal
            html = '<p class="text-warning">No se encontraron datos del pago. Si el pago fue exitoso, los detalles de la reserva están abajo.</p>';
        }
        resumenPagoElement.innerHTML = html;
    }

    // PARTE 2: Llenar los detalles de la reserva (esto sigue igual)
    document.getElementById("nombre_reserva").textContent = datos.nombre || "No disponible";
    document.getElementById("apellido_reserva").textContent = datos.apellido || "No disponible";
    document.getElementById("evento_reserva").textContent = datos.evento || "No disponible";
    document.getElementById("fecha_reserva").textContent = datos.fecha || "No disponible";
    document.getElementById("hora_reserva").textContent = datos.hora || "No disponible";
    document.getElementById("lugar_reserva").textContent = datos.lugar || "No disponible";
    const palcoElement = document.getElementById("palco_reserva") || document.getElementById("zona_reserva");
    if (palcoElement) {
        palcoElement.textContent = datos.zona || "No disponible";
    }
    // Para el precio que agregaste
    const precioElement = document.getElementById("precio_reserva");
    if (precioElement) {
        precioElement.textContent = datos.precio ? `$${datos.precio}` : (datos.amt ? `$${datos.amt}` : "No disponible");
    }

    // PARTE 3: Generar el código QR (esto sigue igual)
    const qrElement = document.getElementById("qr_png");
    if (qrElement) {
        const textoQR = `Reserva: ${datos.nombre} ${datos.apellido}, Evento: ${datos.evento}, Fecha: ${datos.fecha}, Zona: ${datos.zona}`;
        const qrURL = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(textoQR)}`;
        qrElement.src = qrURL;
    }
});