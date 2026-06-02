import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch, getXsrfTokenFromCookie } from '../utils/api';
import { config } from '../config/enviroment';
import {getLoggedUser} from "../modules/auth/services/auth.service";

type Pedido = {
  id: number;
  total: number | string;
  estado: string;
  usuario?: { nombreCompleto?: string };
};

const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Evita doble confirmación en StrictMode/dev
  const processingRef = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id') || searchParams.get('sessionId');

    if (!sessionId) {
      setError('No se encontró sessionId en la URL');
      setLoading(false);
      return;
    }

    // Evita repetir confirmación para la misma sesión en recargas rápidas
    const storageKey = `checkout-confirmed:${sessionId}`;
    if (sessionStorage.getItem(storageKey) === 'done') {
      setLoading(false);
      navigate('/mis-pedidos');
      return;
    }

    if (processingRef.current) return;
    processingRef.current = true;

    void confirmarPago(sessionId, storageKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const parseSafeResponse = async (res: Response) => {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return res.json().catch(() => null);
    }
    return res.text().catch(() => null);
  };
  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  };
  const confirmarPago = async (sessionId: string, storageKey: string) => {
    try {
      setLoading(true);
      setError(null);

      // 1) GET previo para que tu CsrfFilter emita XSRF-TOKEN si no existe
      // (safe method -> genera cookie en backend)
      await getLoggedUser()

      // 2) Leer token CSRF de cookie
      const xsrf = getCookie("XSRF-TOKEN");

      if (!xsrf) {
        throw new Error('No se pudo obtener XSRF-TOKEN. Recarga la página e inténtalo de nuevo.');
      }

      // 3) Confirmar pago en backend — enviar sessionId en el body JSON
      const res = await apiFetch(
          `${config.url.API_BASE_URL}/api/checkout/confirm-payment`,
          {
            method: 'POST',
            headers: {
              "Content-Type": 'application/json',
              Accept: 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              ...(xsrf ? { "X-XSRF-TOKEN": xsrf } : {}),
            },
            body: JSON.stringify({ sessionId })
          }
      );

      const body = await parseSafeResponse(res);

      if (!res.ok) {
        const msg =
            (typeof body === 'object' && body && 'message' in body && (body as any).message) ||
            (typeof body === 'string' && body) ||
            `Error HTTP ${res.status}`;
        throw new Error(msg);
      }

      setPedido(body as Pedido);
      sessionStorage.setItem(storageKey, 'done');

      setTimeout(() => navigate('/mis-pedidos'), 3000);
    } catch (err: any) {
      setError(err?.message || 'Error al confirmar el pago');
    } finally {
      setLoading(false);
      processingRef.current = false;
    }
  };

  if (loading) {
    return (
        <div className="container mt-5">
          <div className="alert alert-info text-center">
            <h4>Procesando tu pago...</h4>
            <p>Por favor espera mientras creamos tu pedido.</p>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="container mt-5">
          <div className="alert alert-danger text-center">
            <h4>Error al procesar el pago</h4>
            <p>{error}</p>
            <button onClick={() => navigate('/carrito')} className="btn btn-primary mt-3">
              Volver al carrito
            </button>
          </div>
        </div>
    );
  }

  if (pedido) {
    return (
        <div className="container mt-5">
          <div className="alert alert-success text-center">
            <h4>Pedido confirmado</h4>
            <p>Tu pago ha sido procesado exitosamente.</p>

            <div className="mt-4 p-3 bg-light rounded">
              <p><strong>ID Pedido:</strong> {pedido.id}</p>
              <p><strong>Total:</strong> EUR {pedido.total}</p>
              <p><strong>Estado:</strong> <span className="badge bg-success">{pedido.estado}</span></p>
              <p><strong>Usuario:</strong> {pedido.usuario?.nombreCompleto || '-'}</p>
            </div>

            <p className="text-muted mt-3">Serás redirigido a tus pedidos en 3 segundos...</p>
            <p className="text-muted mt-3">Serás redirigido a tus pedidos en 3 segundos...</p>

            <button onClick={() => navigate('/mis-pedidos')} className="btn btn-primary mt-3">
              Ver mis pedidos
            </button>
          </div>
        </div>
    );
  }

  return (
      <div>
        <p>No hay información del pedido.</p>
        <Link to="/">Volver al inicio</Link>
      </div>
  );
};

export default CheckoutSuccess;