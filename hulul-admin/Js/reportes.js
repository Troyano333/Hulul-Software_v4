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
 <script>
        let ingresosDelMesChart, costosOperacionalesChart;

        async function cargarReportes() {
            try {
                const res = await fetch('./php/get_reportes_financieros.php');
                if (!res.ok) throw new Error('Error al cargar reportes financieros');
                const data = await res.json();

                // Formatear etiquetas mes/año
                const labelsFormateados = data.labelsIngresos.map(mes => {
                    const [year, month] = mes.split('-');
                    return new Date(year, month - 1).toLocaleString('es-ES', { month: 'short', year: 'numeric' });
                });

                // Actualizar o crear gráfico ingresos
                if (ingresosDelMesChart) {
                    ingresosDelMesChart.data.labels = labelsFormateados;
                    ingresosDelMesChart.data.datasets[0].data = data.dataIngresos;
                    ingresosDelMesChart.update();
                } else {
                    ingresosDelMesChart = new Chart(document.getElementById('ingresosDelMesChart'), {
                        type: 'bar',
                        data: {
                            labels: labelsFormateados,
                            datasets: [{
                                label: 'Ingresos del Mes ($)',
                                data: data.dataIngresos,
                                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: { beginAtZero: true }
                            }
                        }
                    });
                }

                // Costos operacionales
                const labelsCostos = Object.keys(data.costosOperacionales);
                const valoresCostos = Object.values(data.costosOperacionales);

                if (costosOperacionalesChart) {
                    costosOperacionalesChart.data.labels = labelsCostos;
                    costosOperacionalesChart.data.datasets[0].data = valoresCostos;
                    costosOperacionalesChart.update();
                } else {
                    costosOperacionalesChart = new Chart(document.getElementById('costosOperacionalesChart'), {
                        type: 'pie',
                        data: {
                            labels: labelsCostos,
                            datasets: [{
                                data: valoresCostos,
                                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                                hoverOffset: 4
                            }]
                        }
                    });
                }

            } catch (error) {
                console.error(error);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            cargarReportes();
        });

        // Función para mostrar secciones
        function showSection(section) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(section).classList.add('active');
        }
    </script>