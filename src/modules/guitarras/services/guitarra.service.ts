import { config } from "../../../config/enviroment";
import { Guitarra } from "../types/guitarra";

export const getStockGuitarras = async (): Promise<Guitarra[]> => {
    const response = await fetch(`${config.url.API_BASE_URL}/guitarra/verStock`);

    if (!response.ok) {
        throw new Error("Error en la petición");
    }

    return response.json();
};