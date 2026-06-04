import { config } from "../../../config/enviroment";
import { Guitarra } from "../types/guitarra";
import { CrearGuitarraRequest } from "../types/crearGuitarra";
import { apiFetch, apiFetchJson } from "../../../utils/api";

export const getStockGuitarras = async (): Promise<Guitarra[]> => {
    return apiFetchJson<Guitarra[]>(`${config.url.API_BASE_URL}/guitarra/verStock`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });
};

export const getGuitarraById = async (id: string): Promise<Guitarra | null> => {
    const value = encodeURIComponent(id);
    const data = await apiFetchJson<Guitarra | null>(`${config.url.API_BASE_URL}/guitarra/ver/${value}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    if (!data) return null;
    return data;
};

export const crearGuitarra = async (guitarra: CrearGuitarraRequest): Promise<void> => {
    const response = await apiFetch(`${config.url.API_BASE_URL}/guitarra/crear`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(guitarra),
    });

    if (response.status === 401) {
        throw new Error("No autenticado");
    }

    if (!response.ok) {
        let corpo: any;
        try {
            corpo = await response.json();
        } catch {
            corpo = await response.text();
        }
        const msg =
            corpo && typeof corpo === "object" && corpo.message
                ? corpo.message
                : typeof corpo === "string"
                    ? corpo
                    : "Error al crear la guitarra";
        throw new Error(msg);
    }
};
