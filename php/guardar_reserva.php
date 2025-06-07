<?php
date_default_timezone_set("America/Bogota");

// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "trabajando_db");
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

// Verificar datos obligatorios
$campos_requeridos = ['nombre', 'apellido', 'email', 'telefono', 'eventoSeleccionado', 'fechaEvento', 'horaEvento', 'lugar', 'zonaSeleccionada', 'precioZona'];
foreach ($campos_requeridos as $campo) {
    if (!isset($_POST[$campo]) || empty(trim($_POST[$campo]))) {
        die("error: Falta el campo obligatorio '$campo'.");
    }
}

// Obtener los datos y sanitizarlos
$nombre = $conexion->real_escape_string(trim($_POST['nombre']));
$apellido = $conexion->real_escape_string(trim($_POST['apellido']));
$email = $conexion->real_escape_string(trim($_POST['email']));
$telefono = $conexion->real_escape_string(trim($_POST['telefono']));
$evento = $conexion->real_escape_string(trim($_POST['eventoSeleccionado']));
$fecha = $conexion->real_escape_string(trim($_POST['fechaEvento']));
$hora = $conexion->real_escape_string(trim($_POST['horaEvento']));
$lugar = $conexion->real_escape_string(trim($_POST['lugar']));
$zona = $conexion->real_escape_string(trim($_POST['zonaSeleccionada']));
$precio = $conexion->real_escape_string(trim($_POST['precioZona']));

// Preparar consulta
$sql = "INSERT INTO reservas (nombre, apellido, email, telefono, evento, fecha_reserva, hora_reserva, lugar, tipo_palco, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    die("Error en la preparación de la consulta: " . $conexion->error);
}

$stmt->bind_param("ssssssssss", $nombre, $apellido, $email, $telefono, $evento, $fecha, $hora, $lugar, $zona, $precio);

if ($stmt->execute()) {
    header("Location: ../confirmacion_pago.html?nombre=" . urlencode($nombre) . "&apellido=" . urlencode($apellido) . "&evento=" . urlencode($evento) . "&fecha=" . urlencode($fecha) . "&hora=" . urlencode($hora) . "&lugar=" . urlencode($lugar) . "&zona=" . urlencode($zona) . "&precio=" . urlencode($precio));
    exit;
} else {
    echo "Error al ejecutar la consulta: " . $stmt->error;
}

$stmt->close();
$conexion->close();
?>
