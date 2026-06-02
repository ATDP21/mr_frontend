import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/AuthContext";
import { useCart } from "../../../contexts/cart/CartContext";
import { getStockGuitarras } from "../services/guitarra.service";
import { Guitarra } from "../types/guitarra";

const StockGuitarrasPage: React.FC = () => {
    const { user } = useAuth();
    const { addItem } = useCart();
    const isAdmin = user?.rol === "ADMIN";

    const [guitarras, setGuitarras] = useState<Guitarra[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getStockGuitarras()
            .then(setGuitarras)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <h1>Stock de Guitarras</h1>
                {isAdmin ? <Link to="/guitarra/crear">Crear guitarra</Link> : null}
            </div>

            {guitarras.length === 0 ? (
                <p>No hay datos</p>
            ) : (
                <table border={1} cellPadding={8}>
                    <thead>
                    <tr>
                        <th>Detalle</th>
                        <th>ID</th>
                        <th>Nº Serie</th>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Precio</th>
                        <th>Madera</th>
                        <th>Tipo</th>
                        <th>Fecha creación</th>
                        <th>Última modificación</th>
                        <th>Carrito</th>
                    </tr>
                    </thead>
                    <tbody>
                    {guitarras.map((g) => (
                        <tr key={g.id}>
                            <td>
                                <Link to={`/guitarra/${encodeURIComponent(g.id)}`}>Ver</Link>
                            </td>
                            <td>{g.id}</td>
                            <td>{g.numserie}</td>
                            <td>{g.nombre}</td>
                            <td>{g.estado}</td>
                            <td>{g.precio} €</td>
                            <td>{g.tipomadera}</td>
                            <td>{g.tipo}</td>
                            <td>{new Date(g.fechacreacion).toLocaleString()}</td>
                            <td>
                                {g.ultimamodificacion
                                    ? new Date(g.ultimamodificacion).toLocaleString()
                                    : "—"}
                            </td>
                            <td>
                                <button onClick={() => addItem(g.id, 1)}>Añadir</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StockGuitarrasPage;