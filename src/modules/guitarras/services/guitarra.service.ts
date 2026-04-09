import { config } from "../../../config/enviroment";
import { Guitarra } from "../types/guitarra";
import { CrearGuitarraRequest } from "../types/crearGuitarra";
import { apiFetch } from "../../../utils/api";

export const getStockGuitarras = async (): Promise<Guitarra[]> => {
    const response = await fetch(`${config.url.API_BASE_URL}/guitarra/verStock`);

    if (!response.ok) {
        throw new Error("Error en la petición");
    }

    return response.json();
};

export const crearGuitarra = async (
    guitarra: CrearGuitarraRequest
): Promise<void> => {
    const response = await apiFetch(`${config.url.API_BASE_URL}/guitarra/crear`, {
        method: "POST",
        credentials: "include", // enviar cookie HttpOnly
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json", // pide JSON de respuesta
            "X-Requested-With": "XMLHttpRequest" // indica que es AJAX
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