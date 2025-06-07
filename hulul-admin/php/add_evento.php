<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir conexión
include_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Recibir datos del formulario
        $nombre = trim($_POST['nombre']);
        $descripcion = trim($_POST['descripcion']);
        $fecha = $_POST['fecha'];
        $hora = $_POST['hora'];
        $lugar = trim($_POST['lugar']);
        $ciudad = trim($_POST['ciudad']);
        $categoria = trim($_POST['categoria']);
        $restricciones = trim($_POST['restricciones']);
        
        // Validar campos obligatorios
        if (empty($nombre) || empty($descripcion) || empty($fecha) || empty($hora)) {
            echo json_encode(['status' => 'error', 'message' => 'Todos los campos obligatorios deben ser completados']);
            exit;
        }
        
        // Manejar subida de imagen
        $foto = '';
        if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = '../../img_eventos/';
            $fileName = time() . '_' . basename($_FILES['foto']['name']);
            $uploadFile = $uploadDir . $fileName;
            
            // Crear directorio si no existe
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            if (move_uploaded_file($_FILES['foto']['tmp_name'], $uploadFile)) {
                $foto = './img_eventos/' . $fileName;
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al subir la imagen']);
                exit;
            }
        }
        
        // Insertar evento en la base de datos
        $sql = "INSERT INTO eventos (nombre, descripcion, fecha, hora, lugar, ciudad, categoria, restricciones, foto) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("sssssssss", $nombre, $descripcion, $fecha, $hora, $lugar, $ciudad, $categoria, $restricciones, $foto);
        
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Evento agregado exitosamente']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al agregar evento: ' . $conexion->error]);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
}

$conexion->close();
?>