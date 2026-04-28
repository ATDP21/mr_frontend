import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/AuthContext";

function isValidEmail(value: string): boolean {
    // Validación pragmática para frontend: básica pero útil.
    // (No intenta cubrir el 100% del RFC; el backend debe validar también.)
    const email = value.trim();
    if (email.length < 3 || email.length > 254) return false;
    if (email.includes(" ")) return false;
    const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return re.test(email);
}

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [nomusuario, setNomusuario] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!nomusuario.trim()) {
            setError("El usuario es obligatorio");
            return;
        }

        if (!email.trim()) {
            setError("El email es obligatorio");
            return;
        }

        if (!isValidEmail(email)) {
            setError("El email no tiene un formato válido");
            return;
        }

        if (!password) {
            setError("La contraseña es obligatoria");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            setIsSubmitting(true);
            await register({ nombreUsuario: nomusuario.trim(), email: email.trim(), password });
            navigate("/guitarra/stock", { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo registrar");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Registro</h1>

            <input
                type="text"
                placeholder="Usuario"
                value={nomusuario}
                onChange={(e) => setNomusuario(e.target.value)}
                autoComplete="username"
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
            />

            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
            />

            <input
                type="password"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
            />

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            {error && <p>{error}</p>}

            <p style={{marginTop: 12}}>
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
            <p style={{marginTop: 12}}>
                <Link to="/guitarra/stock">Continuar sin registrar</Link>
            </p>
        </form>
    );
}