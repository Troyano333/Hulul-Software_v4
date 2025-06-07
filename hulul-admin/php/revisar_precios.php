<?php
date_default_timezone_set("America/Bogota");

$conexion = new mysqli("localhost", "root", "", "trabajando_db");
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

$sql = "SELECT id, nombre, apellido, precio FROM reservas ORDER BY id DESC";
$resultado = $conexion->query($sql);

if (!$resultado) {
    die("Error en consulta: " . $conexion->error);
}

echo "<h2>Lista de Reservas y Precios</h2>";
echo "<table border='1' cellpadding='10' cellspacing='0'>";
echo "<tr><th>ID</th><th>Nombre Completo</th><th>Precio (crudo)</th></tr>";

while ($fila = $resultado->fetch_assoc()) {
    $nombreCompleto = htmlspecialchars($fila['nombre'] . ' ' . $fila['apellido']);
    $precio = htmlspecialchars($fila['precio']);
    echo "<tr>";
    echo "<td>{$fila['id']}</td>";
    echo "<td>{$nombreCompleto}</td>";
    echo "<td>{$precio}</td>";
    echo "</tr>";
}

echo "</table>";

$conexion->close();
?>
