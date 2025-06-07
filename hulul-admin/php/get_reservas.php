<?php
header('Content-Type: application/json');
date_default_timezone_set("America/Bogota");

$conexion = new mysqli("localhost", "root", "", "trabajando_db");
if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Conexión fallida: " . $conexion->connect_error]);
    exit;
}

$sql = "SELECT 
    id, nombre, apellido, email, telefono, tipo_palco, precio, 
    hora_reserva, lugar, evento, fecha_evento, fecha_reserva
FROM reservas
ORDER BY fecha_reserva DESC, hora_reserva DESC";

$resultado = $conexion->query($sql);

if (!$resultado) {
    http_response_code(500);
    echo json_encode(["error" => "Error en consulta: " . $conexion->error]);
    exit;
}

$reservas = [];
while ($fila = $resultado->fetch_assoc()) {
    $reservas[] = $fila;
}

echo json_encode($reservas);

$conexion->close();
?>
