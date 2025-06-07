    // SCRIPT PRINCIPAL PARA FORMULARIO, MODAL DE PAGO Y NOTIFICACIONES TOAST
        document.addEventListener('DOMContentLoaded', function () {
            const toastPlacement = document.getElementById('toastPlacement');

            function showToastNotification(message, type = 'info', title = 'Notificación', autohide = true, delay = 6000) {
                const toastId = 'toast-' + Date.now();
                const toastHTML = `
                    <div id="${toastId}" class="toast ${type} fade" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="${delay}" data-bs-autohide="${autohide}">
                        <div class="toast-header">
                            <img src="./img/h.png" class="toast-logo" alt="Hulul Logo">
                            <strong class="me-auto toast-title-text">${title}</strong>
                            <small class="text-muted opacity-75">Ahora</small>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body">
                            ${message} 
                        </div>
                    </div>
                `;
                // Los comentarios {/**/} fueron eliminados del HTML del toast
                toastPlacement.insertAdjacentHTML('beforeend', toastHTML);
                const toastElement = document.getElementById(toastId);
                const toast = new bootstrap.Toast(toastElement);
                
                toastElement.addEventListener('hidden.bs.toast', function () {
                    toastElement.remove();
                });
                toast.show();
            }

            if (window.location.protocol === 'file:') {
                showToastNotification(
                    '<strong>ERROR CRÍTICO PARA PAYPAL:</strong><br>Esta página se está ejecutando como un archivo local (file:///...). Para que PayPal funcione, <strong>DEBES</strong> servirla vía HTTP/HTTPS.<br>Usa "Live Server" en VS Code o similar.',
                    'error', 'Error de Configuración del Entorno', false
                );
                const submitButton = document.querySelector('button[type="submit"]');
                if(submitButton) {
                    submitButton.disabled = true;
                    submitButton.title = "PayPal no puede funcionar en modo 'file:///'";
                    submitButton.classList.add('disabled');
                }
                return; 
            }

            const formReserva = document.getElementById('formReserva');
            const paymentModalElement = document.getElementById('paymentMethodModal');
            const paymentModal = new bootstrap.Modal(paymentModalElement);
            const modalTotalPriceElement = document.getElementById('modalTotalPrice');
            
            const summaryEvento = document.getElementById('summaryEvento');
            const summaryZona = document.getElementById('summaryZona');
            const summaryFecha = document.getElementById('summaryFecha');

            let paypalButtonsRendered = false;

            if (formReserva) {
                formReserva.addEventListener('submit', function (event) {
                    event.preventDefault(); 
                    const nombre = document.getElementById('nombre').value;
                    const apellido = document.getElementById('apellido').value;
                    const email = document.getElementById('email').value;
                    const telefono = document.getElementById('telefono').value;
                    const precioZonaInput = document.getElementById('precioZona').value;
                    const eventoSeleccionado = document.getElementById('eventoSeleccionado').value;
                    const zonaSeleccionada = document.getElementById('zonaSeleccionada').value;
                    const fechaEvento = document.getElementById('fechaEvento').value;

                    if (!nombre || !apellido || !email || !telefono) {
                        showToastNotification('Por favor, completa todos tus <strong>datos personales</strong>.', 'warning', 'Datos Incompletos');
                        return;
                    }
                    if (!email.includes('@') || !email.includes('.')) {
                        showToastNotification('Por favor, ingresa un <strong>correo electrónico válido</strong>.', 'warning', 'Dato Inválido');
                        return;
                    }
                     if (!eventoSeleccionado || !zonaSeleccionada) {
                        showToastNotification('Asegúrate de haber seleccionado un <strong>evento y una zona</strong> previamente.', 'warning', 'Selección Incompleta');
                        return;
                    }
                    if (!precioZonaInput || precioZonaInput === "Precio no disponible") {
                        showToastNotification('<strong>Error:</strong> El precio de la zona no está disponible. Verifica la selección.', 'error', 'Error de Precio');
                        return;
                    }
                    
                    if(summaryEvento) summaryEvento.textContent = eventoSeleccionado;
                    if(summaryZona) summaryZona.textContent = zonaSeleccionada;
                    if(summaryFecha) summaryFecha.textContent = fechaEvento;
                    modalTotalPriceElement.textContent = precioZonaInput; 

                    paymentModal.show();

                    if (!paypalButtonsRendered && document.getElementById('paypal-button-container-modal')) {
                        renderPayPalButtons();
                        paypalButtonsRendered = true;
                    }
                });
            }

            function renderPayPalButtons() {
                if (typeof paypal === 'undefined') {
                    showToastNotification("<strong>Error:</strong> El SDK de PayPal no se cargó. Revisa tu conexión o la consola.", 'error', 'Error SDK PayPal', false);
                    return;
                }

                paypal.Buttons({
                    style: { 
                        layout: 'vertical', color:  'blue', shape:  'rect', label:  'paypal', tagline: false 
                    },
                    createOrder: function(data, actions) {
                        const precioDePrueba = '10.00'; 
                        const monedaDePrueba = 'USD';
                        
                        return actions.order.create({
                            purchase_units: [{
                                amount: { value: precioDePrueba, currency_code: monedaDePrueba },
                                description: `(Prueba) Reserva: ${document.getElementById('eventoSeleccionado').value || 'Evento Hulul'} - Zona: ${document.getElementById('zonaSeleccionada').value || 'General'}`
                            }]
                        });
                    },
                    onApprove: function(data, actions) {
                        paymentModal.hide(); 
                        showToastNotification('Procesando tu pago... <i class="bi bi-stopwatch ms-2"></i>', 'info', 'Procesando Pago', false);
                        
                        return actions.order.capture().then(function(details) {
                            const existingProcessingToast = bootstrap.Toast.getInstance(document.querySelector('.toast.info[id^="toast-"]'));
                            if (existingProcessingToast) {
                                existingProcessingToast.hide();
                            }

                            showToastNotification('¡Tu pago ha sido <strong>realizado con éxito</strong>!<br>Redirigiendo a la confirmación...', 'success', '¡Pago Exitoso!', true, 4000);

                            const paramsParaConfirmacion = new URLSearchParams();
                            paramsParaConfirmacion.append('nombre', document.getElementById('nombre').value);
                            paramsParaConfirmacion.append('apellido', document.getElementById('apellido').value);
                            paramsParaConfirmacion.append('email', document.getElementById('email').value);
                            paramsParaConfirmacion.append('telefono', document.getElementById('telefono').value);
                            paramsParaConfirmacion.append('evento', document.getElementById('eventoSeleccionado').value);
                            paramsParaConfirmacion.append('zona', document.getElementById('zonaSeleccionada').value);
                            paramsParaConfirmacion.append('fecha', document.getElementById('fechaEvento').value);
                            paramsParaConfirmacion.append('hora', document.getElementById('horaEvento').value);
                            paramsParaConfirmacion.append('lugar', document.getElementById('lugar').value); 
                            paramsParaConfirmacion.append('precio', details.purchase_units[0].payments.captures[0].amount.value);
                            paramsParaConfirmacion.append('currency_code', details.purchase_units[0].payments.captures[0].amount.currency_code);
                            paramsParaConfirmacion.append('transaction_id', details.id);
                            paramsParaConfirmacion.append('status', details.status); 
                            paramsParaConfirmacion.append('payer_email', details.payer.email_address);
                            
                            setTimeout(() => {
                                window.location.href = "confirmacion_pago.html?" + paramsParaConfirmacion.toString();
                            }, 3500); 

                        }).catch(function(error) {
                             const existingProcessingToast = bootstrap.Toast.getInstance(document.querySelector('.toast.info[id^="toast-"]'));
                            if (existingProcessingToast) {
                                existingProcessingToast.hide();
                            }
                            showToastNotification('<strong>Error al procesar el pago:</strong><br>' + (error.message || "Por favor, intenta de nuevo."), 'error', 'Error de Pago');
                        });
                    },
                    onCancel: function(data) {
                        showToastNotification('Has <strong>cancelado</strong> el proceso de pago.', 'info', 'Pago Cancelado');
                    },
                    onError: function(err) {
                        showToastNotification('Ha ocurrido un <strong>error con PayPal.</strong> Intenta más tarde.<br><small>Detalle: ' + err.message + '</small>', 'error', 'Error de PayPal', false);
                        paymentModal.hide(); 
                    }
                }).render('#paypal-button-container-modal'); 
            }
        });




         // SCRIPT PARA CARGAR DATOS DESDE localStorage
        document.addEventListener("DOMContentLoaded", () => {
            const evento = localStorage.getItem("eventoSeleccionado");
            const fecha = localStorage.getItem("fechaEvento");
            const hora = localStorage.getItem("horaEvento");
            const zona = localStorage.getItem("zonaSeleccionada");
            const lugarEvento = localStorage.getItem("lugarEvento");
            const precios = {
                "Palco VIP": "$1.800.000 COP", "Palco Plata": "$1.200.000 COP", "Palco Bronce": "$850.000 COP",
                "Mesa VIP": "$1.000.000 COP", "Mesa Plata": "$700.000 COP", "Mesa Bronce": "$450.000 COP"
            };
            if (evento) document.getElementById("eventoSeleccionado").value = evento;
            if (fecha) document.getElementById("fechaEvento").value = fecha;
            if (hora) document.getElementById("horaEvento").value = hora;
            if (zona) {
                document.getElementById("zonaSeleccionada").value = zona;
                document.getElementById("precioZona").value = precios[zona] || "Precio no disponible";
            }
            const lugarSelect = document.getElementById("lugar");
            if (lugarSelect && lugarEvento) {
                let found = false;
                for (let i = 0; i < lugarSelect.options.length; i++) {
                    if (lugarSelect.options[i].value === lugarEvento) {
                        lugarSelect.selectedIndex = i; found = true; break;
                    }
                }
                if (!found) {
                    const optLugarEvento = document.createElement("option");
                    optLugarEvento.value = lugarEvento;
                    optLugarEvento.textContent = `${lugarEvento} (Lugar del Evento)`;
                    lugarSelect.appendChild(optLugarEvento);
                    optLugarEvento.selected = true; 
                }
            }
        });