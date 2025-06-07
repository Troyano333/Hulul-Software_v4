// Variables globales
let eventos = [];

// Cargar eventos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarEventos();
});

// Función para mostrar alertas
function mostrarAlerta(mensaje, tipo = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        ${mensaje}
    `;
    alertContainer.appendChild(alertDiv);

    // Remover alerta después de 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Cargar eventos desde la base de datos
function cargarEventos() {
    fetch('./php/get_eventos.php')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                eventos = data;
                renderizarEventos();
            } else {
                console.error('Error al cargar eventos:', data);
                mostrarAlerta('Error al cargar eventos', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarAlerta('Error de conexión al cargar eventos', 'error');
        });
}

// Renderizar eventos en el DOM
function renderizarEventos() {
    const container = document.getElementById('eventosList');
    
    if (eventos.length === 0) {
        container.innerHTML = '<p>No hay eventos disponibles.</p>';
        return;
    }

    container.innerHTML = eventos.map(evento => `
        <div class="evento-card">
            <div class="row">
                <div class="col-md-2">
                    <img src="../${evento.foto}" alt="${evento.nombre}" class="evento-image">
                </div>
                <div class="col-md-8">
                    <h5>${evento.nombre}</h5>
                    <p><strong>Categoría:</strong> ${evento.categoria || 'No especificada'}</p>
                    <p><strong>Fecha:</strong> ${formatearFecha(evento.fecha)} a las ${evento.hora}</p>
                    <p><strong>Lugar:</strong> ${evento.lugar || 'No especificado'}, ${evento.ciudad || 'No especificada'}</p>
                    <p><strong>Restricciones:</strong> ${evento.restricciones || 'No especificadas'}</p>
                    <p class="text-muted">${evento.descripcion}</p>
                </div>
                <div class="col-md-2 text-end">
                    <button class="btn-delete" onclick="eliminarEvento(${evento.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Formatear fecha
function formatearFecha(fechaStr) {
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
}

// Agregar evento
document.getElementById('addEventoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    fetch('./php/add_evento.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            mostrarAlerta(data.message, 'success');
            e.target.reset();
            cargarEventos(); // Recargar eventos
        } else {
            mostrarAlerta(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarAlerta('Error al agregar evento', 'error');
    });
});

// Eliminar evento
function eliminarEvento(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        const formData = new FormData();
        formData.append('id', id);

        fetch('./php/delete_evento.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                mostrarAlerta(data.message, 'success');
                cargarEventos(); // Recargar eventos
            } else {
                mostrarAlerta(data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarAlerta('Error al eliminar evento', 'error');
        });
    }
}
