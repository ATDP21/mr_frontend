import { apiFetchJson } from '../../utils/api';
import { config } from '../../config/enviroment';
import { DireccionDTO } from '../direcciones/address.service';
import type { Guitarra } from '../guitarras/types/guitarra';

export type UsuarioSecureDTO = {
    id?: number;
    email?: string;
    nombreCompleto?: string;
    nomusuario?: string;
};

export type StockPedidoDTO = {
    guitarraid?: Guitarra | null; // en backend es GuitarraDTO
    cantidad?: number;
    precioUnidad?: number | string;
    [key: string]: any;
};

export type PedidoDTO = {
    id: number;
    usuario?: UsuarioSecureDTO;
    fecha: string;
    estado: string;
    total: number | string;
    direccionEntrega?: DireccionDTO | null;
    direccionFacturacion?: DireccionDTO | null;
    stockPedidos?: StockPedidoDTO[];
    stripeSessionId?: string | null;
};

const BASE = `${config.url.API_BASE_URL}`;

export const misPedidos = async (): Promise<PedidoDTO[]> => {
    return apiFetchJson<PedidoDTO[]>(`${BASE}/pedido/mios`, { method: 'GET' });
};

export const getTodosPedidos = async (): Promise<PedidoDTO[]> => {
    return apiFetchJson<PedidoDTO[]>(`${BASE}/pedido/todos`, { method: 'GET' });
}

export const verPedido = async (id: number): Promise<PedidoDTO> => {
    return apiFetchJson<PedidoDTO>(`${BASE}/pedido/${id}`, { method: 'GET' });
};




