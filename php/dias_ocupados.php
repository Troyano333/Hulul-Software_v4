<?php
$conexion = new mysqli("localhost", "root", "", "trabajando_db");
$consulta = $conexion->query("SELECT DISTINCT fecha FROM reservas");
$fechas = [];

while ($fila = $consulta->fetch_assoc()) {
    $fechas[] = $fila['fecha'];
}
header('Content-Type: application/json');
echo json_encode($fechas);
?>
