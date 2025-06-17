<?php
session_start();
header('Content-Type: application/json');

include 'conexion.php';

// Verificamos que el método de la solicitud sea POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    // 1. Usar Consultas Preparadas para buscar el usuario de forma segura
    $stmt = $conexion->prepare("SELECT * FROM usuarios WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // 2. Usar password_verify() para comparar la contraseña ingresada con el hash de la BD
        if (password_verify($password, $user['contrasena'])) {
            // ¡La contraseña es correcta!
            
            // Regeneramos el ID de sesión por seguridad
            session_regenerate_id(true);

            // Guardamos los datos del usuario en la sesión
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_nombre'] = $user['nombre']; // Opcional: guardar también el nombre

            // Enviamos una respuesta de éxito a JavaScript
            echo json_encode(['success' => true]);
            exit();

        } else {
            // La contraseña es incorrecta.
            // 3. Enviamos un mensaje de error genérico por seguridad.
            echo json_encode(['success' => false, 'message' => 'El correo o la contraseña son incorrectos.']);
        }
    } else {
        // El correo no fue encontrado.
        // Enviamos el MISMO mensaje de error genérico para no dar pistas a atacantes.
        echo json_encode(['success' => false, 'message' => 'El correo o la contraseña son incorrectos.']);
    }

    $stmt->close();
    $conexion->close();

} else {
    // Si el método no es POST
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>