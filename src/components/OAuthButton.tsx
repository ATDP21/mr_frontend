import React, { useState } from "react";

const GOOGLE_AUTH_URL = "http://localhost:8080/oauth2/authorization/google";

export const OAuthButton: React.FC<{ className?: string; }> = ({ className }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        // navegar en la misma ventana al endpoint del backend que inicia OAuth
        window.location.href = GOOGLE_AUTH_URL;
    };

    return (
        <button onClick={handleClick} disabled={loading} className={className}>
            {loading ? "Redirigiendo..." : "Iniciar sesión con Google"}
        </button>
    );
};

export default OAuthButton;

