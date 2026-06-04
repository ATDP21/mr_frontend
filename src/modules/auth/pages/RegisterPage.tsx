import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/AuthContext";
import logo from "../../../assets/logo-manuel-romero-blanco.png";
import OAuthButton from "../../../components/OAuthButton";

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
    const [nombreCompleto, setNombreCompleto] = useState("");

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
            await register({ nombreUsuario: nomusuario.trim(), email: email.trim(), password, nombreCompleto: nombreCompleto.trim() });
            navigate("/guitarra/stock", { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo registrar");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main
            className="w-full h-screen flex flex-col items-center justify-center px-4 bg-[#272A2B]"
        >
            <div className="max-w-sm w-full text-[#EFECD9]  " >
                <img src={logo} alt={"logo"}
                     width="500" className="mx-auto"/>
        <form onSubmit={handleSubmit}>
            <div className="text-center pb-8 ">
            <div className="mt-5">
                <h1 className={"text-[#EFECD9] text-5xl font-bold sm:text-3xl"}>Únete hoy</h1>
            </div>
            </div>
            <div className={"mb-5"}>
                <label className="font-medium text-xl"> Usuario: </label>

            <input
                className="w-full mt-2 px-3 py-2  text-[#F8F4EF] bg-transparent outline-none border focus:border-lime-200 shadow-sm rounded-lg"

                type="text"
                placeholder="Usuario"
                value={nomusuario}
                onChange={(e) => setNomusuario(e.target.value)}
                autoComplete="username"
            />
            </div>
            <div className={"mb-4"}>
                    <label className="font-medium text-xl"> Nombre completo: </label>

            <input
                className="w-full mt-2 px-3 py-2 text-[#F8F4EF] bg-transparent outline-none border focus:border-lime-200 shadow-sm rounded-lg"
                type="text"
                placeholder="Nombre completo"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                autoComplete="nombre-completo"
            />
                </div>

            <div className={"mb-4"}>
                <label className="font-medium text-xl"> Email: </label>
            <input
                className="w-full mt-2 px-3 py-2 text-[#F8F4EF] bg-transparent outline-none border focus:border-lime-200 shadow-sm rounded-lg"

                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
            />
            </div>
            <div className={"mb-4"}>
                <label className="font-medium text-xl"> Contraseña: </label>
            <input
                className="w-full mt-2 px-3 py-2 text-[#F8F4EF] bg-transparent outline-none border focus:border-lime-200 shadow-sm rounded-lg"

                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
            />
            </div>
            <div className={"mb-4"}>
            <input
                className="w-full mt-2 px-3 py-2 text-[#F8F4EF] bg-transparent outline-none border focus:border-lime-200 shadow-sm rounded-lg"

                type="password"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
            />
            </div>


            <button type="submit" disabled={isSubmitting}
                    className={`w-full mt-4 py-2 bg-[#6D7B56] transition delay-100 duration-300 hover:bg-red-700 text-white font-semibold rounded-lg ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}>
                {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            {error && <p>{error}</p>}
            <p className={"text-center py-3 font-bold"}>O</p>
            <OAuthButton/>


            <p style={{marginTop: 12}} className={"text-center  hover:text-red-500"}>
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>

            <p style={{marginTop: 12}} className={"text-center  hover:text-red-500"}>
                <Link to="/guitarra/stock">Continuar sin registrar</Link>
            </p>
        </form>
            </div>
        </main>
    );
}