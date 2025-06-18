<?php
// Establece la zona horaria correcta para todo el proyecto
date_default_timezone_set('America/Bogota');

// Lee las credenciales de forma segura desde las Variables de Entorno del servidor (Render)
$host = getenv('DB_HOST');
$usuario = getenv('DB_USER');
$password = getenv('DB_PASS');
$base_datos = getenv('DB_NAME');

// Crear conexión
$conexion = new mysqli($host, $usuario, $password, $base_datos);

// Verificar conexión
if ($conexion->connect_error) {
    die("Error de conexión con el servidor de la base de datos.");
}

// Configurar el juego de caracteres para evitar problemas con tildes y ñ
$conexion->set_charset("utf8");
?>