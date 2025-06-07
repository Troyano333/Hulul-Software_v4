const registroForm = document.getElementById("registroForm");
const formErrorDiv = document.getElementById("formError");

if (registroForm) {
    registroForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        formErrorDiv.style.display = 'none';
        formErrorDiv.textContent = '';

        // Validación de la contraseña
        const contrasena = document.getElementById("contrasena").value;
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&])[A-Za-z\d!#$%&]{8,}$/;
        if (!regex.test(contrasena)) {
            formErrorDiv.textContent = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial (ej: !#$%&).";
            formErrorDiv.style.display = 'block';
            return; // Detener el envío del formulario si la contraseña no es válida
        }

        const formData = new FormData(registroForm);
        const registerButton = document.getElementById('registerButton');
        const originalButtonText = registerButton.innerHTML;
        registerButton.disabled = true;
        registerButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registrando...';

        try {
            const response = await fetch('./php/guardar_usuario.php', {
                method: 'POST',
                body: formData
            });

            const responseText = await response.text();

            if (response.ok && responseText.toLowerCase().includes("registro exitoso") && responseText.toLowerCase().includes("correo enviado")) {
                formErrorDiv.textContent = "¡Registro y correo de bienvenida enviados!";
                formErrorDiv.style.display = 'block';

                setTimeout(function () {
                    window.location.href = "eventos.html";
                }, 2500);

            } else if (responseText.toLowerCase().includes("el correo electrónico ya está registrado")) {
                formErrorDiv.textContent = "El correo electrónico ya está registrado. Por favor, utiliza otro.";
                formErrorDiv.style.display = 'block';
                registerButton.disabled = false;
                registerButton.innerHTML = originalButtonText;
            } else {
                formErrorDiv.textContent = responseText.replace(/^Error:\s*/i, '') || "Error desconocido durante el registro.";
                formErrorDiv.style.display = 'block';
                registerButton.disabled = false;
                registerButton.innerHTML = originalButtonText;
            }

        } catch (error) {
            console.error('Error en el fetch:', error);
            formErrorDiv.textContent = "Error de conexión al intentar registrar. Inténtalo de nuevo.";
            formErrorDiv.style.display = 'block';
            registerButton.disabled = false;
            registerButton.innerHTML = originalButtonText;
        }
    });
}
