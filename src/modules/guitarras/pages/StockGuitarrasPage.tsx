import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/AuthContext";
import { useCart } from "../../../contexts/cart/CartContext";
import { getStockGuitarras } from "../services/guitarra.service";
import { Guitarra } from "../types/guitarra";
import {
    getGuitarraImagenes,
    resolveGuitarraImagenUrl,
} from "../services/guitarraImagen.service";
import { GuitarraImagen } from "../types/guitarraImagen";

const StockGuitarrasPage: React.FC = () => {
    const { user } = useAuth();
    const { addItem } = useCart();
    const isAdmin = user?.rol === "ADMIN";

    const [guitarras, setGuitarras] = useState<Guitarra[]>([]);
    const [imagenesPorGuitarra, setImagenesPorGuitarra] = useState<Record<number, GuitarraImagen[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);

                const guitarrasData = await getStockGuitarras();
                setGuitarras(guitarrasData);

                const resultados = await Promise.all(
                    guitarrasData.map(async (g) => {
                        const imgs = await getGuitarraImagenes(g.id);
                        return [g.id, imgs] as const;
                    })
                );

                setImagenesPorGuitarra(Object.fromEntries(resultados));
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <main>
            <div className="text-center p-10">
                <h1 className="font-bold text-4xl mb-4">Stock de guitarras</h1>
                <h1 className="text-3xl">
                    {isAdmin ? <Link to="/guitarra/crear">Crear guitarra</Link> : null}
                </h1>
            </div>

            <div>
                {guitarras.length === 0 ? (
                    <p>No hay datos</p>
                ) : (
                    <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                        {guitarras.map((g) => {
                            const imagenes = imagenesPorGuitarra[g.id] ?? [];
                            const imagenPrincipal =
                                imagenes.find((img) => img.principal) ?? imagenes[0];

                            return (
                                <div
                                    key={g.id}
                                    className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
                                >
                                    <a href={`/guitarra/${encodeURIComponent(g.id)}`}>
                                        {imagenPrincipal ? (
                                            <img
                                                src={resolveGuitarraImagenUrl(imagenPrincipal.rutaPublica)}
                                                alt={g.nombre}
                                                className="h-80 w-72 object-cover rounded-t-xl"
                                            />
                                        ) : (
                                            <div className="h-80 w-72 bg-gray-200 rounded-t-xl flex items-center justify-center">
                                                Sin imagen
                                            </div>
                                        )}
                                    </a>

                                    <div className="px-4 py-3 w-72">
                                        <span className="text-gray-400 mr-3 uppercase text-xs">
                                            {g.tipomadera}
                                        </span>
                                        <p className="text-lg font-bold text-black truncate block capitalize">
                                            {g.nombre}
                                        </p>

                                        <div className="flex items-center">
                                            <p className="text-lg font-semibold text-black cursor-auto my-3">
                                                {g.precio} €
                                            </p>

                                            <button className="ml-auto" onClick={() => addItem(g.id, 1)}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    fill="currentColor"
                                                    className="bi bi-bag-plus"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                                                    />
                                                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                )}
            </div>
        </main>
    );
};

export default StockGuitarrasPage;