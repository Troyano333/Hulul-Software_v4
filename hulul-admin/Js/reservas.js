let reservasPorDiaChart;
let estadoReservasChart;

const reservasTableBody = document.getElementById('reservasTableBody');
const totalReservas = document.getElementById('totalReservas');
const ctxReservasPorDia = document.getElementById('reservasPorDiaChart').getContext('2d');
const ctxEstadoReservas = document.getElementById('estadoReservasChart').getContext('2d');

async function cargarReservas() {
  try {
    const response = await fetch('./php/get_reservas.php');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const reservas = await response.json();

    totalReservas.textContent = reservas.length;
    reservasTableBody.innerHTML = '';

    reservas.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.id ?? ''}</td>
        <td>${(r.nombre ?? '') + ' ' + (r.apellido ?? '')}</td>
        <td>${r.email ?? ''}</td>
        <td>${r.tipo_palco ?? ''}</td>
        <td></td> <!-- Si no tienes mesa_palco, dejar vacío -->
        <td>${r.evento ?? ''}</td>
        <td>Confirmada</td> <!-- Estado fijo -->
        <td>$${r.precio ? Number(r.precio).toLocaleString() : ''}</td>
      `;
      reservasTableBody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error cargando reservas:', error);
    reservasTableBody.innerHTML = `<tr><td colspan="8">Error cargando reservas</td></tr>`;
    totalReservas.textContent = '0';
  }
}

async function cargarEstadisticas() {
  try {
    const response = await fetch('./php/get_estadisticas.php');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    const dias = data.reservasPorDia.map(d => {
      const date = new Date(d.dia);
      return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
    });
    const totalPorDia = data.reservasPorDia.map(d => Number(d.total));

    if (reservasPorDiaChart) reservasPorDiaChart.destroy();
    reservasPorDiaChart = new Chart(ctxReservasPorDia, {
      type: 'line',
      data: {
        labels: dias,
        datasets: [{
          label: 'Reservas por Día',
          data: totalPorDia,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
          tension: 0.3
        }]
      },
      options: {
        scales: { y: { beginAtZero: true, precision: 0 } },
        plugins: { legend: { display: true } }
      }
    });

    const estados = data.estadoReservas.map(e => e.estado ?? 'Confirmada');
    const totalesEstado = data.estadoReservas.map(e => Number(e.total));
    const coloresEstado = estados.map(e => {
      if (e.toLowerCase() === 'confirmada') return '#10b981';
      if (e.toLowerCase() === 'pendiente') return '#f59e0b';
      if (e.toLowerCase() === 'cancelada') return '#ef4444';
      return '#888';
    });

    if (estadoReservasChart) estadoReservasChart.destroy();
    estadoReservasChart = new Chart(ctxEstadoReservas, {
      type: 'pie',
      data: {
        labels: estados,
        datasets: [{
          data: totalesEstado,
          backgroundColor: coloresEstado,
          hoverOffset: 6
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom' } }
      }
    });

  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  }
}

function refrescarTodo() {
  cargarReservas();
  cargarEstadisticas();
}

document.addEventListener('DOMContentLoaded', () => {
  refrescarTodo();
  setInterval(refrescarTodo, 60000);
});
