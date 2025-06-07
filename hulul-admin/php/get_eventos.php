<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir conexión
include_once 'conexion.php';

try {
    // Consultar eventos activos ordenados por fecha
    $sql = "SELECT id, nombre, descripcion, fecha, hora, lugar, ciudad, categoria, restricciones, foto 
            FROM eventos 
            WHERE activo = TRUE 
            ORDER BY fecha ASC";
    
    $result = $conexion->query($sql);
    
    $eventos = [];
    
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $eventos[] = $row;
        }
    }
    
    echo json_encode($eventos);
    
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al obtener eventos: ' . $e->getMessage()]);
}

$conexion->close();
?>