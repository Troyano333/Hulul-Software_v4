<?php
include_once 'conexion.php';

$id_reserva = $_GET['id'] ?? 0;
$mensaje = "";
$clase_css = "";
$detalles_html = ""; // Usaremos una variable para construir el HTML de los detalles

if ($id_reserva > 0) {
    // Seleccionamos las columnas que necesitamos
    $stmt = $conexion->prepare("SELECT id, nombre, apellido, evento, tipo_palco, estado, fecha_uso FROM reservas WHERE id = ?");
    $stmt->bind_param("i", $id_reserva);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $reserva = $result->fetch_assoc();
        
        if ($reserva['estado'] === 'valido') {
            $clase_css = "valido";
            $mensaje = "ACCESO PERMITIDO";

            // ==========================================================
            // NUEVA LÓGICA PARA MÁS DETALLES
            // ==========================================================
            
            // 1. Simulación de mesera asignada (esto en el futuro vendría de la base de datos)
            $meseras = ['Ana García', 'Sofía Rodriguez', 'Valentina Ruiz', 'Camila Osorio'];
            $mesera_asignada = $meseras[array_rand($meseras)];

            // 2. Construimos la tarjeta de detalles con toda la información
            $detalles_html = '
                <div class="details-card">
                    <ul>
                        <li><strong>Cliente:</strong> ' . htmlspecialchars($reserva['nombre'] . ' ' . $reserva['apellido']) . '</li>
                        <li><strong>Evento:</strong> ' . htmlspecialchars($reserva['evento']) . '</li>
                        <li><strong>Zona:</strong> ' . htmlspecialchars($reserva['tipo_palco']) . '</li>
                        <li><strong>ID de Tiquete:</strong> #' . htmlspecialchars($reserva['id']) . '</li>
                        <li><strong>Estado del Pago:</strong> <span class="pago-ok">Completado</span></li>
                        <li><strong>Atendido por:</strong> ' . $mesera_asignada . '</li>
                    </ul>
                </div>
            ';
            
            // Actualizar el estado a 'usado'
            $fecha_uso = date("Y-m-d H:i:s");
            $update_stmt = $conexion->prepare("UPDATE reservas SET estado = 'usado', fecha_uso = ? WHERE id = ?");
            $update_stmt->bind_param("si", $fecha_uso, $id_reserva);
            $update_stmt->execute();
            $update_stmt->close();

        } elseif ($reserva['estado'] === 'usado') {
            $clase_css = "usado";
            $mensaje = "ENTRADA YA UTILIZADA";
            $fecha_uso_formato = date("d/m/Y \a \l\a\s h:i A", strtotime($reserva['fecha_uso']));
            $detalles_html = "<p class='fecha-uso'>Este tiquete fue escaneado el:<br><strong>" . $fecha_uso_formato . "</strong></p>";

        } else {
            $clase_css = "invalido";
            $mensaje = "ENTRADA CANCELADA";
        }
    } else {
        $clase_css = "invalido";
        $mensaje = "TIQUETE INVÁLIDO";
    }
    $stmt->close();
} else {
    $clase_css = "invalido";
    $mensaje = "ERROR";
}
$conexion->close();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validación de Tiquete</title>
    <style>
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; font-family: 'Poppins', Arial, sans-serif; transition: background-color 0.5s ease; }
        .valido { background: linear-gradient(45deg, #28a745, #218838); }
        .usado { background: linear-gradient(45deg, #ffc107, #e0a800); }
        .invalido { background: linear-gradient(45deg, #dc3545, #c82333); }
        .container { color: white; text-align: center; padding: 20px; }
        h1 { font-size: 10vw; margin-bottom: 20px; font-weight: 700; text-shadow: 2px 2px 8px rgba(0,0,0,0.4); }
        
        /* Estilos para la nueva tarjeta de detalles */
        .details-card { background: rgba(255, 255, 255, 0.15); border-radius: 15px; padding: 20px; backdrop-filter: blur(5px); }
        .details-card ul { list-style: none; padding: 0; margin: 0; text-align: left; }
        .details-card li { font-size: 3.5vw; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.2); }
        .details-card li:last-child { border-bottom: none; }
        .details-card strong { font-weight: 700; }
        .pago-ok { color: #c8e6c9; font-weight: bold; }
        .fecha-uso { font-size: 4vw; line-height: 1.5; }

        @media (min-width: 768px) {
            h1 { font-size: 80px; }
            .details-card li { font-size: 22px; }
            .fecha-uso { font-size: 30px; }
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
</head>
<body class="<?php echo $clase_css; ?>">
    <div class="container">
        <h1><?php echo $mensaje; ?></h1>
        <?php echo $detalles_html; // Imprimimos la tarjeta de detalles ?>
    </div>
</body>
</html>