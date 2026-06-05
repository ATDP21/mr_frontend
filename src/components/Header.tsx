import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/auth/AuthContext";
import {useCart} from "../contexts/cart/CartContext";
import logo from "../assets/logo-manuel-romero-oscuro.png";

const Header: React.FC = () => {
    const {user, isAuthenticated, isLoading, logout} = useAuth();
    const {totalItems} = useCart();
    const navigate = useNavigate();

    const isAdmin = user?.rol === "ADMIN";

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const handleLogout = async () => {
        await logout();
        navigate("/", {replace: true});
    };

    return (
        <header className={"bg-[#EFECD9] text-black shadow-md mb-0"}

        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">


                <div className={"flex items-center justify-between"}>
                    <div className={"flex-shrink-0"}>
                        <Link
                            to="/"
                            aria-label="Ir a inicio"
                            title="Inicio"
                            style={{display: "inline-flex", alignItems: "center"}}
                        >
                            <img
                                src={logo}
                                alt="Manuel Romero Artesanía"
                                style={{height: 70, width: "auto"}}
                            />
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-10 text-lg">

                        <Link className={"text-center font-bold hover:text-red-500 transition-all"} to="/nuestra-historia">Nuestra
                            Historia</Link>
                        <Link className={"text-center font-bold hover:text-red-500 transition-all"}
                              to="/guitarra/stock">Guitarras</Link>
                        <Link className={"text-center font-bold hover:text-red-500 transition-all"}
                              to="/carrito">Carrito{totalItems > 0 ? ` (${totalItems})` : ""}</Link>
                        <Link className={"text-center font-bold hover:text-red-500 transition-all"}
                              to="/contacto">Contacto</Link>
                    </nav>
                    <div className={" md:block"}>
                        {/* Empujar el bloque de sesión a la derecha */}
                        <div
                            className={""}>
                            {isLoading ? (
                                <span>Cargando sesión…</span>
                            ) : isAuthenticated ? (
                                <div
                                    className="relative inline-block text-left"

                                >
                                    <button
                                        type="button"
                                        aria-haspopup="true"
                                        aria-expanded={isUserMenuOpen}
                                        onClick={() => setIsUserMenuOpen((open) => !open)}
                                        className="inline-flex items-center gap-2 rounded-full bg-[#3b2927] text-[#EFECD9] px-6 py-2 text-lg  transition-all hover:bg-[#272A2B]  focus:outline-none"
                                    >
                                        <strong>{user?.nomusuario ?? "-"} </strong>
                                        <p>{user?.email ?? "-"}</p>
                                        <svg className="h-4 w-4" aria-hidden="true" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth={2} d="m19 9-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Menú desplegable */}
                                    <div
                                        className={`absolute right-0 z-10 mt-2 w-44 rounded-lg border border-gray-200 bg-white shadow-lg ${
                                            isUserMenuOpen ? "" : "hidden"
                                        }`}
                                    >
                                        <ul className="p-2 text-sm font-medium text-gray-700">
                                            <li>
                                                <Link to="/mi-cuenta" className="block w-full rounded p-2 hover:bg-gray-100">
                                                    Mi cuenta
                                                </Link>
                                            </li>
                                            {isAdmin && (
                                                <li>
                                                    <Link to="/admin/panel" className="block w-full rounded p-2 hover:bg-gray-100">
                                                        Panel admin
                                                    </Link>
                                                </li>
                                            )}

                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full rounded p-2 text-left hover:bg-gray-100"
                                                >
                                                    Cerrar sesión
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => navigate("/login")}
                                        className="rounded-full bg-yellow-500/0 border-2 font-bold border-black px-6 py-2 text-lg text-black transition-all hover:bg-[#3b2927] hover:text-[#EFECD9]">
                                    Iniciar sesión
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            type="button"
                            aria-label="Abrir menú"
                            aria-expanded={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen((open) => !open)}
                            className="text-white focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="black" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className={`md:hidden mt-5 space-y-4 ${isMobileMenuOpen ? "" : "hidden"}`}>
                    <Link to="/nuestra-historia" className="block text-lg hover:text-gray-300 transition-all">Nuestra
                        Historia</Link>
                    <Link to="/guitarra/stock"
                          className="block text-lg hover:text-gray-300 transition-all">Guitarras</Link>
                    <Link to="/carrito"
                          className="block text-lg hover:text-gray-300 transition-all">Carrito{totalItems > 0 ? ` (${totalItems})` : ""}</Link>
                    <Link to="/contacto" className="block text-lg hover:text-gray-300 transition-all">Contacto</Link>
                </div>


            </div>

        </header>

    );
};

export default Header;
