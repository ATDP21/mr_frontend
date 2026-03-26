import { config } from "../../../config/enviroment";
import { Guitarra } from "../types/guitarra";
import {CrearGuitarraRequest} from "../types/crearGuitarra";

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
    const response = await fetch(`${config.url.API_BASE_URL}/guitarra/crear`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(guitarra),
    });

    if (!response.ok) {
        throw new Error("Error al crear la guitarra");
    }
};