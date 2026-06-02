// src/pages/CarritoPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/cart/CartContext";
import { getGuitarraByNumserie } from "../modules/guitarras/services/guitarra.service";
import type { Guitarra } from "../modules/guitarras/types/guitarra";
import { apiFetch } from "../utils/api";
import { config } from "../config/enviroment";
import { useAuth } from "../contexts/auth/AuthContext";

type CartLine = {
    idProducto: number;
    quantity: number;
    guitarra: Guitarra | null;
    loading: boolean;
    error: string | null;
};

const CarritoPage: React.FC = () => {
    const { items, totalItems, setQuantity, removeItem, clear } = useCart();

    const [lines, setLines] = useState<CartLine[]>([]);

    useEffect(() => {
        let cancelled = false;

        const next: CartLine[] = items.map((it) => ({
            idProducto: it.productId,
            quantity: it.quantity,
            guitarra: null,
            loading: true,
            error: null,
        }));
        setLines(next);

        const run = async () => {
            const results: CartLine[] = await Promise.all(
                items.map(async (it) => {
                    try {
                        // Si tu servicio aún busca por "numserie", pero ahora usas id de producto,
                        // se pasa como string hasta que migres el endpoint/servicio a "getGuitarraById".
                        const guitarra = await getGuitarraByNumserie(String(it.productId));

                        return {
                            idProducto: it.productId,
                            quantity: it.quantity,
                            guitarra,
                            loading: false,
                            error: guitarra ? null : "No encontrada",
                        };
                    } catch (e) {
                        return {
                            idProducto: it.productId,
                            quantity: it.quantity,
                            guitarra: null,
                            loading: false,
                            error: e instanceof Error ? e.message : "Error al cargar",
                        };
                    }
                })
            );

            if (!cancelled) setLines(results);
        };

        void run();
        return () => {
            cancelled = true;
        };
    }, [items]);

    const subtotal = useMemo(() => {
        return lines.reduce((acc, l) => {
            if (!l.guitarra) return acc;
            return acc + l.guitarra.precio * l.quantity;
        }, 0);
    }, [lines]);

    const { user } = useAuth();
    const [creating, setCreating] = useState(false);
    const [direccionEntregaId, setDireccionEntregaId] = useState<number>(1);
    const [direccionFacturacionId, setDireccionFacturacionId] = useState<number>(2);

    const handleProceedToCheckout = async () => {
        if (items.length === 0) return;
        try {
            setCreating(true);

            const payload = {
                cartItems: items.map(it => ({ guitarraid: it.productId, cantidad: it.quantity })),
                direccionEntregaId: direccionEntregaId,
                direccionFacturacionId: direccionFacturacionId,
                email: user?.email ?? '',
                nombreCliente: user?.nombreCompleto ?? user?.nomusuario ?? 'Cliente'
            };

            console.log('Checkout payload (obj):', payload);
            console.log('Checkout payload (json):', JSON.stringify(payload));

            const res = await apiFetch(`${config.url.API_BASE_URL}/api/checkout/create-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                throw new Error(body?.message || `Create session failed: ${res.status}`);
            }

            const body = await res.json().catch(() => null);
            if (body && body.sessionUrl) {
                // redirección top-level a Stripe
                window.location.assign(body.sessionUrl);
                return;
            }
            throw new Error('sessionUrl not returned by backend');
        } catch (e: any) {
            console.error('Error creating session', e);
            alert(e?.message || 'Error al crear la sesión');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Carrito</h1>
                <Link to="/guitarra/stock">Seguir comprando</Link>
            </div>

            {items.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <>
                    <p style={{ opacity: 0.8 }}>Artículos: {totalItems}</p>

                    <table border={1} cellPadding={8} style={{ width: "100%" }}>
                        <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Id Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {lines.map((l) => (
                            <tr key={l.idProducto}>
                                <td>
                                    {l.loading ? (
                                        "Cargando…"
                                    ) : l.guitarra ? (
                                        <Link to={`/guitarra/${encodeURIComponent(String(l.guitarra.id))}`}>
                                            Ver guitarra
                                        </Link>
                                    ) : (
                                        <span style={{ color: "#b91c1c" }}>No disponible</span>
                                    )}
                                    {l.error ? <div style={{ fontSize: 12, color: "#b91c1c" }}>{l.error}</div> : null}
                                </td>
                                <td>{l.idProducto}</td>
                                <td>{l.guitarra ? `${l.guitarra.precio} €` : "—"}</td>
                                <td>
                                    <input
                                        type="number"
                                        min={1}
                                        value={l.quantity}
                                        onChange={(e) => setQuantity(l.idProducto, Number(e.target.value || 1))}
                                        style={{ width: 72 }}
                                    />
                                </td>
                                <td>{l.guitarra ? `${l.guitarra.precio * l.quantity} €` : "—"}</td>
                                <td>
                                    <button onClick={() => removeItem(l.idProducto)} disabled={l.loading}>
                                        Quitar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, alignItems: 'center' }}>
                        <div>
                            <button onClick={clear}>Vaciar carrito</button>
                        </div>
                        <div style={{ textAlign: "right", minWidth: 260 }}>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Total:</strong> {subtotal} €
                            </div>
                            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
                                El total se recalculará en el checkout con precios/stock actuales.
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                                <label style={{ fontSize: 12 }}>Dir. entrega:</label>
                                <input type="number" min={1} value={direccionEntregaId} onChange={e => setDireccionEntregaId(Number(e.target.value || 1))} style={{ width: 80 }} />
                                <label style={{ fontSize: 12 }}>Dir. facturación:</label>
                                <input type="number" min={1} value={direccionFacturacionId} onChange={e => setDireccionFacturacionId(Number(e.target.value || 2))} style={{ width: 80 }} />
                            </div>
                            <button
                                onClick={handleProceedToCheckout}
                                disabled={creating || items.length === 0}
                                style={{
                                    backgroundColor: creating ? '#999' : '#007bff',
                                    color: 'white',
                                    padding: '8px 12px',
                                    border: 'none',
                                    borderRadius: 4,
                                    cursor: creating ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {creating ? 'Creando sesión...' : 'Proceder al pago'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CarritoPage;
