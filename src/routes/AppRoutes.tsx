import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "../contexts/auth/AuthContext";
import { UserRole } from "../modules/auth/types/auth";

import AppLayout from "../components/AppLayout";

import StockGuitarrasPage from "../modules/guitarras/pages/StockGuitarrasPage";
import CrearGuitarraPage from "../modules/guitarras/pages/CrearGuitarraPage";
import DetalleGuitarraPage from "../modules/guitarras/pages/DetalleGuitarraPage";
import LoginPage from "../modules/auth/pages/LoginPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import OAuth2Redirect from "../modules/auth/pages/OAuth2Redirect";

import NuestraHistoriaPage from "../pages/NuestraHistoriaPage";
import ContactoPage from "../pages/ContactoPage";
import HomePage from "../pages/HomePage";
import CarritoPage from "../pages/CarritoPage";
import CartPage from "../modules/ventas/CartPage";
import CompletePage from "../modules/ventas/CompletePage";
import CheckoutResultPage from "../modules/ventas/CheckoutResultPage";

const AuthenticatedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <p>Cargando sesion...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

const RoleRoute = ({ allowedRoles }: { allowedRoles: UserRole[] }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <p>Cargando sesion...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const userRole = user.rol ?? "CLIENTE";
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/guitarra/stock" replace />;
    }

    return <Outlet />;
};

const PublicOnlyRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <p>Cargando sesion...</p>;
    }

    if (isAuthenticated) {
        return <Navigate to="/guitarra/stock" replace />;
    }

    return <Outlet />;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Públicas (sin header) */}
            <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />
            </Route>

            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

            {/* Todo lo demás usa layout con Header */}
            <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/carrito" element={<CarritoPage />} />

                <Route path="/guitarra/stock" element={<StockGuitarrasPage />} />
                <Route path="/guitarra/:id" element={<DetalleGuitarraPage />} />
                <Route path="/nuestra-historia" element={<NuestraHistoriaPage />} />
                <Route path="/contacto" element={<ContactoPage />} />

                <Route path="/cart" element={<CartPage />} />
                <Route path="/complete" element={<CompletePage />} />
                <Route path="/checkout/result" element={<CheckoutResultPage />} />

                <Route element={<AuthenticatedRoute />}>
                    <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                        <Route path="/guitarra/crear" element={<CrearGuitarraPage />} />
                        <Route path="/admin/panel" element={<p>Panel de administracion</p>} />
                    </Route>

                    <Route element={<RoleRoute allowedRoles={["CLIENTE"]} />}>
                        <Route path="/cliente/area" element={<p>Area de cliente</p>} />
                    </Route>

                    <Route element={<RoleRoute allowedRoles={["CLIENTE", "ADMIN"]} />}>
                        <Route path="/mi-cuenta" element={<p>Mi cuenta</p>} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;