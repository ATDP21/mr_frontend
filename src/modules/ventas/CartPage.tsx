import React, { useState } from 'react';
import {apiFetch} from "../../utils/api";
import {config} from "../../config/enviroment";

function CartPage() {
    const [cartItems] = useState([
        { id: 1, name: 'Premium Plan', price: 2999, quantity: 1 },
        { id: 2, name: 'Add-on Feature', price: 999, quantity: 2 }
    ]);
    // En este flujo redirigimos al backend/Stripe; no usamos clientSecret embebido aquí.

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleProceedToCheckout = async () => {
        try {
            // Construir payload según contrato backend
            const payload = {
                cartItems: cartItems.map(item => ({
                    guitarraid: item.id,
                    cantidad: item.quantity
                })),
                direccionEntregaId: 0, // TODO: sustituir por la id real de direccion
                direccionFacturacionId: 0, // TODO: sustituir por la id real de direccion
                email: "cliente@example.com", // TODO: recoger del formulario / usuario
                nombreCliente: "Cliente Ejemplo"
            };

            console.log("Checkout payload (obj):", payload);
            console.log("Checkout payload (json):", JSON.stringify(payload));

            // apiFetch ya añade credentials: 'include' y X-XSRF-TOKEN para métodos mutantes
            const response = await apiFetch(
                `${config.url.API_BASE_URL}/api/checkout/create-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                console.error('create-session failed', response.status, body);
                alert(body?.message || 'No se pudo iniciar la sesión de pago');
                return;
            }

            const data = await response.json();

            // Esperamos { sessionId, sessionUrl, clientSecret, status }
            const { sessionUrl, sessionId } = data || {};
            if (sessionUrl) {
                // Redirigir al checkout de Stripe (top-level navigation)
                window.location.assign(sessionUrl);
            } else {
                console.error('Respuesta inesperada de create-session', data);
                alert('Respuesta inesperada del servidor al crear la sesión de pago');
            }
        } catch (error) {
            console.error("Error al crear la sesión de pago:", error);
            alert('Error de red o servidor al crear la sesión de pago');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2>Your Cart</h2>

            {/* Cart Items Display */}
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                {cartItems.map(item => (
                    <div key={item.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 0',
                        borderBottom: '1px solid #eee'
                    }}>
                        <div>
                            <h4>{item.name}</h4>
                            <p>Quantity: {item.quantity}</p>
                        </div>
                        <div>
                            <strong>${(item.price * item.quantity / 100).toFixed(2)}</strong>
                        </div>
                    </div>
                ))}

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '20px',
                    fontSize: '18px',
                    fontWeight: 'bold'
                }}>
                    <span>Total:</span>
                    <span>${(totalAmount / 100).toFixed(2)}</span>
                </div>
            </div>

            {/* Checkout Section: redirección top-level al backend/Stripe */}
            <button
                onClick={handleProceedToCheckout}
                style={{
                    backgroundColor: '#635bff',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    width: '100%'
                }}
            >
                Proceed to Payment
            </button>
        </div>
    );
}

export default CartPage;