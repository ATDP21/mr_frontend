import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/AuthContext";
import OAuthButton from "../../../components/OAuthButton";
import logo from "../../../assets/logo-manuel-romero-blanco.png";


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
            navigate("/guitarra/stock", { replace: true });
        } catch {
            setError("Credenciales invalidas");
        }
    };

    return (
        <main
            className="w-full h-screen flex flex-col items-center justify-center px-4 bg-[#272A2B]"
        >
            <div className="max-w-sm w-full text-[#EFECD9] space-y-20 " >
                <img src={logo}
                          width="500" className="mx-auto"/>

                <form onSubmit={handleSubmit} >
                    <div className="text-center pb-8 ">

                        <div className="mt-5">
                            <h1 className={"text-[#EFECD9] text-5xl font-bold sm:text-3xl"}>Iniciar sesion</h1>
                        </div>
                    </div>
                    <div className={"mb-5"}>

                    <label className="font-medium text-xl"> Email </label>

                    <input
                        className="w-full mt-2 px-3 py-2  text-[#F8F4EF] bg-transparent outline-none border focus:border-lime-200 shadow-sm rounded-lg"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>

                    <div className={"mb-4"}>
                        <label className="font-medium text-xl"> Contraseña </label>
                        <input
                            className="w-full mt-2 px-3 py-2 text-[#F8F4EF] bg-transparent outline-none border focus:border-lime-200 shadow-sm rounded-lg"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={isLoading}
                    className={`w-full mt-4 py-2 bg-[#6D7B56] transition delay-100 duration-300 hover:bg-red-700 text-white font-semibold rounded-lg ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}>
                        {isLoading ? "Entrando..." : "Entrar"}
                    </button>
                    {error && <p>{error}</p>}

                    {error && <p>{error}</p>}
                    <p className={"text-center py-3 font-bold"}>O</p>


                        <OAuthButton/>

                    <p style={{marginTop: 12}} className={"text-center  hover:text-red-500"}>
                        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
                    </p>


                    <p style={{marginTop: 12}} className={"text-center  hover:text-red-500"}>
                        <Link to="/guitarra/stock">Continuar sin iniciar sesión</Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
