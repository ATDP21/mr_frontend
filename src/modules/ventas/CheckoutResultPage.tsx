import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { config } from '../../config/enviroment';

type SessionStatus = {
    sessionId?: string;
    status?: string;
    paymentIntent?: any;
    [key: string]: any;
};

const CheckoutResultPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<SessionStatus | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const sessionId = searchParams.get('sessionId') || searchParams.get('session_id');
        if (!sessionId) {
            setError('No se encontró sessionId en la URL');
            setLoading(false);
            return;
        }

        const fetchStatus = async () => {
            try {
                const res = await apiFetch(`${config.url.API_BASE_URL}/api/checkout/session-status?sessionId=${encodeURIComponent(sessionId)}`);
                if (!res.ok) {
                    const body = await res.json().catch(() => null);
                    setError(body?.message || `Status request failed: ${res.status}`);
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                setStatus(data);
            } catch (err: any) {
                setError(err.message || 'Error al consultar el estado de la sesión');
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, [searchParams]);

    if (loading) return <p>Verificando estado de pago...</p>;

    if (error) return (
        <div>
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/">Volver al inicio</Link>
        </div>
    );

    return (
        <div>
            <h2>Resultado del pago</h2>
            <p>Estado: {status?.status ?? 'Desconocido'}</p>
            {status && <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(status, null, 2)}</pre>}
            <div>
                <Link to="/">Volver al inicio</Link>
            </div>
        </div>
    );
};

export default CheckoutResultPage;

