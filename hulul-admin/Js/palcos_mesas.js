// Función para agregar un nuevo palco
document.getElementById('addPalcoForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const tipo = document.getElementById('palcoTipo').value;
    const precio = document.getElementById('palcoPrecio').value;

    if (tipo && precio) {
        const list = document.getElementById('palcosList');

        // Crear un nuevo div con la información del palco
        const item = document.createElement('div');
        item.classList.add('col-lg-4', 'col-md-6', 'mb-3');

        item.innerHTML = `
            <div class="inventory-item">
                <h3 class="text-muted">Palco ${tipo}</h3>
                <p>Disponible</p>
                <div class="item-info">
                    <strong>Precio:</strong> $${precio}<br>
                    <strong>Estado:</strong> Disponible
                </div>
                <div class="buttons">
                    <button class="btn btn-warning btn-edit" onclick="editarItem(this, 'palco')">Editar</button>
                    <button class="btn btn-danger btn-delete" onclick="borrarItem(this)">Borrar</button>
                </div>
            </div>
        `;

        list.appendChild(item);

        // Limpiar el formulario después de agregar
        document.getElementById('addPalcoForm').reset();
    }
});

// Función para agregar una nueva mesa
document.getElementById('addMesaForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const tipo = document.getElementById('mesaTipo').value;
    const precio = document.getElementById('mesaPrecio').value;

    if (tipo && precio) {
        const list = document.getElementById('mesasList');

        // Crear un nuevo div con la información de la mesa
        const item = document.createElement('div');
        item.classList.add('col-lg-4', 'col-md-6', 'mb-3');

        item.innerHTML = `
            <div class="inventory-item">
                <h3 class="text-muted">Mesa ${tipo}</h3>
                <p>Disponible</p>
                <div class="item-info">
                    <strong>Precio:</strong> $${precio}<br>
                    <strong>Estado:</strong> Disponible
                </div>
                <div class="buttons">
                    <button class="btn btn-warning btn-edit" onclick="editarItem(this, 'mesa')">Editar</button>
                    <button class="btn btn-danger btn-delete" onclick="borrarItem(this)">Borrar</button>
                </div>
            </div>
        `;

        list.appendChild(item);

        // Limpiar el formulario después de agregar
        document.getElementById('addMesaForm').reset();
    }
});

// Función para editar un item (Palco o Mesa)
function editarItem(button, tipo) {
    const item = button.closest('.inventory-item');
    const info = item.querySelector('.item-info').innerHTML;
    const tipoActual = item.querySelector('h3').innerText.split(' ')[1]; // Obtiene el tipo (VIP, Plata, etc.)
    const precioActual = item.querySelector('.item-info').innerText.split(': ')[1].split('\n')[0]; // Obtiene el precio

    // Cargar el tipo y precio en los formularios de edición
    if (tipo === 'palco') {
        document.getElementById('palcoTipo').value = tipoActual;
        document.getElementById('palcoPrecio').value = precioActual;
    } else if (tipo === 'mesa') {
        document.getElementById('mesaTipo').value = tipoActual;
        document.getElementById('mesaPrecio').value = precioActual;
    }

    // Cambiar el título del formulario para indicar que es una edición
    document.querySelector('.form-title').innerText = `Editar ${tipoActual}`;
}

// Función para borrar un item
function borrarItem(button) {
    const item = button.closest('.inventory-item');
    item.remove();
}
