<?php
// Configuración de la base de datos
$host = "localhost";
$username = "root";
$password = "";
$database = "trabajando_db";

// Crear la conexión a la base de datos
$conexion = new mysqli($host, $username, $password, $database);

// Verificar la conexión
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Configuración de la codificación de caracteres para evitar problemas con caracteres especiales
$conexion->set_charset("utf8");
?>
