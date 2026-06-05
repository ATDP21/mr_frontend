import React, { useEffect, useState } from "react";
import {
    deleteGuitarraImagen,
    getGuitarraImagenes,
    resolveGuitarraImagenUrl,
    setGuitarraImagenPrincipal,
    uploadGuitarraImagenes,
} from "../services/guitarraImagen.service";
import { GuitarraImagen } from "../types/guitarraImagen";
import {useAuth} from "../../../contexts/auth/AuthContext";
import {Link} from "react-router-dom";

type Props = {
    guitarraId: number;
};

const cardStyle: React.CSSProperties = {
    border: "1px solid #d1d5db",
    borderRadius: 16,
    padding: 16,
    background: "#fff",
};

const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
};

const GuitarraImagenesUploader: React.FC<Props> = ({ guitarraId }) => {
    const { user } = useAuth();
    const isAdmin = user?.rol === "ADMIN";

    const [imagenes, setImagenes] = useState<GuitarraImagen[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        previews.forEach((url) => URL.revokeObjectURL(url));
        setSelectedFiles(files);
        setPreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const refreshImages = async () => {
        const data = await getGuitarraImagenes(guitarraId);
        setImagenes(data);
    };

    const handleUpload = async (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedFiles.length === 0) {
            setError("Selecciona al menos una imagen");
            return;
        }

        try {
            setUploading(true);
            setError("");
            setSuccess("");

            await uploadGuitarraImagenes(guitarraId, selectedFiles);
            await refreshImages();

            previews.forEach((url) => URL.revokeObjectURL(url));
            setSelectedFiles([]);
            setPreviews([]);
            setSuccess("Imágenes subidas correctamente");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al subir las imágenes");
        } finally {
            setUploading(false);
        }
    };

    const handleSetPrincipal = async (imagenId: number) => {
        try {
            setActionLoadingId(imagenId);
            setError("");
            setSuccess("");
            await setGuitarraImagenPrincipal(guitarraId, imagenId);
            await refreshImages();
            setSuccess("Imagen principal actualizada");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cambiar la imagen principal");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDelete = async (imagenId: number) => {
        const confirmed = window.confirm("¿Quieres borrar esta imagen?");
        if (!confirmed) return;

        try {
            setActionLoadingId(imagenId);
            setError("");
            setSuccess("");
            await deleteGuitarraImagen(guitarraId, imagenId);
            await refreshImages();
            setSuccess("Imagen eliminada");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al borrar la imagen");
        } finally {
            setActionLoadingId(null);
        }
    };

    return (

        <section style={{ marginTop: 24, display: "grid", gap: 16 }}>
            {isAdmin ? <div style={cardStyle}>
                <h2 style={{ marginTop: 0 }}>Imágenes de la guitarra</h2>
                <p style={{ marginTop: 0, color: "#4b5563" }}>
                    Sube una o varias imágenes. La primera imagen subida se usará como principal si todavía no hay una.
                </p>

                <form onSubmit={handleUpload} style={{ display: "grid", gap: 12 }}>
                    <input type="file" accept="image/*" multiple onChange={handleFilesChange} />

                    {previews.length > 0 ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                            {previews.map((preview, index) => (
                                <div key={`${preview}-${index}`} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                                    <img
                                        src={preview}
                                        alt={`Vista previa ${index + 1}`}
                                        style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : null}

                    <button type="submit" disabled={uploading} style={{ width: "fit-content" }}>
                        {uploading ? "Subiendo..." : "Subir imágenes"}
                    </button>
                </form>

                {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
                {success ? <p style={{ color: "#15803d" }}>{success}</p> : null}
            </div> : null}
            {isAdmin ?
            <div style={cardStyle}>
                <h3 style={{ marginTop: 0 }}>Galería</h3>

                {loading ? (
                    <p>Cargando imágenes...</p>
                ) : imagenes.length === 0 ? (
                    <p>No hay imágenes todavía.</p>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                        {imagenes.map((imagen) => {
                            const isPrincipal = imagen.principal;
                            const busy = actionLoadingId === imagen.id;

                            return (
                                <article
                                    key={imagen.id}
                                    style={{
                                        border: isPrincipal ? "2px solid #0f766e" : "1px solid #e5e7eb",
                                        borderRadius: 16,
                                        overflow: "hidden",
                                        background: "#f9fafb",
                                    }}
                                >
                                    <img
                                        src={resolveGuitarraImagenUrl(imagen.rutaPublica)}
                                        alt={imagen.nombreOriginal}
                                        style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                                    />
                                    <div style={{ padding: 12, display: "grid", gap: 10 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                                            <strong style={{ fontSize: 14 }}>{imagen.nombreOriginal}</strong>
                                            {isPrincipal ? (
                                                <span style={{ ...badgeStyle, background: "#d1fae5", color: "#065f46" }}>Principal</span>
                                            ) : (
                                                <span style={{ ...badgeStyle, background: "#e5e7eb", color: "#374151" }}>Secundaria</span>
                                            )}
                                        </div>

                                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                            {!isPrincipal ? (
                                                <button type="button" onClick={() => void handleSetPrincipal(imagen.id)} disabled={busy}>
                                                    Hacer principal
                                                </button>
                                            ) : null}
                                            <button type="button" onClick={() => void handleDelete(imagen.id)} disabled={busy}>
                                                Borrar
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div> : null}
        </section>
    );
};

export default GuitarraImagenesUploader;
