<?php
header('Content-Type: application/json');
include_once 'conexion.php';

$response = ['success' => false, 'message' => ''];

$email = $_POST['email'] ?? '';
$codigo = $_POST['codigo'] ?? '';

if (empty($email) || empty($codigo)) {
    $response['message'] = 'Faltan datos.';
    echo json_encode($response);
    exit;
}

$stmt = $conexion->prepare("SELECT * FROM usuarios WHERE email = ? AND reset_token_expiry > NOW()");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $usuario = $result->fetch_assoc();
    
    // Verificar el código hasheado
    if (password_verify($codigo, $usuario['reset_token'])) {
        // El código es correcto. Generamos un token final y seguro para el último paso.
        $token_final = bin2hex(random_bytes(50));
        $update_stmt = $conexion->prepare("UPDATE usuarios SET reset_token = ? WHERE email = ?");
        $update_stmt->bind_param("ss", $token_final, $email);
        $update_stmt->execute();
        
        $response['success'] = true;
        $response['token'] = $token_final;
    } else {
        $response['message'] = 'El código es incorrecto.';
    }
} else {
    $response['message'] = 'El código ha expirado o el correo es inválido.';
}

echo json_encode($response);
$stmt->close();
$conexion->close();
?>