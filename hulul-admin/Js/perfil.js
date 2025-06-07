     // Cargar datos del perfil desde el almacenamiento local (localStorage)
        window.onload = function() {
            const storedProfile = JSON.parse(localStorage.getItem('profile'));
            if (storedProfile) {
                document.getElementById('profileName').textContent = storedProfile.name;
                document.getElementById('profileFullName').textContent = storedProfile.name;
                document.getElementById('profileEmail').textContent = storedProfile.email;
                document.getElementById('profilePhone').textContent = storedProfile.phone;
                document.getElementById('profileAddress').textContent = storedProfile.address;
                document.getElementById('profileImg').src = storedProfile.imgSrc || 'profile.jpg'; // Default image
            }
        };

        // Función para cambiar la foto de perfil
        function changeProfilePic(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.querySelector('.profile-img').src = e.target.result;
                    saveProfileData({ imgSrc: e.target.result }); // Guardar la imagen en el almacenamiento
                }
                reader.readAsDataURL(file);
            }
        }

        // Función para cerrar sesión
        function logout() {
            alert('Cerrando sesión...');
            localStorage.removeItem('profile'); // Borrar los datos del perfil al cerrar sesión
            window.location.href = 'login.html'; // Redirigir al login
        }

        // Función para guardar los cambios del perfil
        function saveProfile() {
            const name = document.getElementById('editName').value;
            const email = document.getElementById('editEmail').value;
            const phone = document.getElementById('editPhone').value;
            const address = document.getElementById('editAddress').value;

            const updatedProfile = { name, email, phone, address, imgSrc: document.querySelector('.profile-img').src };
            localStorage.setItem('profile', JSON.stringify(updatedProfile)); // Guardar el perfil actualizado
            alert('Perfil actualizado con éxito');
            $('#editModal').modal('hide'); // Cierra el modal
        }

        // Guardar los datos del perfil
        function saveProfileData(profileData) {
            const currentProfile = JSON.parse(localStorage.getItem('profile')) || {};
            const updatedProfile = { ...currentProfile, ...profileData };
            localStorage.setItem('profile', JSON.stringify(updatedProfile));
        }