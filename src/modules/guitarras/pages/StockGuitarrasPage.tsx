import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/AuthContext";
import { getStockGuitarras } from "../services/guitarra.service";
import { Guitarra } from "../types/guitarra";

const StockGuitarrasPage: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
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

    const handleLogout = async () => {
        await logout();
        navigate("/guitarras/stock", { replace: true });
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div style={{ marginBottom: "16px" }}>
                {isAuthenticated ? (
                    <>
                        <p>
                            Usuario: <strong>{user?.nomusuario ?? "-"}</strong>
                        </p>
                        <p>
                            Email: <strong>{user?.email ?? "-"}</strong>
                        </p>
                        <p>
                            Rol: <strong>{user?.rol ?? "CLIENTE"}</strong>
                        </p>
                        <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                            <Link to="/mi-cuenta">Mi cuenta</Link>
                            {isAdmin ? <Link to="/admin/panel">Panel admin</Link> : null}
                            {user?.rol === "CLIENTE" ? <Link to="/cliente/area">Area cliente</Link> : null}
                        </div>
                        <button onClick={handleLogout}>Cerrar sesion</button>
                    </>
                ) : (
                    <button onClick={() => navigate("/login")}>Iniciar sesion</button>
                )}
            </div>

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