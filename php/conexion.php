<?php
// Establece la zona horaria correcta para todo el proyecto
date_default_timezone_set('America/Bogota');

// Lee las credenciales de forma segura desde las Variables de Entorno del servidor (Render)
$host = getenv('DB_HOST');
$usuario = getenv('DB_USER');
$password = getenv('DB_PASS');
$base_datos = getenv('DB_NAME');

// --- NUEVA LÓGICA DE CONEXIÓN SEGURA CON SSL ---

// 1. Inicializamos un objeto mysqli
$conexion = mysqli_init();

// 2. Le decimos que debe usar SSL y le indicamos dónde encontrar los certificados de confianza del sistema.
// Esta ruta es estándar en los sistemas Linux (como el de Docker) en los que se ejecuta Render.
mysqli_ssl_set($conexion, NULL, NULL, "/etc/ssl/certs/ca-certificates.crt", NULL, NULL);

// 3. Ahora sí, establecemos la conexión real de forma segura
mysqli_real_connect($conexion, $host, $usuario, $password, $base_datos);

// --- FIN DE LA NUEVA LÓGICA ---

// Verificar conexión
if ($conexion->connect_error) {
    die("Error de conexión SSL con el servidor de la base de datos: " . $conexion->connect_error);
}

// Configurar el juego de caracteres para evitar problemas con tildes y ñ
$conexion->set_charset("utf8");
?>