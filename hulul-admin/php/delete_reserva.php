<?php
header('Content-Type: application/json');
date_default_timezone_set("America/Bogota");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

$id = $_POST['id'] ?? null;

if (!$id || !is_numeric($id)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID inválido']);
    exit;
}

$conexion = new mysqli("localhost", "root", "", "trabajando_db");
if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión']);
    exit;
}

$stmt = $conexion->prepare("DELETE FROM reservas WHERE id = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error en consulta']);
    exit;
}

$stmt->bind_param("i", $id);
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Reserva eliminada']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar reserva']);
}

$stmt->close();
$conexion->close();
?>
