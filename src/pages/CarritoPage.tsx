import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/cart/CartContext";
import { getGuitarraByNumserie } from "../modules/guitarras/services/guitarra.service";
import type { Guitarra } from "../modules/guitarras/types/guitarra";

type CartLine = {
    numserie: string;
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
            numserie: it.numserie,
            quantity: it.quantity,
            guitarra: null,
            loading: true,
            error: null,
        }));
        setLines(next);

        const run = async () => {
            const results = await Promise.all(
                items.map(async (it) => {
                    try {
                        const guitarra = await getGuitarraByNumserie(it.numserie);
                        return {
                            numserie: it.numserie,
                            quantity: it.quantity,
                            guitarra,
                            loading: false,
                            error: guitarra ? null : "No encontrada",
                        } as CartLine;
                    } catch (e) {
                        return {
                            numserie: it.numserie,
                            quantity: it.quantity,
                            guitarra: null,
                            loading: false,
                            error: e instanceof Error ? e.message : "Error al cargar",
                        } as CartLine;
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
                                <th>Nº Serie</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {lines.map((l) => (
                                <tr key={l.numserie}>
                                    <td>
                                        {l.loading ? (
                                            "Cargando…"
                                        ) : l.guitarra ? (
                                            <Link to={`/guitarra/${encodeURIComponent(l.guitarra.numserie)}`}>Ver guitarra</Link>
                                        ) : (
                                            <span style={{ color: "#b91c1c" }}>No disponible</span>
                                        )}
                                        {l.error ? <div style={{ fontSize: 12, color: "#b91c1c" }}>{l.error}</div> : null}
                                    </td>
                                    <td>{l.numserie}</td>
                                    <td>{l.guitarra ? `${l.guitarra.precio} €` : "—"}</td>
                                    <td>
                                        <input
                                            type="number"
                                            min={1}
                                            value={l.quantity}
                                            onChange={(e) => setQuantity(l.numserie, Number(e.target.value || 1))}
                                            style={{ width: 72 }}
                                        />
                                    </td>
                                    <td>{l.guitarra ? `${l.guitarra.precio * l.quantity} €` : "—"}</td>
                                    <td>
                                        <button onClick={() => removeItem(l.numserie)}>Quitar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                        <button onClick={clear}>Vaciar carrito</button>
                        <div style={{ textAlign: "right" }}>
                            <div>
                                <strong>Total:</strong> {subtotal} €
                            </div>
                            <div style={{ fontSize: 12, opacity: 0.8 }}>
                                El total se recalculará en el checkout con precios/stock actuales.
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CarritoPage;

