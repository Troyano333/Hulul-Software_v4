 function getQueryParams() {
            const params = {};
            window.location.search.substring(1).split("&").forEach(pair => {
                let [key, value] = pair.split("=");
                if (key) {
                    value = value ? value.replace(/\+/g, ' ') : '';
                    params[key] = decodeURIComponent(value);
                }
            });
            return params;
        }

        document.addEventListener("DOMContentLoaded", () => {
            const datos = getQueryParams();
            console.log("Datos recibidos:", datos); // Para depuración

            if (!datos.nombre || !datos.apellido) {
                alert("No se han encontrado datos completos de la reserva.");
                window.location.href = 'index.html';
                return;
            }

            document.getElementById("nombre_reserva").textContent = datos.nombre || "No disponible";
            document.getElementById("apellido_reserva").textContent = datos.apellido || "No disponible";
            document.getElementById("evento_reserva").textContent = datos.evento || "No disponible";
            document.getElementById("fecha_reserva").textContent = datos.fecha || "No disponible";
            document.getElementById("hora_reserva").textContent = datos.hora || "No disponible";
            document.getElementById("lugar_reserva").textContent = datos.lugar || "No disponible";
            document.getElementById("palco_reserva").textContent = datos.zona || "No disponible";

            const textoQR = `Reserva para: ${datos.nombre} ${datos.apellido}
Evento: ${datos.evento || "No disponible"}
Fecha del Evento: ${datos.fecha || "No disponible"}
Hora: ${datos.hora || "No disponible"}
Lugar: ${datos.lugar || "No disponible"}
Zona reservada: ${datos.zona || "No disponible"}`;

            const qrURL = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(textoQR)}`;
            document.getElementById("qr_png").src = qrURL;
        });

         function getQueryParams() {
            const params = {};
            // Usar window.location.search para obtener los parámetros de la URL
            const queryString = window.location.search.substring(1);
            const urlParams = new URLSearchParams(queryString);
            for (const [key, value] of urlParams) {
                params[key] = value;
            }
            return params;
        }

        document.addEventListener("DOMContentLoaded", () => {
            const datos = getQueryParams();

            // Llenar los campos con los datos de la URL
            document.getElementById("nombre_reserva").textContent = datos.nombre || "No disponible";
            document.getElementById("apellido_reserva").textContent = datos.apellido || "No disponible";
            document.getElementById("evento_reserva").textContent = datos.evento || "No disponible";
            document.getElementById("fecha_reserva").textContent = datos.fecha || "No disponible";
            document.getElementById("hora_reserva").textContent = datos.hora || "No disponible";
            document.getElementById("lugar_reserva").textContent = datos.lugar || "No disponible";
            document.getElementById("zona_reserva").textContent = datos.zona || "No disponible";
            document.getElementById("precio_reserva").textContent = datos.precio || "No disponible";

            // Crear el texto para el código QR
            // Asegurarse de que todos los campos tengan un valor, aunque sea "N/A"
            const qrData = `
                Reserva Hulul
                Nombre: ${datos.nombre || "N/A"} ${datos.apellido || ""}
                Evento: ${datos.evento || "N/A"}
                Fecha: ${datos.fecha || "N/A"}
                Hora: ${datos.hora || "N/A"}
                Lugar: ${datos.lugar || "N/A"}
                Zona: ${datos.zona || "N/A"}
                Precio: ${datos.precio || "N/A"}
            `.trim().replace(/\s+/g, ' '); // Limpiar espacios extra

            // Generar URL del código QR usando la API de Google Charts (más robusta)
            // o podrías usar una librería JS como qrcode.js si prefieres generarlo en el cliente sin API externa
            if (qrData.length > 10) { // Solo generar si hay datos significativos
                 const qrURL = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(qrData)}&choe=UTF-8`;
                 document.getElementById("qr_png").src = qrURL;
                 document.getElementById("qr_png").alt = "Código QR de tu reserva para Hulul";
            } else {
                 document.getElementById("qr_imagen").alt = "No se pudieron cargar los datos para el QR";
            }
        });