 const eventList = document.getElementById('event-list');
    const searchInput = document.getElementById('searchInput');
    const citySelect = document.getElementById('citySelect');
    const categorySelect = document.getElementById('categorySelect');
    const dateInput = document.getElementById('dateInput');
    const searchButton = document.getElementById('searchButton');

    let eventos = [];
    let eventosFiltrados = [];

    async function cargarEventos() {
      try {
        eventList.innerHTML = '<li>Cargando eventos...</li>';
        const response = await fetch('./hulul-admin/php/get_eventos.php');
        const data = await response.json();
        if (Array.isArray(data)) {
          eventos = data;
          eventosFiltrados = [...eventos];
          mostrarEventos(eventosFiltrados);
        } else {
          eventList.innerHTML = '<li>Error al cargar los eventos</li>';
        }
      } catch {
        eventList.innerHTML = '<li>Error de conexión</li>';
      }
    }

    function mostrarEventos(lista) {
      if (lista.length === 0) {
        eventList.innerHTML = '<li>No hay eventos disponibles.</li>';
        return;
      }
      eventList.innerHTML = '';
      lista.forEach(evento => {
        const eventItem = document.createElement('li');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
          <div class="event-image">
            <img src="${evento.foto}" alt="${evento.nombre}" onerror="this.src='./img/evento-default.jpg'" />
          </div>
          <div class="event-content">
            <h3 class="event-title">${evento.nombre}</h3>
            <p class="event-info"><strong>Fecha:</strong> ${formatearFecha(evento.fecha)} - ${evento.hora}</p>
            <p class="event-info"><strong>Lugar:</strong> ${evento.lugar || 'Lugar por confirmar'}, ${evento.ciudad || ''}</p>
            <p class="event-info"><strong>Categoría:</strong> ${evento.categoria || 'General'}</p>
            <p class="event-description">${evento.descripcion || ''}</p>
            <button class="btn btn-primary reserve-btn" onclick="reservarEvento('${evento.nombre}', '${evento.lugar}', '${evento.fecha}', '${evento.hora}', '${evento.ciudad}', '${evento.categoria}')">Reservar</button>
          </div>
        `;
        eventList.appendChild(eventItem);
      });
    }

    function formatearFecha(fechaStr) {
      if (!fechaStr) return 'Fecha inválida';

      const fechaLimpia = fechaStr.trim();

      const tieneHora = fechaLimpia.includes('T') || fechaLimpia.includes(' ');

      let fechaISO = fechaLimpia;
      if (!tieneHora) {
        fechaISO = fechaLimpia + 'T00:00:00';
      }

      const fecha = new Date(fechaISO);

      if (isNaN(fecha)) return 'Fecha inválida';

      const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
      return fecha.toLocaleDateString('es-ES', opciones);
    }

    function reservarEvento(nombre, lugar, fecha, hora, ciudad, categoria) {
      localStorage.setItem('eventoSeleccionado', nombre);
      localStorage.setItem('lugarEvento', lugar);
      localStorage.setItem('fechaEvento', fecha);
      localStorage.setItem('horaEvento', hora);
      localStorage.setItem('ciudadEvento', ciudad);
      localStorage.setItem('categoriaEvento', categoria);
      window.location.href = 'mapa.html';
    }

    function filtrarEventos() {
      const textoBusqueda = searchInput.value.toLowerCase().trim();
      const ciudadSeleccionada = citySelect.value.toLowerCase();
      const categoriaSeleccionada = categorySelect.value.toLowerCase();
      const fechaSeleccionada = dateInput.value;

      eventosFiltrados = eventos.filter(evento => {
        const coincideTexto = !textoBusqueda ||
          evento.nombre.toLowerCase().includes(textoBusqueda) ||
          (evento.descripcion && evento.descripcion.toLowerCase().includes(textoBusqueda));

        const coincideCiudad = !ciudadSeleccionada ||
          (evento.ciudad && evento.ciudad.toLowerCase() === ciudadSeleccionada);

        const coincideCategoria = !categoriaSeleccionada ||
          (evento.categoria && evento.categoria.toLowerCase() === categoriaSeleccionada);

        const coincideFecha = !fechaSeleccionada || evento.fecha === fechaSeleccionada;

        return coincideTexto && coincideCiudad && coincideCategoria && coincideFecha;
      });

      mostrarEventos(eventosFiltrados);
    }

    searchButton.addEventListener('click', filtrarEventos);
    searchInput.addEventListener('input', filtrarEventos);
    citySelect.addEventListener('change', filtrarEventos);
    categorySelect.addEventListener('change', filtrarEventos);
    dateInput.addEventListener('change', filtrarEventos);

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        filtrarEventos();
      }
    });

    document.addEventListener('DOMContentLoaded', cargarEventos);