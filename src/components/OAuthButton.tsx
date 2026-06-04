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
        <button onClick={handleClick} disabled={loading} className={"w-full flex mt-1 items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-black duration-150 active:bg-gray-100"}>
            <img
                src="https://raw.githubusercontent.com/sidiDev/remote-assets/7cd06bf1d8859c578c2efbfda2c68bd6bedc66d8/google-icon.svg"
                alt="Google"
                className="w-5 h-5"
            />
            <p>{loading ? "Redirigiendo..." : "Iniciar sesión con Google"}</p>
        </button>


    );
};

export default OAuthButton;

