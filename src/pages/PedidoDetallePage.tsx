import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verPedido, PedidoDTO } from '../modules/pedidos/pedido.service';

export default function PedidoDetallePage() {
    const { id } = useParams<{ id: string }>();
    const [pedido, setPedido] = useState<PedidoDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                setLoading(true);
                const data = await verPedido(Number(id));
                setPedido(data);
            } catch (e: any) {
                console.error(e);
                setError(e?.message || 'Error cargando pedido');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <div>Cargando pedido...</div>;
    if (error) return <div style={{ color: '#b91c1c' }}>{error}</div>;
    if (!pedido) return <div>Pedido no encontrado.</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: 20, fontWeight: 700 }}>Detalle pedido #{pedido.id}</h1>
                <Link to="/mi-cuenta/mis-pedidos"><button style={{ padding: '6px 10px' }}>Volver</button></Link>
            </div>

            <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
                <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}>
                    <div><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</div>
                    <div><strong>Estado:</strong> {pedido.estado}</div>
                    <div><strong>Total:</strong> {typeof pedido.total === 'number' ? `${pedido.total} €` : pedido.total}</div>
                    {pedido.stripeSessionId && <div><strong>Stripe Session:</strong> {pedido.stripeSessionId}</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}>
                        <h3 style={{ marginTop: 0 }}>Dirección de entrega</h3>
                        {pedido.direccionEntrega ? (
                            <div style={{ fontSize: 14 }}>
                                <div><strong>Nombre:</strong> {pedido.direccionEntrega.nombreDestinatario}</div>
                                <div><strong>Calle:</strong> {pedido.direccionEntrega.direccionCalle}</div>
                                <div><strong>CP:</strong> {pedido.direccionEntrega.codigoPostal}</div>
                                <div><strong>Ciudad:</strong> {pedido.direccionEntrega.ciudad}</div>
                                <div><strong>Provincia:</strong> {pedido.direccionEntrega.provincia}</div>
                                <div><strong>País:</strong> {pedido.direccionEntrega.pais}</div>
                                <div><strong>Teléfono:</strong> {pedido.direccionEntrega.telefono}</div>
                                <div><strong>Documento:</strong> {pedido.direccionEntrega.documentoId}</div>
                            </div>
                        ) : <div>No disponible</div>}
                    </div>

                    <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}>
                        <h3 style={{ marginTop: 0 }}>Dirección de facturación</h3>
                        {pedido.direccionFacturacion ? (
                            <div style={{ fontSize: 14 }}>
                                <div><strong>Nombre:</strong> {pedido.direccionFacturacion.nombreDestinatario}</div>
                                <div><strong>Calle:</strong> {pedido.direccionFacturacion.direccionCalle}</div>
                                <div><strong>CP:</strong> {pedido.direccionFacturacion.codigoPostal}</div>
                                <div><strong>Ciudad:</strong> {pedido.direccionFacturacion.ciudad}</div>
                                <div><strong>Provincia:</strong> {pedido.direccionFacturacion.provincia}</div>
                                <div><strong>País:</strong> {pedido.direccionFacturacion.pais}</div>
                                <div><strong>Teléfono:</strong> {pedido.direccionFacturacion.telefono}</div>
                                <div><strong>Documento:</strong> {pedido.direccionFacturacion.documentoId}</div>
                            </div>
                        ) : <div>No disponible</div>}
                    </div>
                </div>

                <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}>
                    <h3 style={{ marginTop: 0 }}>Productos / Stock en el pedido</h3>
                    {pedido.stockPedidos && pedido.stockPedidos.length > 0 ? (
                        <div style={{ display: 'grid', gap: 8 }}>
                            {pedido.stockPedidos.map((s, idx) => {
                                 const g = (s as any).guitarraid;
                                 const cantidad = (s as any).cantidad ?? 0;
                                 const nombre = (s as any).nombre ?? (g?.nombre ?? 'Desconocido');
                                 const numSerie = (s as any).numserie ?? (g?.numserie ?? 'Desconocido');
                                 const precioUnidadRaw = (s as any).precioUnidad ?? (g?.precio ?? 0);
                                 const precioUnidad = typeof precioUnidadRaw === 'string' ? Number(precioUnidadRaw) : precioUnidadRaw;
                                 const subtotal = (Number(cantidad) || 0) * (Number(precioUnidad) || 0);
                                 return (
                                     <div key={idx} style={{ padding: 8, border: '1px solid #f3f4f6', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                         <div>
                                             <div><strong>Guitarra:</strong> {g ? nombre : 'Desconocida'}</div>
                                             <div><strong>Número de serie:</strong> {g ? numSerie : 'Desconocido'}</div>
                                            <div><strong>Cantidad:</strong> {cantidad}</div>
                                            <div><strong>Precio unidad:</strong> {isNaN(Number(precioUnidad)) ? String(precioUnidad) : `${Number(precioUnidad).toFixed(2)} €`}</div>
                                            <div><strong>Subtotal:</strong> {`${subtotal.toFixed(2)} €`}</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            {g && g.id ? (
                                                <Link to={`/guitarra/${encodeURIComponent(String(g.id))}`}><button style={{ padding: '6px 10px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: 4 }}>Ver guitarra</button></Link>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : <div>No hay items en este pedido.</div>}
                </div>
            </div>
        </div>
    );
}








