  const loginForm = document.getElementById('loginForm');
        const passwordError = document.getElementById('passwordError');

        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            passwordError.style.display = 'none';

            const formData = new FormData(loginForm);

            try {
                const response = await fetch('./php/login_verify.php', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (result.success) {
                    window.location.href = 'eventos.html';
                } else {
                    passwordError.textContent = result.message || 'Correo o contraseña incorrectos';
                    passwordError.style.display = 'block';
                }
            } catch (error) {
                console.error('Error en la conexión:', error);
                passwordError.textContent = `Error en la conexión al servidor: ${error.message}`;
                passwordError.style.display = 'block';
            }
        });

        document.getElementById("adminButton").addEventListener("click", function() {
            window.location.href = "./hulul-admin/login.html";
        });