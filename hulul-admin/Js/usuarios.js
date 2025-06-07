   async function cargarUsuarios() {
            try {
                const response = await fetch('php/usuarios.php');
                if (!response.ok) throw new Error('Error en la petición');
                const data = await response.json();

                const tableBody = document.getElementById('usuariosTable');
                tableBody.innerHTML = '';

                data.forEach(usuario => {
                    const fullName = usuario.nombre || '';
                    const parts = fullName.trim().split(' ');
                    const firstName = parts.shift() || '';
                    const lastName = parts.join(' ') || '';

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${usuario.id}</td>
                        <td>${firstName}</td>
                        <td>${lastName}</td>
                        <td>${usuario.cedula}</td>
                        <td>${usuario.celular}</td>
                        <td>${usuario.direccion}</td>
                        <td>${usuario.email}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="borrarUsuario(${usuario.id})">
                                <i class="fas fa-trash-alt"></i> Borrar
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            }
        }

        async function borrarUsuario(id) {
            if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

            try {
                const response = await fetch('php/usuarios.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ action: 'delete', id: id })
                });
                if (!response.ok) throw new Error('Error en la petición');

                const data = await response.json();

                if (data.status === 'success') {
                    alert('Usuario eliminado exitosamente');
                    cargarUsuarios();
                } else {
                    alert('Error al eliminar usuario');
                }
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                alert('Hubo un problema con la eliminación del usuario');
            }
        }

        cargarUsuarios();