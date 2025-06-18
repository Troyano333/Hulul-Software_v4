<?php
session_start();

// Usamos tu PHPMailer manual que sabemos que funciona
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';
require '../phpmailer/src/Exception.php';

include_once 'conexion.php'; 

// Recoger los datos del formulario
$nombre = $_POST["nombre"] ?? '';
$cedula = $_POST["cedula"] ?? '';
$direccion = $_POST["direccion"] ?? '';
$celular = $_POST["celular"] ?? '';
$correo = $_POST["email"] ?? '';
$clave = $_POST["contrasena"] ?? '';

// Usar consultas preparadas para verificar si el correo ya existe
$stmt = $conexion->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$result_check = $stmt->get_result();

if ($result_check->num_rows > 0) {
    $_SESSION['mensaje_registro'] = ['tipo' => 'error', 'texto' => 'El correo electrónico ya está registrado.'];
    header("Location: ../formulario_registro.html");
    exit(); 
} else {
    // Hashear la contraseña
    $clave_hasheada = password_hash($clave, PASSWORD_DEFAULT);

    // Usar consultas preparadas para insertar el nuevo usuario
    $stmt = $conexion->prepare("INSERT INTO usuarios (nombre, cedula, direccion, celular, email, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $nombre, $cedula, $direccion, $celular, $correo, $clave_hasheada);

    if ($stmt->execute()) {
        $mail = new PHPMailer(true);
        try {
            // Configuración del servidor
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'eldiosapolo10@gmail.com';
            $mail->Password = 'runrhestxkqnhpcx';
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;
            $mail->CharSet = 'UTF-8';

            // Emisor y receptor
            $mail->setFrom('eldiosapolo10@gmail.com', 'Hulul Software');
            $mail->addAddress($correo, $nombre);
            $mail->isHTML(true);
            $mail->Subject = '¡Bienvenido a Hulul Software!';
            
            // Lógica para crear la URL dinámica
            $protocolo = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
            $host = $_SERVER['HTTP_HOST'];
            $ruta_proyecto = dirname(dirname($_SERVER['PHP_SELF']));
            $url_eventos = $protocolo . $host . $ruta_proyecto . "/eventos.html";

            // Usar htmlspecialchars para seguridad en el nombre
            $nombre_seguro = htmlspecialchars($nombre);
            
            // ==========================================================
            // CUERPO DEL CORREO HTML ORIGINAL (RESTAURADO)
            // ==========================================================
            $mail->Body = "
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
                    .header { text-align: center; color: #FFD700; }
                    .header img { width: 150px; height: auto; margin-bottom: 20px; }
                    .content { margin-top: 20px; }
                    .cta-button { display: inline-block; padding: 10px 20px; background-color: #FFD700; color: black; font-weight: bold; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 40px; color: #777; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <img src='cid:h_image' alt='Hulul Software Logo' />
                        <h1>¡Bienvenido a Hulul Software, {$nombre_seguro}!</h1>
                    </div>
                    <div class='content'>
                        <p>Nos complace tenerte como parte de nuestra comunidad en <strong>Hulul Software</strong>. ¡Estamos muy emocionados de que hayas decidido unirte a nosotros!</p>
                        <p>Aquí, en <strong>Hulul Software</strong>, nuestra misión es brindarte una experiencia única y eficiente en el mundo de la gestión de eventos. Estamos comprometidos en hacer que cada interacción con nuestra plataforma sea fácil, agradable y, sobre todo, exitosa.</p>
                        <p>Con nuestra herramienta, podrás organizar, gestionar y acceder a eventos de una manera rápida y sencilla. Ya sea que busques conciertos, conferencias o cualquier tipo de evento, en <strong>Hulul Software</strong> lo tenemos cubierto.</p>
                        <p><strong>¿Qué puedes esperar?</strong></p>
                        <ul>
                            <li>Acceso a eventos exclusivos y ofertas especiales.</li>
                            <li>Una plataforma fácil de usar para que puedas gestionar tu experiencia.</li>
                            <li>Soporte continuo para cualquier duda que tengas.</li>
                        </ul>
                        <p>Te invitamos a explorar todas nuestras características y empezar a disfrutar de la experiencia completa. Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nuestro equipo.</p>
                        <a href='{$url_eventos}' class='cta-button'>Comienza tu aventura</a>
                    </div>
                    <div class='footer'>
                        <p>Gracias por confiar en nosotros.</p>
                        <p>El equipo de <strong>Hulul Software</strong></p>
                    </div>
                </div>
            </body>
            </html>
            ";
            
            // Usamos tu ruta original para la imagen
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