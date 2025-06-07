<?php
// Configuración de la base de datos
$host = 'localhost';
$usuario = 'root';
$password = '';
$base_datos = 'trabajando_db';

// Crear conexión
$conexion = new mysqli($host, $usuario, $password, $base_datos);

// Verificar conexión
if ($conexion->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Error de conexión: ' . $conexion->connect_error]));
}

// Configurar charset
$conexion->set_charset("utf8");
?>