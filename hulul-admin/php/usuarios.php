<?php
// Conexión a la base de datos
$conexion = new mysqli('localhost', 'root', '', 'trabajando_db');

if ($conexion->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Error de conexión: ' . $conexion->connect_error]));
}

// Eliminar usuario (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    $id = intval($_POST['id']);
    $delete = $conexion->query("DELETE FROM usuarios WHERE id = $id");

    if ($delete) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se pudo eliminar']);
    }
    $conexion->close();
    exit;
}

// Listar usuarios (GET)
$sql = "SELECT id, nombre, cedula, direccion, celular, email FROM usuarios ORDER BY id DESC";
$result = $conexion->query($sql);

$usuarios = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($usuarios);

$conexion->close();
?>
