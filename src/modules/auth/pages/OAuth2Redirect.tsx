import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/AuthContext";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const OAuth2Redirect: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { refreshSession } = useAuth();

    useEffect(() => {
        let mounted = true;

        const confirmLogin = async () => {
            setLoading(true);
            setError(null);
            try {
                // Intentos para esperar a que la cookie HttpOnly se haya escrito por el backend
                const maxAttempts = 5;
                let attempt = 0;
                let success = false;

                while (attempt < maxAttempts && mounted && !success) {
                    attempt++;
                    await refreshSession();
                    // refreshSession actualizará el contexto del AuthProvider. Si se autentica, el provider tendrá user.
                    // Comprobamos brevemente leyendo del contexto no es ideal aquí; en su lugar, asumimos que
                    // refreshSession lanzaría o dejaría el contexto con user si tuvo éxito.
                    // Para dar tiempo a la cookie a propagarse, esperamos un pequeño intervalo entre intentos.
                    await sleep(400);
                    attempt++;
                }

                if (!mounted) return;

                setLoading(false);
                navigate("/", { replace: true });
            } catch (err) {
                if (!mounted) return;
                setError("No se pudo completar el login. Intenta de nuevo.");
                setLoading(false);
            }
        };

        confirmLogin();

        return () => {
            mounted = false;
        };
    }, [navigate, refreshSession]);

    if (loading) return <p>Iniciando sesión...</p>;
    if (error) return (
        <div>
            <p>{error}</p>
            <p>
                <a href="/login">Volver a iniciar sesión</a>
            </p>
        </div>
    );

    return null;
};

export default OAuth2Redirect;

