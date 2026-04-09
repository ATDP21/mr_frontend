import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/AuthContext";
import OAuthButton from "../../../components/OAuthButton";

export default function LoginPage() {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await login({ email, password });
            navigate("/guitarras/stock", { replace: true });
        } catch {
            setError("Credenciales invalidas");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Iniciar sesion</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contrasena"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
            </button>
            {error && <p>{error}</p>}

            <div style={{ marginTop: 12 }}>
                <p>O inicia sesión con:</p>
                <OAuthButton />
            </div>
        </form>
    );
}