import React, { useEffect, useState } from "react";
import { getMisPedidos, PedidoDTO } from "../services/pedido.service";
import { Link } from "react-router-dom";

const MisPedidosPage: React.FC = () => {
    const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        getMisPedidos()
            .then((data) => setPedidos(data || []))
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Cargando pedidos...</p>;
    if (error) return <p>Error cargando pedidos: {error}</p>;

    return (
        <div>
            <h1>Mis Pedidos</h1>
            <p>
                <Link to="/mi-cuenta">← Volver a Mi cuenta</Link>
            </p>

            {pedidos.length === 0 ? (
                <p>No tiene pedidos.</p>
            ) : (
                <table border={1} cellPadding={8}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.fecha ? new Date(p.fecha).toLocaleString() : "-"}</td>
                                <td>{p.estado}</td>
                                <td>{p.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MisPedidosPage;

