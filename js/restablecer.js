document.addEventListener("DOMContentLoaded", function() {
    const formEmail = document.getElementById('form-email');
    const formCodigo = document.getElementById('form-codigo');
    const formNuevaClave = document.getElementById('form-nueva-clave');

    const paso1 = document.getElementById('paso1-email');
    const paso2 = document.getElementById('paso2-codigo');
    const paso3 = document.getElementById('paso3-nueva-clave');

    const mensaje1 = document.getElementById('mensaje-paso1');
    const mensaje2 = document.getElementById('mensaje-paso2');
    const mensaje3 = document.getElementById('mensaje-paso3');
    
    const emailDisplay = document.getElementById('email-display');
    const resendLink = document.getElementById('resend-link');
    let resendTimer;

    // --- Lógica para el botón de Reenviar Código ---
    function startResendCooldown() {
        let seconds = 60;
        resendLink.classList.add('disabled'); // Deshabilita el link

        const updateTimer = () => {
            resendLink.textContent = `Reenviar en ${seconds}s`;
            seconds--;
            if (seconds < 0) {
                clearInterval(resendTimer);
                resendLink.textContent = 'Reenviar';
                resendLink.classList.remove('disabled');
            }
        };
        updateTimer();
        resendTimer = setInterval(updateTimer, 1000);
    }

    function handleSendCode() {
        const formData = new FormData(formEmail);
        
        fetch('php/enviar_codigo.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                paso1.style.display = 'none';
                paso2.style.display = 'block';
                paso3.style.display = 'none';
                emailDisplay.textContent = formData.get('email');
                startResendCooldown(); // Inicia el temporizador
            } else {
                mensaje1.textContent = data.message;
            }
        })
        .catch(error => {
            mensaje1.textContent = 'Ocurrió un error de conexión. Inténtalo de nuevo.';
            console.error('Error:', error);
        });
    }

    // --- Event Listeners para los formularios ---

    // PASO 1: Enviar correo
    formEmail.addEventListener('submit', function(e) {
        e.preventDefault();
        handleSendCode();
    });

    // Evento para el link de Reenviar
    resendLink.addEventListener('click', function() {
        if (!resendLink.classList.contains('disabled')) {
            mensaje2.textContent = ''; // Limpia mensajes de error anteriores
            handleSendCode(); // Llama a la misma función de enviar código
        }
    });

    // PASO 2: Verificar código
    formCodigo.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const codigo = document.getElementById('codigo').value;
        const formData = new FormData();
        formData.append('email', email);
        formData.append('codigo', codigo);

        fetch('php/verificar_codigo.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('token-final').value = data.token;
                paso1.style.display = 'none';
                paso2.style.display = 'none';
                paso3.style.display = 'block';
                clearInterval(resendTimer); // Detiene el temporizador si el código es correcto
            } else {
                mensaje2.textContent = data.message;
            }
        });
    });

    // PASO 3: Guardar nueva contraseña
    formNuevaClave.addEventListener('submit', function(e) {
        e.preventDefault();

        const pass1 = document.getElementById('nueva_contrasena').value;
        const pass2 = document.getElementById('confirmar_contrasena').value;

        if (pass1.length < 8) {
             mensaje3.textContent = 'La contraseña debe tener al menos 8 caracteres.';
             return;
        }
        if (pass1 !== pass2) {
            mensaje3.textContent = 'Las contraseñas no coinciden.';
            return;
        }

        const formData = new FormData(this);

        fetch('php/actualizar_contrasena.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelector('.form-container').innerHTML = `
                    <div class="logo-container"><img src="img/h.png" alt="Logo Hulul"></div>
                    <h2>¡Éxito!</h2>
                    <p>${data.message}</p>
                    <a href="login.html" style="text-decoration:none;">
                        <button type="button">Ir a Iniciar Sesión</button>
                    </a>
                `;
            } else {
                mensaje3.textContent = data.message;
            }
        });
    });
});