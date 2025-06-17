// Datos para el gráfico de Ingresos del Mes
const ingresosMesChart = new Chart(document.getElementById('ingresosMesChart'), {
    type: 'bar',
    data: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [{
            label: 'Ingresos del Mes ($)',
            data: [15000, 20000, 18000, 22000],  // Aquí los ingresos reales
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: true
    }
});

// Datos para el gráfico de Costos Operacionales
const costosOperacionalesChart = new Chart(document.getElementById('costosOperacionalesChart'), {
    type: 'bar',
    data: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [{
            label: 'Costos Operacionales ($)',
            data: [5000, 6000, 5500, 7000],  // Aquí los costos reales
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: true
    }
});
