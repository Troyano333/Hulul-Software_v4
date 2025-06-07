<?php
header('Content-Type: application/json');
date_default_timezone_set("America/Bogota");

$conexion = new mysqli("localhost", "root", "", "trabajando_db");
if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Conexión fallida: " . $conexion->connect_error]);
    exit;
}

// Ejemplo: Sumar ingresos mensuales agrupados por mes
$sqlIngresosMensuales = "
    SELECT 
        DATE_FORMAT(fecha_reserva, '%Y-%m') AS mes, 
        SUM(CAST(REPLACE(REPLACE(REPLACE(precio, '$', ''), '.', ''), ' COP', '') AS UNSIGNED)) AS ingreso_total
    FROM reservas
    GROUP BY mes
    ORDER BY mes DESC
    LIMIT 12
";
$result = $conexion->query($sqlIngresosMensuales);
$ingresosMeses = [];
$labelsIngresos = [];
$dataIngresos = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $labelsIngresos[] = $row['mes'];
        $dataIngresos[] = (int)$row['ingreso_total'];
    }
}

// Ejemplo: Costos operacionales (podrías tener una tabla costos, aquí está fijo)
$costosOperacionales = [
    "Costos de Producción" => 120000,
    "Costos Administrativos" => 80000,
    "Otros Costos" => 50000
];

$conexion->close();

echo json_encode([
    "labelsIngresos" => array_reverse($labelsIngresos), // invertir para mostrar cronológicamente
    "dataIngresos" => array_reverse($dataIngresos),
    "costosOperacionales" => $costosOperacionales
]);
