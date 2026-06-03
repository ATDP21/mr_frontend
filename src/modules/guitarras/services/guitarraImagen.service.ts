import { config } from "../../../config/enviroment";
import { apiFetch, apiFetchJson } from "../../../utils/api";
import { GuitarraImagen } from "../types/guitarraImagen";

const BASE_URL = config.url.API_BASE_URL;

export const getGuitarraImagenes = async (guitarraId: number): Promise<GuitarraImagen[]> => {
    return apiFetchJson<GuitarraImagen[]>(`${BASE_URL}/guitarra/${guitarraId}/imagenes`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });
};

export const uploadGuitarraImagenes = async (guitarraId: number, files: File[]): Promise<GuitarraImagen[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    return apiFetchJson<GuitarraImagen[]>(`${BASE_URL}/guitarra/${guitarraId}/imagenes`, {
        method: "POST",
        body: formData,
    });
};

export const setGuitarraImagenPrincipal = async (guitarraId: number, imagenId: number): Promise<GuitarraImagen> => {
    return apiFetchJson<GuitarraImagen>(`${BASE_URL}/guitarra/${guitarraId}/imagenes/${imagenId}/principal`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });
};

export const deleteGuitarraImagen = async (guitarraId: number, imagenId: number): Promise<void> => {
    const response = await apiFetch(`${BASE_URL}/guitarra/${guitarraId}/imagenes/${imagenId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message =
            data && typeof data === "object" && (data as any).message
                ? (data as any).message
                : response.statusText || "Error al borrar la imagen";
        throw new Error(message);
    }
};

export const resolveGuitarraImagenUrl = (rutaPublica: string): string => {
    if (!rutaPublica) return "";
    if (rutaPublica.startsWith("http://") || rutaPublica.startsWith("https://")) {
        return rutaPublica;
    }
    return `${BASE_URL}${rutaPublica}`;
};
