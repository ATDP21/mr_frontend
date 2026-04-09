import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/AuthContext";
import { crearGuitarra } from "../services/guitarra.service";
import { CrearGuitarraRequest } from "../types/crearGuitarra";

const CrearGuitarraPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState<CrearGuitarraRequest>({
        numserie: "",
        estado: "",
        precio: 0,
        tipoMadera: "",
        tipo: "",
    });

    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "precio" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMensaje("");
        setError("");

        try {
            await crearGuitarra(form);
            setMensaje("Guitarra creada correctamente");

            setForm({
                numserie: "",
                estado: "",
                precio: 0,
                tipoMadera: "",
                tipo: "",
            });

        } catch (err) {
            const message = err instanceof Error ? err.message : "Error desconocido";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    return (
        <div>
            <div style={{ marginBottom: "16px" }}>
                <p>
                    Usuario: <strong>{user?.nomusuario ?? "-"}</strong>
                </p>
                <p>
                    Email: <strong>{user?.email ?? "-"}</strong>
                </p>
                <button onClick={handleLogout}>Cerrar sesion</button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <h1>Crear guitarra</h1>
                <Link to="/guitarras/stock">Volver al stock</Link>
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="numserie"
                    placeholder="Nº serie"
                    value={form.numserie}
                    onChange={handleChange}
                    required
                />
                <br />

                <input
                    type="text"
                    name="estado"
                    placeholder="Estado"
                    value={form.estado}
                    onChange={handleChange}
                    required
                />
                <br />

                <input
                    type="number"
                    step="0.01"
                    name="precio"
                    placeholder="Precio"
                    value={form.precio}
                    onChange={handleChange}
                    required
                />
                <br />

                <input
                    type="text"
                    name="tipoMadera"
                    placeholder="Tipo madera"
                    value={form.tipoMadera}
                    onChange={handleChange}
                    required
                />
                <br />

                <input
                    type="text"
                    name="tipo"
                    placeholder="Tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    required
                />
                <br />

                <button type="submit" disabled={loading}>
                    {loading ? "Creando..." : "Crear guitarra"}
                </button>
            </form>

            {mensaje && <p>{mensaje}</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default CrearGuitarraPage;