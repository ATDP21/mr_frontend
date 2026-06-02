import { apiFetchJson } from "../../../utils/api";

export interface PedidoDTO {
    id: number;
    fecha: string; // ISO datetime string
    estado: string;
    total: string; // numeric as string or number
}

export async function getMisPedidos(): Promise<PedidoDTO[]> {
    // Backend mapping shown as @GetMapping("/mios").
    // If the real endpoint is prefixed (e.g. /pedido/mios) update this path accordingly.
    return apiFetchJson<PedidoDTO[]>('/mios');
}

