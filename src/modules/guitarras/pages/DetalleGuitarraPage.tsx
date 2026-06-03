import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../../contexts/cart/CartContext";
import GuitarraImagenesUploader from "../components/GuitarraImagenesUploader";
import { getGuitarraById } from "../services/guitarra.service";
import { Guitarra } from "../types/guitarra";

const DetalleGuitarraPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { addItem } = useCart();

    const [guitarra, setGuitarra] = useState<Guitarra | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const numserie = id ? decodeURIComponent(id) : "";

    useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                setError("");

                if (!numserie) {
                    setGuitarra(null);
                    setError("Nº de serie no proporcionado");
                    return;
                }

                const found = await getGuitarraById(numserie);
                if (!found) {
                    setGuitarra(null);
                    setError("Guitarra no encontrada");
                    return;
                }

                setGuitarra(found);
            } catch (e) {
                setGuitarra(null);
                setError(e instanceof Error ? e.message : "Error al cargar la guitarra");
            } finally {
                setLoading(false);
            }
        };

        void run();
    }, [numserie]);

    if (loading) return <p>Cargando...</p>;

    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
                <Link to="/guitarra/stock">Volver al stock</Link>
            </div>
        );
    }

    if (!guitarra) {
        return (
            <div>
                <p>No hay datos.</p>
                <Link to="/guitarra/stock">Volver al stock</Link>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Detalle de guitarra</h1>
                <Link to="/guitarra/stock">Volver al stock</Link>
            </div>

            <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                    <button onClick={() => addItem(guitarra?.id, 1)}>Añadir al carrito</button>
                    <Link to="/carrito">Ir al carrito</Link>
                </div>

                <p>
                    ID: <strong>{guitarra.id}</strong>
                </p>
                <p>
                    Nº Serie: <strong>{guitarra.numserie}</strong>
                </p>
                <p>
                    Nombre: <strong>{guitarra.nombre}</strong>
                </p>
                <p>
                    Estado: <strong>{guitarra.estado}</strong>
                </p>
                <p>
                    Precio: <strong>{guitarra.precio} €</strong>
                </p>
                <p>
                    Madera: <strong>{guitarra.tipomadera}</strong>
                </p>
                <p>
                    Tipo: <strong>{guitarra.tipo}</strong>
                </p>
                <p>
                    Fecha creación: <strong>{new Date(guitarra.fechacreacion).toLocaleString()}</strong>
                </p>
                <p>
                    Última modificación:{" "}
                    <strong>
                        {guitarra.ultimamodificacion
                            ? new Date(guitarra.ultimamodificacion).toLocaleString()
                            : "—"}
                    </strong>
                </p>
            </div>
            <GuitarraImagenesUploader guitarraId={guitarra.id} />
        </div>
    );
};

export default DetalleGuitarraPage;

