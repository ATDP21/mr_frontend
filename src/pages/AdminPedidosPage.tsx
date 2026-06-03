import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTodosPedidos, PedidoDTO } from '../modules/pedidos/pedido.service';

export default function AdminPedidosPage() {
    const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await getTodosPedidos();
                setPedidos(data);
            } catch (e: any) {
                console.error(e);
                setError(e?.message || 'Error al cargar todos los pedidos');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div>Cargando pedidos...</div>;
    if (error) return <div style={{ color: '#b91c1c' }}>{error}</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Todos los pedidos</h1>
                <Link to="/admin/panel">
                    <button style={{ padding: '6px 10px' }}>Volver al panel</button>
                </Link>
            </div>

            {pedidos.length === 0 ? (
                <div>No hay pedidos registrados.</div>
            ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                    {pedidos.map((p) => (
                        <div
                            key={p.id}
                            style={{
                                padding: 12,
                                border: '1px solid #e5e7eb',
                                borderRadius: 6,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 16,
                            }}
                        >
                            <div>
                                <div><strong>ID:</strong> {p.id}</div>
                                <div><strong>Fecha:</strong> {new Date(p.fecha).toLocaleString()}</div>
                                <div><strong>Estado:</strong> {p.estado}</div>
                                <div>
                                    <strong>Total:</strong>{' '}
                                    {typeof p.total === 'number' ? `${p.total} €` : p.total}
                                </div>

                                {p.usuario ? (
                                    <div>
                                        <strong>Usuario:</strong>{' '}
                                        {p.usuario.nomusuario || p.usuario.email || p.usuario.nombreCompleto || `#${p.usuario.id}`}
                                    </div>
                                ) : (
                                    <div><strong>Usuario:</strong> No disponible</div>
                                )}
                            </div>

                            <div>
                                <Link to={`/admin/pedidos/${p.id}`}>
                                    <button
                                        style={{
                                            padding: '6px 10px',
                                            backgroundColor: '#2563eb',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 4,
                                        }}
                                    >
                                        Ver detalle
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}