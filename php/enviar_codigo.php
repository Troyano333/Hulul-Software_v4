<?php
// Establece el tipo de contenido a JSON para la comunicación con JavaScript
header('Content-Type: application/json');

// Incluye la conexión a la base de datos
include_once 'conexion.php';

// Incluye la librería PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';
require '../phpmailer/src/Exception.php';

// Prepara la respuesta JSON
$response = ['success' => false, 'message' => ''];

// Obtiene el correo del formulario de forma segura
$email = $_POST['email'] ?? '';

// Valida que el correo no esté vacío y sea un formato válido
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['message'] = 'Por favor, ingresa un correo válido.';
    echo json_encode($response);
    exit;
}

// Prepara y ejecuta la consulta para buscar al usuario y su último cambio de contraseña
$stmt = $conexion->prepare("SELECT email, nombre, last_password_reset FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $usuario = $result->fetch_assoc();

    // Lógica de cooldown de 2 horas
    if ($usuario['last_password_reset'] !== null) {
        $lastResetTime = new DateTime($usuario['last_password_reset']);
        $currentTime = new DateTime();
        $interval = $lastResetTime->diff($currentTime);
        $hours = $interval->h + ($interval->days * 24);

        if ($hours < 2) {
            $remainingHours = 1 - $hours;
            $remainingMinutes = 60 - $interval->i;
            $response['message'] = "Ya has cambiado tu clave recientemente. Podrás solicitar otro cambio en aproximadamente " . ($remainingHours > 0 ? "$remainingHours hora(s) y " : "") . "$remainingMinutes minuto(s).";
            echo json_encode($response);
            exit;
        }
    }

    // Genera un código seguro y su fecha de expiración
    $codigo = random_int(100000, 999999);
    $codigo_hash = password_hash($codigo, PASSWORD_DEFAULT);
    $expiry = date("Y-m-d H:i:s", strtotime('+15 minutes'));

    // Actualiza la base de datos con el nuevo código y la expiración
    $update_stmt = $conexion->prepare("UPDATE usuarios SET reset_token = ?, reset_token_expiry = ? WHERE email = ?");
    $update_stmt->bind_param("sss", $codigo_hash, $expiry, $email);
    
    if ($update_stmt->execute()) {
        $mail = new PHPMailer(true);
        try {
            // Configuración del servidor de correo
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'eldiosapolo10@gmail.com';
            $mail->Password = 'runrhestxkqnhpcx';
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;
            $mail->CharSet = 'UTF-8';

            // Si el nombre no existe, usa el email para evitar errores
            $nombre_destinatario = $usuario['nombre'] ?? $email;

            // Emisor y receptor
            $mail->setFrom('eldiosapolo10@gmail.com', 'Hulul Software');
            $mail->addAddress($email, $nombre_destinatario);
            
            // Contenido del correo
            $mail->isHTML(true);
            
            // ==========================================================
            // CAMBIO: Asunto del correo mejorado
            // ==========================================================
            $mail->Subject = '🔑 Tu Código de Acceso para Hulul Está Aquí';
            
            // ==========================================================
            // CUERPO DEL CORREO HTML PROFESIONAL Y MEJORADO
            // ==========================================================
            $mail->Body = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { margin: 0; padding: 0; background-color: #f4f4f4; }
                table { border-spacing: 0; }
                td { padding: 0; }
                img { border: 0; }
            </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
                <center style="width: 100%; table-layout: fixed; background-color: #f4f4f4; padding-top: 40px; padding-bottom: 40px;">
                    <div style="max-width: 600px; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                        <table style="width: 100%; border-spacing: 0;">
                            <tr>
                                <td style="padding: 20px; text-align: center; background-color: #2c2c2c;">
                                    <a href="http://localhost/hului_software_v2/" target="_blank">
                                        <img src="cid:h_image" alt="Hulul Logo" style="max-width: 100px;">
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 40px 30px; font-family: Arial, sans-serif; color: #333333; font-size: 16px; line-height: 1.6;">
                                    <h1 style="font-family: \'Poppins\', sans-serif; color: #2c2c2c; text-align: center; margin-bottom: 20px; font-size: 24px;">Tu Código de Verificación</h1>
                                    <p style="margin-bottom: 25px;">Hola, ' . htmlspecialchars($nombre_destinatario) . ':</p>
                                    <p style="margin-bottom: 25px;">Usa el siguiente código para restablecer la contraseña de tu cuenta en Hulul.</p>
                                    
                                    <div style="text-align: center; margin: 30px 0;">
                                        <p style="display: inline-block; background-color: #f0f2f5; padding: 15px 30px; border-radius: 8px; font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #2c2c2c; margin: 0;">
                                            ' . $codigo . '
                                        </p>
                                    </div>

                                    <p style="text-align: center; font-size: 14px; color: #888888; margin-top: 20px; margin-bottom: 25px;">
                                        Por tu seguridad, este código expirará en <strong>15 minutos</strong>.
                                    </p>

                                    <p style="margin-bottom: 15px;">Si no solicitaste un cambio de contraseña, puedes ignorar este correo electrónico de forma segura.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 30px 20px 30px;">
                                    <div style="background-color: #fffbe6; border: 1px solid #ffe58f; border-radius: 8px; padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 14px; color: #8a6d3b;">
                                        <strong style="font-weight: bold;">¡Importante!</strong> Nunca compartas este código con nadie. Nuestro personal nunca te lo pedirá.
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 30px; text-align: center; background-color: #f4f4f4; font-family: Arial, sans-serif; font-size: 12px; color: #888888;">
                                    <p style="margin: 0;">© ' . date("Y") . ' Hulul Software. Todos los derechos reservados.</p>
                                    <p style="margin: 5px 0 0 0;">Cartagena, Colombia</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </center>
            </body>
            </html>
            ';

            $mail->addEmbeddedImage('../img/h.png', 'h_image');
            
            $mail->send();
            $response['success'] = true;
        } catch (Exception $e) {
            $response['message'] = "No se pudo enviar el código. Error: {$mail->ErrorInfo}";
        }
    } else {
        $response['message'] = "Error al preparar la solicitud en la base de datos.";
    }

} else {
    $response['message'] = 'El correo no está registrado.';
}

echo json_encode($response);
$stmt->close();
$conexion->close();
?>