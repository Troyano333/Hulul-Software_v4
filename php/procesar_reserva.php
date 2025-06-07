<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'] ?? '';
    $apellido = $_POST['apellido'] ?? '';
    $correo = $_POST['email'] ?? '';
    $telefono = $_POST['telefono'] ?? '';
    $eventoSeleccionado = $_POST['eventoSeleccionado'] ?? '';
    $zonaSeleccionada = $_POST['zonaSeleccionada'] ?? '';
    $fechaEvento = $_POST['fechaEvento'] ?? '';
    $horaEvento = $_POST['horaEvento'] ?? '';
    $lugar = $_POST['lugar'] ?? '';

    // Preparar los datos en un array asociativo
    $reserva = [
        'nombre' => $nombre,
        'apellido' => $apellido,
        'correo' => $correo,
        'telefono' => $telefono,
        'eventoSeleccionado' => $eventoSeleccionado,
        'zonaSeleccionada' => $zonaSeleccionada,
        'fechaEvento' => $fechaEvento,
        'horaEvento' => $horaEvento,
        'lugar' => $lugar
    ];

    // Convertir el array a JSON y almacenarlo en sessionStorage
    $json = json_encode($reserva, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);

    echo "<script>
        sessionStorage.setItem('reserva', '$json');
        window.location.href = '../confirmacion_pago.html';
    </script>";
} else {
    echo "No hay datos de reserva.";
}
?>
