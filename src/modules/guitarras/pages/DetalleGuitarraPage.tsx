import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../../contexts/cart/CartContext";
import GuitarraImagenesUploader from "../components/GuitarraImagenesUploader";
import { getGuitarraById } from "../services/guitarra.service";
import { Guitarra } from "../types/guitarra";
import {getGuitarraImagenes, resolveGuitarraImagenUrl} from "../services/guitarraImagen.service";
import {GuitarraImagen} from "../types/guitarraImagen";

const DetalleGuitarraPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { addItem } = useCart();
    const [imagenes, setImagenes] = useState<GuitarraImagen[]>([]);
    const [guitarra, setGuitarra] = useState<Guitarra | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const guitarraId = guitarra?.id || 0;


    const numserie = id ? decodeURIComponent(id) : "";
    useEffect(() => {
        const loadImages = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getGuitarraImagenes(guitarraId);
                setImagenes(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al cargar las imagenes");
            } finally {
                setLoading(false);
            }
        };

        void loadImages();
    }, [guitarraId]);
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
        <div className="bg-gray-100 dark:bg-gray-800 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row -mx-4">
                    <div className="md:flex-1 px-4">
                        <div className="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                            {imagenes.map((imagen) => {
                                return <img className={"w-full h-full object-cover"} src={resolveGuitarraImagenUrl(imagen.rutaPublica)} alt="imagen chula de guitarra"/>;
                            })}
                        </div>
                        <div className="flex -mx-2 mb-4">
                            <div className="w-1/2 px-2">
                                <button onClick={() => addItem(guitarra?.id, 1)}
                                    className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700">
                                    Añadir al carrito
                                </button>
                            </div>


                        </div>

                    </div>
                    <div className="md:flex-1 px-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            {guitarra.nombre}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-m mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed
                            ante justo. Integer euismod libero id mauris malesuada tincidunt.
                        </p>
                        <div className={"flex mb-4"}>
                            <div className="mr-4">
                                <span className="font-bold text-gray-700 dark:text-gray-300">Precio:</span>
                                <span className="text-gray-600 dark:text-gray-300"> {guitarra.precio} €</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-700 dark:text-gray-300">Disponibilidad:</span>
                                <span className="text-gray-600 dark:text-gray-300"> Disponible para producción</span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <span className="font-bold text-gray-700 dark:text-gray-300">Colores disponibles:</span>
                            <div className="flex items-center mt-2">
                                <button className="w-6 h-6 rounded-full bg-[#e1c15e]  mr-2"></button>
                                <button className="w-6 h-6 rounded-full bg-[#fb4712] mr-2"></button>
                                <button className="w-6 h-6 rounded-full bg-[#d48900]  mr-2"></button>
                                <button className="w-6 h-6 rounded-full bg-[#2f1003]  mr-2"></button>
                            </div>
                        </div>
                        <div>
                            <span className="font-bold text-gray-700 dark:text-gray-300">Descripción del producto:</span>
                            <p className="text-gray-600 dark:text-gray-300 text-m mt-2">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                sed ante justo. Integer euismod libero id mauris malesuada tincidunt. Vivamus commodo
                                nulla ut
                                lorem rhoncus aliquet. Duis dapibus augue vel ipsum pretium, et venenatis sem blandit.
                                Quisque
                                ut erat vitae nisi ultrices placerat non eget velit. Integer ornare mi sed ipsum
                                lacinia, non
                                sagittis mauris blandit. Morbi fermentum libero vel nisl suscipit, nec tincidunt mi
                                consectetur.
                            </p>
                        </div>
                    </div>
                </div>



                    </div>


                                <GuitarraImagenesUploader guitarraId={guitarra.id}/>
                </div>
                            );
                            };

                            export default DetalleGuitarraPage;

