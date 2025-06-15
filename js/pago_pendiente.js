document.addEventListener("DOMContentLoaded", () => {
    // 1. Función para obtener los parámetros de la URL
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const urlParams = new URLSearchParams(queryString);
        for (const [key, value] of urlParams) {
            // Decodificar y reemplazar el '+' por espacio
            params[key] = decodeURIComponent(value.replace(/\+/g, ' '));
        }
        return params;
    }

    const datos = getQueryParams();

    // 2. Verificar que los datos esenciales existan
    if (!datos.nombre || !datos.evento) {
        alert("No se han encontrado los datos de la reserva. Serás redirigido al inicio.");
        window.location.href = 'index.html';
        return;
    }

    // 3. Llenar los campos de la página principal con los datos
    document.getElementById("nombre_reserva").textContent = datos.nombre || "No disponible";
    document.getElementById("apellido_reserva").textContent = datos.apellido || "";
    document.getElementById("evento_reserva").textContent = datos.evento || "No disponible";
    document.getElementById("fecha_reserva").textContent = datos.fecha || "No disponible";
    document.getElementById("hora_reserva").textContent = datos.hora || "No disponible";
    document.getElementById("zona_reserva").textContent = datos.zona || "No disponible";
    document.getElementById("precio_reserva").textContent = datos.precio || "No disponible";

    // 4. CAMBIO: Establecer la imagen estática del código QR
    // Ya no se genera una URL dinámica, se usa la imagen local.
    const qrImgElement = document.getElementById("qr_png");
    if (qrImgElement) {
        qrImgElement.src = "./img/qr.png"; // Se establece la ruta de la imagen que pediste
        qrImgElement.alt = "Código QR de la reserva"; // Texto alternativo
    }


    // 5. Llenar y mostrar el Modal de Resumen
    const summaryModalElement = document.getElementById('summaryModal');
    if (summaryModalElement) {
        document.getElementById("modalSummaryNombre").textContent = `${datos.nombre || ""} ${datos.apellido || ""}`;
        document.getElementById("modalSummaryEvento").textContent = datos.evento || "No disponible";
        document.getElementById("modalSummaryZona").textContent = datos.zona || "No disponible";
        document.getElementById("modalSummaryFecha").textContent = datos.fecha || "No disponible";
        document.getElementById("modalSummaryPrecio").textContent = datos.precio || "No disponible";

        const summaryModal = new bootstrap.Modal(summaryModalElement);
        summaryModal.show();
    }
});