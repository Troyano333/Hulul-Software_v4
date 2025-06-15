
function generarPayuButton(reserva) {
    document.getElementById('payu-button-container').innerHTML = "";

    const precios = {
        "Palco VIP": 1800000,
        "Palco Plata": 1200000,
        "Palco Bronce": 850000,
        "Mesa VIP": 1000000,
        "Mesa Plata": 700000,
        "Mesa Bronce": 450000,
    };
    let valor = precios[reserva.zona] || 1000000;
    let valorFormato = Number(valor).toFixed(2);

    let referencia = "RESERVA-" + Math.floor(Math.random() * 1000000);
    let descripcion = `Reserva ${reserva.zona} - ${reserva.evento}`;

    // Firma PayU modo SANDBOX
    const apiKey = "4Vj8eK4rloUd272L48hsrarnUA";
    const merchantId = "508029";
    const signature = md5(`${apiKey}~${merchantId}~${referencia}~${valorFormato}~COP`);

    let form = `
                <form method="POST" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/" target="_blank" id="formPayU">
                    <input name="merchantId" type="hidden" value="${merchantId}" />
                    <input name="accountId" type="hidden" value="512321" />
                    <input name="description" type="hidden" value="${descripcion}" />
                    <input name="referenceCode" type="hidden" value="${referencia}" />
                    <input name="amount" type="hidden" value="${valorFormato}" />
                    <input name="tax" type="hidden" value="0" />
                    <input name="taxReturnBase" type="hidden" value="0" />
                    <input name="currency" type="hidden" value="COP" />
                    <input name="signature" type="hidden" value="${signature}" />
                    <input name="test" type="hidden" value="1" />
                    <input name="buyerEmail" type="hidden" value="${reserva.email}" />
                    <input name="responseUrl" type="hidden" value="${window.location.origin}/confirmacion_pago.html" />
                    <input name="confirmationUrl" type="hidden" value="${window.location.origin}/confirmacion_pago.html" />
                    <button type="submit" class="btn btn-success w-100">
                        <img src="https://static.payulatam.com/img-secure-merchant/img/boton_pagar_mediano.png" alt="Pagar con PayU" style="height: 30px; vertical-align: middle;">
                    </button>
                </form>
            `;
    document.getElementById('payu-button-container').innerHTML = form;
}

// AL ENVIAR EL FORMULARIO
document.getElementById('formReserva').addEventListener('submit', function (e) {
    e.preventDefault();

    // Resumen
    document.getElementById('summaryEvento').innerText = document.getElementById('eventoSeleccionado').value;
    document.getElementById('summaryZona').innerText = document.getElementById('zonaSeleccionada').value;
    document.getElementById('summaryFecha').innerText = document.getElementById('fechaEvento').value;
    document.getElementById('modalTotalPrice').innerText = document.getElementById('precioZona').value;

    // Datos PayU
    const reserva = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        evento: document.getElementById('eventoSeleccionado').value,
        zona: document.getElementById('zonaSeleccionada').value
    };
    generarPayuButton(reserva);

    // Mostrar modal de métodos de pago
    var paymentModal = new bootstrap.Modal(document.getElementById('paymentMethodModal'));
    paymentModal.show();
});

// Botón de pagar en sitio (flujo igual que antes)
document.getElementById('payOnSiteButton').addEventListener('click', function (event) {
    event.preventDefault();
    const params = new URLSearchParams();
    params.append('nombre', document.getElementById('nombre').value);
    params.append('apellido', document.getElementById('apellido').value);
    params.append('email', document.getElementById('email').value);
    params.append('telefono', document.getElementById('telefono').value);
    params.append('evento', document.getElementById('eventoSeleccionado').value);
    params.append('zona', document.getElementById('zonaSeleccionada').value);
    params.append('precio', document.getElementById('precioZona').value);
    params.append('fecha', document.getElementById('fechaEvento').value);
    params.append('hora', document.getElementById('horaEvento').value);
    params.append('lugar', document.getElementById('lugar').value);

    window.location.href = `pago_pendiente.html?${params.toString()}`;
});
    