// Función para cambiar entre las secciones del panel de administración
function showSection(section) {
    let sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(section).classList.add('active');
}

// Función para cargar dinámicamente un modal en el contenedor
function loadModal(modalId) {
    fetch(`modals/${modalId}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('modal-container').innerHTML = data;
            var myModal = new bootstrap.Modal(document.getElementById(modalId), {
                keyboard: false
            });
            myModal.show();
        })
        .catch(error => console.error("Error loading modal:", error));
}

// Agregar funcionalidad adicional aquí para los formularios, como crear, editar, eliminar elementos.
