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

    const handleLogout = async () => {
        await logout();
        navigate("/", {replace: true});
    };

    return (
        <header className={"bg-blue-50 text-black"}
                style={{
                    borderBottom: "1px solid #e5e7eb",
                    padding: "12px 16px",
                    marginBottom: 16,
                }}
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

                        <Link className={"text-center hover:text-gray-300 transition-all"} to="/nuestra-historia">Nuestra
                            Historia</Link>
                        <Link className={"text-center hover:text-gray-300 transition-all"}
                              to="/guitarra/stock">Guitarras</Link>
                        <Link className={"text-center hover:text-gray-300 transition-all"}
                              to="/carrito">Carrito{totalItems > 0 ? ` (${totalItems})` : ""}</Link>
                        <Link className={"text-center hover:text-gray-300 transition-all"}
                              to="/contacto">Contacto</Link>
                    </nav>
                    <div className={" md:block"}>
                        {/* Empujar el bloque de sesión a la derecha */}
                        <div
                            className={""}>
                            {isLoading ? (
                                <span>Cargando sesión…</span>
                            ) : isAuthenticated ? (
                                <>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-end",
                                        lineHeight: 1.2
                                    }}>
                                <span>
                                    <button id="dropdownHoverButton" data-dropdown-toggle="dropdownHover"
                                            data-dropdown-trigger="hover"
                                            className="inline-flex items-center justify-center text-black bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                                            type="button">

                                    <strong>{user?.nomusuario ?? "-"}</strong>
                                        {user?.email ?
                                            <span style={{marginLeft: 8, opacity: 0.8}}>{user.email}</span> : null}
                                        </button>

                                            </span>

                                    </div>
                                    <div id="dropdownHover" className="z-10 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44">
                                        <ul className="p-2 text-sm text-body font-medium" aria-labelledby="dropdownHoverButton">
                                            <li>
                                                <Link to="/mi-cuenta">Mi cuenta</Link>
                                            </li>
                                            <li>
                                                {isAdmin ? <Link to="/admin/panel">Panel admin</Link> : null}
                                            </li>
                                            <li>
                                                <button onClick={handleLogout}>Cerrar sesión</button>
                                            </li>

                                        </ul>
                                    </div>


                                </>
                            ) : (
                                <button onClick={() => navigate("/login")}
                                        className={"bg-yellow-500 hover:bg-yellow-400 text-black py-2 px-6 rounded-full text-lg transition-all mr-auto"}>Iniciar
                                    sesión</button>
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
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
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
