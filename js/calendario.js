document.getElementById("btnReservar").addEventListener("click", function () {
    const apellido = document.getElementById("apellido").value;
    const tipoPalco = document.getElementById("tipo_palco").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const discoteca = document.getElementById("discoteca").value;

    const datos = new FormData();
    datos.append("apellido", apellido);
    datos.append("tipo_palco", tipoPalco);
    datos.append("email", email);
    datos.append("telefono", telefono);
    datos.append("fecha", fecha);
    datos.append("hora", hora);
    datos.append("discoteca", discoteca);

    fetch("php/guardar_reserva.php", {
        method: "POST",
        body: datos
    })
    .then(res => res.text())
    .then(respuesta => {
        if (respuesta.includes("success")) {
            alert("✅ Reserva guardada correctamente.");
        } else if (respuesta.includes("error: Ya existe una reserva")) {
            alert("❌ Ya hay una reserva en esa fecha y hora. Elige otra.");
        } else {
            alert("⚠️ Ocurrió un error al guardar la reserva.");
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
    });
});


document.addEventListener("DOMContentLoaded", async () => {
    const fechaInput = document.getElementById("fecha_reserva");
    const calendario = fechaInput;

    // Cargar días ocupados desde el backend
    const respuesta = await fetch("dias_ocupados.php");
    const diasOcupados = await respuesta.json(); // devuelve ['2025-05-10', '2025-05-12', ...]

    fechaInput.addEventListener("input", () => {
        const fechaSeleccionada = fechaInput.value;
        if (diasOcupados.includes(fechaSeleccionada)) {
            alert("¡Este día ya está reservado!");
            fechaInput.value = "";
        }
    });

    // Para estilos de color verde/rojo se requiere una librería como flatpickr si deseas ver colores en calendario
});


function formatoAMPM(hora24) {
    const [hora, minuto] = hora24.split(":");
    const h = parseInt(hora);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hora12 = h % 12 || 12;
    return `${hora12}:${minuto} ${ampm}`;
}
