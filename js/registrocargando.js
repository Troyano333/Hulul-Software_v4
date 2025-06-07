document.getElementById("registroForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir el envío del formulario para manejar la animación

    // Mostrar la animación de carga
    var animationContainer = document.getElementById("animationContainer");
    var loading = document.getElementById("loading");
    var checkmark = document.getElementById("checkmark");
    var successMessage = document.getElementById("successMessage");

    animationContainer.style.display = "block"; // Mostrar contenedor de animación
    checkmark.style.display = "none"; // Asegurarse de que el checkmark esté oculto al inicio
    successMessage.style.display = "none"; // Asegurarse de que el mensaje de éxito esté oculto

    // Simulando un proceso de registro con un retraso
    setTimeout(function() {
        loading.style.display = "none"; // Ocultar el círculo de carga
        checkmark.style.display = "block"; // Mostrar el checkmark
        successMessage.style.display = "block"; // Mostrar el mensaje de éxito

        // Redirigir a la página de inicio o la página que desees después de 3 segundos
        setTimeout(function() {
            window.location.href = "eventos.html"; // Cambia "pagina_de_destino.html" por la página a la que deseas redirigir
        }, 2000); // Redirigir después de 2 segundos
    }, 3000); // 3000 ms = 3 segundos
});
