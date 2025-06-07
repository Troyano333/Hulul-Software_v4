<?php
session_start();  // Inicia la sesión para manejar el mensaje

include_once 'conexion.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';
require '../phpmailer/src/Exception.php';

$nombre = $_POST["nombre"];
$cedula = $_POST["cedula"];
$direccion = $_POST["direccion"];
$celular = $_POST["celular"];
$correo = $_POST["email"];
$clave = $_POST["contrasena"];

// Verificar si el correo ya está registrado en la base de datos
$sql_check = "SELECT * FROM usuarios WHERE email = '$correo'";
$result_check = $conexion->query($sql_check);

if ($result_check->num_rows > 0) {
    // El correo ya está registrado
    $_SESSION['mensaje_error'] = "El correo electrónico ya está registrado. Por favor, utiliza otro correo.";
    // Redirigir a la misma página para mostrar el mensaje
    header("Location: ../formulario_registro.html");
    exit(); 
} else {
    // Insertar los datos en la base de datos si el correo no está registrado
    $sql = "INSERT INTO usuarios (nombre, cedula, direccion, celular, email, contrasena) 
            VALUES ('$nombre', '$cedula', '$direccion', '$celular', '$correo', '$clave')";

    if ($conexion->query($sql) === TRUE) {
        echo "Registro exitoso.";

        // Configurar PHPMailer para enviar el correo de bienvenida
        $mail = new PHPMailer(true);
        $correoEnviado = false; // Variable para verificar si el correo se envió correctamente

        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'eldiosapolo10@gmail.com';  // Usa la dirección de correo de Gmail
            $mail->Password = 'runrhestxkqnhpcx'; // Contraseña de aplicación de Gmail
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            $mail->setFrom('eldiosapolo10@gmail.com', 'Hulul Software');
            $mail->addAddress($correo, $nombre);
            $mail->Subject = '¡Bienvenido a Hulul Software!';

            // Crear el cuerpo del mensaje
            $mail->Body = "
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333;
                        line-height: 1.6;
                        background-color: #f4f4f4;
                    }
                    .container {
                        width: 80%;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        color: #FFD700; /* Color dorado */
                    }
                    .header img {
                        width: 150px;
                        height: auto;
                        margin-bottom: 20px;
                    }
                    .content {
                        margin-top: 20px;
                    }
                    .cta-button {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #FFD700; /* Color dorado */
                        color: black;
                        font-weight: bold;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        color: #777;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <!-- Incrustar la imagen como CID -->
                        <img src='cid:h_image' alt='Hulul Software Logo' />
                        <h1>¡Bienvenido a Hulul Software, $nombre!</h1>
                    </div>
                    <div class='content'>
                        <p>Nos complace tenerte como parte de nuestra comunidad en **Hulul Software**. ¡Estamos muy emocionados de que hayas decidido unirte a nosotros!</p>
                        <p>Aquí, en **Hulul Software**, nuestra misión es brindarte una experiencia única y eficiente en el mundo de la gestión de eventos. Estamos comprometidos en hacer que cada interacción con nuestra plataforma sea fácil, agradable y, sobre todo, exitosa.</p>
                        <p>Con nuestra herramienta, podrás organizar, gestionar y acceder a eventos de una manera rápida y sencilla. Ya sea que busques conciertos, conferencias o cualquier tipo de evento, en **Hulul Software** lo tenemos cubierto.</p>
                        <p><strong>¿Qué puedes esperar?</strong></p>
                        <ul>
                            <li>Acceso a eventos exclusivos y ofertas especiales.</li>
                            <li>Una plataforma fácil de usar para que puedas gestionar tu experiencia.</li>
                            <li>Soporte continuo para cualquier duda que tengas.</li>
                        </ul>
                        <p>Te invitamos a explorar todas nuestras características y empezar a disfrutar de la experiencia completa. Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nuestro equipo.</p>
                        <a href='http://localhost/hulul_software_v2/eventos.html' class='cta-button'>Comienza tu aventura</a>
                    </div>
                    <div class='footer'>
                        <p>Gracias por confiar en nosotros.</p>
                        <p>El equipo de <strong>Hulul Software</strong></p>
                    </div>
                </div>
            </body>
            </html>
            ";

            $mail->isHTML(true);

            // Ruta a la imagen incrustada en el correo
            // Cambia la ruta de la imagen por la correcta en tu sistema
            $mail->addEmbeddedImage('C:/xampp/htdocs/hulul_software_v2/img/h.png', 'h_image');

            // Enviar el correo
            $mail->send();
            echo " Correo enviado.";
            $correoEnviado = true; // Si el correo fue enviado correctamente
        } catch (Exception $e) {
            echo " Pero no se pudo enviar el correo. Error: {$mail->ErrorInfo}";
        }

        // Verificar si tanto el registro como el correo fueron exitosos
        if ($correoEnviado) {
            // Redirigir a eventos.html si todo fue exitoso
            header("Location: http://localhost:8080/hulul_software_v2/eventos.html");
            exit(); // Detener la ejecución después de la redirección
        }

    } else {
        echo "Error en la base de datos: " . $conexion->error;
    }
}

$conexion->close();
?>
