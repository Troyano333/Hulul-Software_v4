<?php
header('Content-Type: application/json');
date_default_timezone_set("America/Bogota");

$conexion = new mysqli("localhost", "root", "", "trabajando_db");
if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Conexión fallida: " . $conexion->connect_error]);
    exit;
}

// Reservas por día (últimos 7 días)
$sqlReservasDia = "
    SELECT fecha_reserva as dia, COUNT(*) as total
    FROM reservas
    WHERE fecha_reserva >= CURDATE() - INTERVAL 6 DAY
    GROUP BY fecha_reserva
    ORDER BY fecha_reserva ASC
";

$resReservasDia = $conexion->query($sqlReservasDia);
$reservasPorDia = [];
if ($resReservasDia) {
    while ($row = $resReservasDia->fetch_assoc()) {
        $reservasPorDia[] = $row;
    }
}

// Estado de reservas - Si no tienes campo estado, mostramos todo como "Confirmada"
$sqlEstado = "
    SELECT 'Confirmada' as estado, COUNT(*) as total
    FROM reservas
";

$resEstado = $conexion->query($sqlEstado);
$estadoReservas = [];
if ($resEstado) {
    while ($row = $resEstado->fetch_assoc()) {
        $estadoReservas[] = $row;
    }
}

echo json_encode([
    "reservasPorDia" => $reservasPorDia,
    "estadoReservas" => $estadoReservas
]);

$conexion->close();
?>
