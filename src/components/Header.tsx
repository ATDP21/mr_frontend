import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth/AuthContext";
import { useCart } from "../contexts/cart/CartContext";
import logo from "../assets/logo-manuel-romero.png";

const Header: React.FC = () => {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();

    const isAdmin = user?.rol === "ADMIN";

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    return (
        <header
            style={{
                borderBottom: "1px solid #e5e7eb",
                padding: "12px 16px",
                marginBottom: 16,
            }}
        >
            <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <Link
                    to="/"
                    aria-label="Ir a inicio"
                    title="Inicio"
                    style={{ display: "inline-flex", alignItems: "center" }}
                >
                    <img
                        src={logo}
                        alt="Manuel Romero Artesanía"
                        style={{ height: 70, width: "auto", display: "block" }}
                    />
                </Link>

                <Link to="/nuestra-historia">Nuestra Historia</Link>
                <Link to="/guitarra/stock">Guitarras</Link>
                <Link to="/carrito">Carrito{totalItems > 0 ? ` (${totalItems})` : ""}</Link>
                <Link to="/contacto">Contacto</Link>

                {/* Empujar el bloque de sesión a la derecha */}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
                    {isLoading ? (
                        <span>Cargando sesión…</span>
                    ) : isAuthenticated ? (
                        <>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.2 }}>
                                <span>
                                    <strong>{user?.nomusuario ?? "-"}</strong>
                                    {user?.email ? <span style={{ marginLeft: 8, opacity: 0.8 }}>{user.email}</span> : null}
                                </span>
                                <span style={{ fontSize: 12, opacity: 0.8 }}>
                                    Rol: <strong>{user?.rol ?? "CLIENTE"}</strong>
                                </span>
                            </div>

                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <Link to="/mi-cuenta">Mi cuenta</Link>
                                {isAdmin ? <Link to="/admin/panel">Panel admin</Link> : null}
                                {user?.rol === "CLIENTE" ? <Link to="/cliente/area">Area cliente</Link> : null}
                                <button onClick={handleLogout}>Cerrar sesión</button>
                            </div>
                        </>
                    ) : (
                        <button onClick={() => navigate("/login")}>Iniciar sesión</button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
