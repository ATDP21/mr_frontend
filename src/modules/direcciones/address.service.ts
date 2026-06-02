import { apiFetchJson, apiFetch } from '../../utils/api';
import { config } from '../../config/enviroment';

export type TipoDireccion = 'PEDIDO' | 'FACTURACION' | 'AMBAS';

export type DireccionDTO = {
  id: number;
  nombreDestinatario: string;
  direccionCalle: string;
  codigoPostal: string;
  ciudad: string;
  provincia: string;
  pais: string;
  telefono: string;
  documentoId: string;
  tipoDireccion: TipoDireccion;
  fechacreacion?: string;
};

export type DireccionCrearDTO = Omit<DireccionDTO, 'id' | 'fechacreacion'>;

const BASE = `${config.url.API_BASE_URL}`;

export async function getMisDirecciones(): Promise<DireccionDTO[]> {
  return apiFetchJson<DireccionDTO[]>(`${BASE}/direccion/ver`, { method: 'GET' });
}

export async function crearDireccion(payload: DireccionCrearDTO) {
  return apiFetchJson<DireccionDTO>(`${BASE}/direccion/crear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function editarDireccion(id: number, payload: Partial<DireccionCrearDTO>) {
  return apiFetchJson<DireccionDTO>(`${BASE}/direccion/editar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function eliminarDireccion(id: number) {
  return apiFetch(`${BASE}/direccion/eliminar/${id}`, {
    method: 'DELETE'
  }).then(async res => {
    if (!res.ok) throw new Error((await res.json().catch(()=>null))?.message || 'Error al eliminar');
    return true;
  });
}

