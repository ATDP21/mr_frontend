import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function CompletePage() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        if (sessionId) {
            // Opcional: verificar el estado del pago en tu backend
            fetch(`http://localhost:8080/session-status?session_id=${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    setStatus(data.status);
                })
                .catch(() => setStatus('error'));
        }
    }, [searchParams]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            {status === 'complete' ? (
                <div>
                    <h2>✅ Payment Successful!</h2>
                    <p>Thank you for your purchase.</p>
                </div>
            ) : (
                <div>
                    <h2>❌ Payment Failed</h2>
                    <p>Something went wrong with your payment.</p>
                </div>
            )}
        </div>
    );
}

export default CompletePage;