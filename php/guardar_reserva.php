<?php
header('Content-Type: application/json');
require '../vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

include_once 'conexion.php';

$response = ['success' => false, 'data' => null, 'message' => ''];

$campos_requeridos = ['nombre', 'apellido', 'email', 'telefono', 'eventoSeleccionado', 'fechaEvento', 'horaEvento', 'lugar', 'zonaSeleccionada', 'precioZona'];
foreach ($campos_requeridos as $campo) {
    if (!isset($_POST[$campo]) || empty(trim($_POST[$campo]))) {
        $response['message'] = "Falta el campo obligatorio '$campo'.";
        echo json_encode($response);
        exit;
    }
}

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

$sql = "INSERT INTO reservas (nombre, apellido, email, telefono, evento, fecha_reserva, hora_reserva, lugar, tipo_palco, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    $response['message'] = "Error en la preparación de la consulta: " . $conexion->error;
    echo json_encode($response);
    exit;
}

$stmt->bind_param("ssssssssss", $nombre, $apellido, $email, $telefono, $evento, $fecha, $hora, $lugar, $zona, $precio);

if ($stmt->execute()) {
    $id_reserva = $stmt->insert_id;

    $protocolo = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $host = $_SERVER['HTTP_HOST'];
    $ruta_base = "/hulul_software_v2/php/verificar_tiquete.php";
    $url_validacion = $protocolo . $host . $ruta_base . "?id=" . $id_reserva;
    
    $qr_code = QrCode::create($url_validacion)->setSize(300)->setMargin(10);
    $writer = new PngWriter();
    $qr_result = $writer->write($qr_code);
    $qr_base64 = 'data:image/png;base64,' . base64_encode($qr_result->getString());

    $response['success'] = true;
    $response['data'] = [
        'id_reserva' => $id_reserva,
        'nombre' => $nombre,
        'apellido' => $apellido,
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

echo json_encode($response);
?>