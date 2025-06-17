<?php
session_start();

// Usamos tu PHPMailer manual que sabemos que funciona
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';
require '../phpmailer/src/Exception.php';

include_once 'conexion.php'; 

// ... (El código de recibir datos y verificar si el correo existe sigue igual)
$nombre = $_POST["nombre"] ?? '';
$cedula = $_POST["cedula"] ?? '';
$direccion = $_POST["direccion"] ?? '';
$celular = $_POST["celular"] ?? '';
$correo = $_POST["email"] ?? '';
$clave = $_POST["contrasena"] ?? '';

$stmt = $conexion->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$result_check = $stmt->get_result();

if ($result_check->num_rows > 0) {
    $_SESSION['mensaje_registro'] = ['tipo' => 'error', 'texto' => 'El correo electrónico ya está registrado.'];
    header("Location: ../formulario_registro.html");
    exit(); 
} else {
    $clave_hasheada = password_hash($clave, PASSWORD_DEFAULT);
    $stmt = $conexion->prepare("INSERT INTO usuarios (nombre, cedula, direccion, celular, email, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $nombre, $cedula, $direccion, $celular, $correo, $clave_hasheada);

    if ($stmt->execute()) {
        $mail = new PHPMailer(true);
        try {
            // ... (Toda la configuración de PHPMailer: isSMTP, Host, Username, etc. sigue igual)
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'eldiosapolo10@gmail.com';
            $mail->Password = 'runrhestxkqnhpcx';
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;
            $mail->CharSet = 'UTF-8';

            $mail->setFrom('eldiosapolo10@gmail.com', 'Hulul Software');
            $mail->addAddress($correo, $nombre);
            $mail->isHTML(true);
            $mail->Subject = '¡Bienvenido a Hulul Software!';
            
            // ==========================================================
            // LÓGICA PARA CREAR LA URL DINÁMICA
            // ==========================================================
            $protocolo = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
            $host = $_SERVER['HTTP_HOST']; // Obtiene 'localhost:8080' o 'localhost' automáticamente
            $url_eventos = $protocolo . $host . "/hulul_software_v2/eventos.html";
            // ==========================================================

            $nombre_seguro = htmlspecialchars($nombre);
            // Usamos la nueva URL dinámica en el botón del correo
            $mail->Body = "
            <html>
                ...
                <a href='{$url_eventos}' class='cta-button'>Comienza tu aventura</a>
                ...
            </html>
            "; // (Pega aquí tu HTML completo del correo)
            
            $mail->addEmbeddedImage('C:/xampp/htdocs/hulul_software_v2/img/h.png', 'h_image');
            $mail->send();
            
            $_SESSION['mensaje_login'] = ['tipo' => 'success', 'texto' => '¡Registro exitoso! Ya puedes iniciar sesión.'];
            header("Location: ../login.html");
            exit();

        } catch (Exception $e) {
            $_SESSION['mensaje_login'] = ['tipo' => 'warning', 'texto' => '¡Registro exitoso! Pero no se pudo enviar el correo de bienvenida.'];
            header("Location: ../login.html");
            exit();
        }
    } else {
        $_SESSION['mensaje_registro'] = ['tipo' => 'error', 'texto' => 'Ocurrió un error al registrar tus datos.'];
        header("Location: ../formulario_registro.html");
        exit();
    }
}
$stmt->close();
$conexion->close();
?>