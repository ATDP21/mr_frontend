import React, { useEffect, useState } from "react";
import { getStockGuitarras } from "../services/guitarra.service";
import { Guitarra } from "../types/guitarra";

const StockGuitarrasPage: React.FC = () => {
    const [guitarras, setGuitarras] = useState<Guitarra[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        getStockGuitarras()
            .then((data) => setGuitarras(data))
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Stock de Guitarras</h1>

            {guitarras.length === 0 ? (
                <p>No hay datos</p>
            ) : (
                <table border={1} cellPadding={8}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nº Serie</th>
                        <th>Estado</th>
                        <th>Precio</th>
                        <th>Madera</th>
                        <th>Tipo</th>
                        <th>Fecha creación</th>
                        <th>Última modificación</th>
                    </tr>
                    </thead>
                    <tbody>
                    {guitarras.map((g) => (
                        <tr key={g.id}>
                            <td>{g.id}</td>
                            <td>{g.numserie}</td>
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
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StockGuitarrasPage;