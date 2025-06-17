<?php
// ... (código inicial igual: header, include)
header('Content-Type: application/json');
include_once 'conexion.php';

$response = ['success' => false, 'message' => ''];

$token = $_POST['token'] ?? '';
$nueva_contrasena = $_POST['nueva_contrasena'] ?? '';

// ... (verificación de token y contraseña vacíos igual)
if (empty($token) || empty($nueva_contrasena)) {
    $response['message'] = 'Faltan datos.';
    echo json_encode($response);
    exit;
}

$stmt = $conexion->prepare("SELECT * FROM usuarios WHERE reset_token = ? AND reset_token_expiry > NOW()");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $usuario = $result->fetch_assoc();
    
    $contrasena_hasheada = password_hash($nueva_contrasena, PASSWORD_DEFAULT);

    // ===== AQUÍ SE GUARDA LA FECHA DEL CAMBIO =====
    $currentTime = date("Y-m-d H:i:s");
    $update_stmt = $conexion->prepare("UPDATE usuarios SET contrasena = ?, reset_token = NULL, reset_token_expiry = NULL, last_password_reset = ? WHERE email = ?");
    $update_stmt->bind_param("sss", $contrasena_hasheada, $currentTime, $usuario['email']);
    // ===== FIN DE LA MODIFICACIÓN =====
    
    if ($update_stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Tu contraseña ha sido actualizada con éxito.';
    } else {
        $response['message'] = 'Error al actualizar la contraseña.';
    }
} else {
    $response['message'] = 'El token es inválido o ha expirado. Intenta el proceso de nuevo.';
}

echo json_encode($response);
$stmt->close();
$conexion->close();
?>