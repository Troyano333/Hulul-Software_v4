  // Datos de usuario ficticios para la validación
        const validUser = {
            username: 'admin',
            password: 'admin123'
        };

        // Función para manejar el envío del formulario de login
        document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que el formulario se envíe por defecto

            // Obtener los valores de usuario y contraseña
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Validar las credenciales
            if (username === validUser.username && password === validUser.password) {
                // Guardar datos en el almacenamiento local (localStorage)
                const profile = {
                    name: 'Juan Pérez',
                    email: 'juan.perez@admin.com',
                    phone: '+57 300 1234567',
                    address: 'Calle 123, Bogotá',
                    imgSrc: 'profile.jpg' // Imagen por defecto
                };
                localStorage.setItem('profile', JSON.stringify(profile));

                // Redirigir al perfil del administrador
                window.location.href = 'index.html';
            } else {
                // Mostrar mensaje de error
                document.getElementById('errorMessage').style.display = 'block';
            }
        });