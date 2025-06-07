<?php
header('Content-Type: application/json');
date_default_timezone_set("America/Bogota");

$conexion = new mysqli("localhost", "root", "", "trabajando_db");
if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Conexión fallida: " . $conexion->connect_error]);
    exit;
}

// Total reservas activas
$sqlTotalReservas = "SELECT COUNT(*) as total FROM reservas";
$result = $conexion->query($sqlTotalReservas);
$totalReservas = $result ? (int)$result->fetch_assoc()['total'] : 0;

// Ingresos del mes, limpiando el campo precio de símbolos y puntos
$sqlIngresosMes = "SELECT 
    SUM(CAST(REPLACE(REPLACE(REPLACE(precio, '$', ''), '.', ''), ' COP', '') AS UNSIGNED)) AS ingresos
    FROM reservas
    WHERE MONTH(fecha_reserva) = MONTH(CURRENT_DATE()) AND YEAR(fecha_reserva) = YEAR(CURRENT_DATE())";
$result = $conexion->query($sqlIngresosMes);
$ingresosMes = $result ? (int)$result->fetch_assoc()['ingresos'] : 0;

// Ocupación Palcos VIP
$sqlOcupacionPalcos = "SELECT COUNT(*) as ocupados FROM reservas WHERE tipo_palco LIKE '%Palco VIP%'";
$result = $conexion->query($sqlOcupacionPalcos);
$ocupacionPalcos = $result ? (int)$result->fetch_assoc()['ocupados'] : 0;

// Total Palcos VIP disponibles - reemplaza con consulta si tienes tabla inventario
$totalPalcosVIP = 100;

// Ocupación Mesas Premium
$sqlOcupacionMesas = "SELECT COUNT(*) as ocupados FROM reservas WHERE tipo_palco LIKE '%Mesa Premium%'";
$result = $conexion->query($sqlOcupacionMesas);
$ocupacionMesas = $result ? (int)$result->fetch_assoc()['ocupados'] : 0;

$totalMesasPremium = 100;

$conexion->close();

echo json_encode([
    "totalReservas" => $totalReservas,
    "ingresosMes" => $ingresosMes,
    "ocupacionPalcos" => $totalPalcosVIP > 0 ? round(($ocupacionPalcos / $totalPalcosVIP) * 100) : 0,
    "ocupacionMesas" => $totalMesasPremium > 0 ? round(($ocupacionMesas / $totalMesasPremium) * 100) : 0
]);
