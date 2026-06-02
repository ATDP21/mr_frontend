import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { misPedidos, PedidoDTO } from '../modules/pedidos/pedido.service';

export default function MisPedidosPage() {
    const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await misPedidos();
                setPedidos(data);
            } catch (e: any) {
                console.error(e);
                setError(e?.message || 'Error al cargar pedidos');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div>Cargando pedidos...</div>;
    if (error) return <div style={{ color: '#b91c1c' }}>{error}</div>;
    if (pedidos.length === 0) return <div>No hay pedidos.</div>;

    return (
        <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Mis Pedidos</h1>
            <div style={{ display: 'grid', gap: 12 }}>
                {pedidos.map(p => (
                    <div key={p.id} style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div><strong>ID:</strong> {p.id}</div>
                            <div><strong>Fecha:</strong> {new Date(p.fecha).toLocaleString()}</div>
                            <div><strong>Estado:</strong> {p.estado}</div>
                            <div><strong>Total:</strong> {typeof p.total === 'number' ? `${p.total} €` : p.total}</div>
                        </div>
                        <div>
                            <Link to={`/mi-cuenta/mis-pedidos/${p.id}`}>
                                <button style={{ padding: '6px 10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: 4 }}>Ver detalle</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


