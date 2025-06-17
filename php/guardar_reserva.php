<?php
// Establece el tipo de contenido a JSON para la comunicación con JavaScript
header('Content-Type: application/json');

// Incluir la librería de QR que instalamos con Composer
require '../vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

// Incluimos la conexión a la base de datos (que ya tiene la zona horaria)
include_once 'conexion.php';

// Prepara la respuesta que enviaremos
$response = ['success' => false, 'data' => null, 'message' => ''];

// --- Lógica para obtener y validar los datos del formulario ---
// Verificar datos obligatorios
$campos_requeridos = ['nombre', 'apellido', 'email', 'telefono', 'eventoSeleccionado', 'fechaEvento', 'horaEvento', 'lugar', 'zonaSeleccionada', 'precioZona'];
foreach ($campos_requeridos as $campo) {
    if (!isset($_POST[$campo]) || empty(trim($_POST[$campo]))) {
        // En lugar de morir, enviamos una respuesta JSON de error
        $response['message'] = "Falta el campo obligatorio '$campo'.";
        echo json_encode($response);
        exit;
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

// Preparar la consulta INSERT para tu tabla 'reservas'
$sql = "INSERT INTO reservas (nombre, apellido, email, telefono, evento, fecha_reserva, hora_reserva, lugar, tipo_palco, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    $response['message'] = "Error en la preparación de la consulta: " . $conexion->error;
    echo json_encode($response);
    exit;
}

// Vinculamos los parámetros
$stmt->bind_param("ssssssssss", $nombre, $apellido, $email, $telefono, $evento, $fecha, $hora, $lugar, $zona, $precio);

// Ejecutamos la consulta para guardar la reserva
if ($stmt->execute()) {
    $id_reserva = $stmt->insert_id;

    // Bloque de código para crear la URL dinámicamente
    $protocolo = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $host = $_SERVER['HTTP_HOST'];
    $ruta_base = "/hulul_software_v2/php/verificar_tiquete.php";
    $url_validacion = $protocolo . $host . $ruta_base . "?id=" . $id_reserva;
    
    // Generar el código QR con la nueva URL dinámica
    $qr_code = QrCode::create($url_validacion)->setSize(300)->setMargin(10);
    $writer = new PngWriter();
    $qr_result = $writer->write($qr_code);
    $qr_base64 = 'data:image/png;base64,' . base64_encode($qr_result->getString());

    // ==========================================================
    // ===== CAMBIO REALIZADO AQUÍ =====
    // ==========================================================
    // Preparamos los datos de la respuesta para enviarlos a JavaScript
    $response['success'] = true;
    $response['data'] = [
        'id_reserva' => $id_reserva,
        'nombre' => $nombre,       // <-- CAMBIO: Enviamos el nombre
        'apellido' => $apellido,   // <-- CAMBIO: Enviamos el apellido
        'evento' => $evento,
        'fecha' => $fecha,
        'hora' => $hora,
        'lugar' => $lugar,
        'zona' => $zona,
        'precio' => $precio,
        'qr_base64' => $qr_base64
    ];

} else {
    $response['message'] = "Error al guardar la reserva: " . $stmt->error;
}

$stmt->close();
$conexion->close();

// Devolvemos la respuesta final en formato JSON a JavaScript
echo json_encode($response);
?>