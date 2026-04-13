import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "../contexts/auth/AuthContext";
import { UserRole } from "../modules/auth/types/auth";

import StockGuitarrasPage from "../modules/guitarras/pages/StockGuitarrasPage";
import CrearGuitarraPage from "../modules/guitarras/pages/CrearGuitarraPage";
import LoginPage from "../modules/auth/pages/LoginPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import OAuth2Redirect from "../modules/auth/pages/OAuth2Redirect";

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
            <Route path="/" element={<Navigate to="/guitarra/stock" replace />} />

            <Route path="/guitarra/stock" element={<StockGuitarrasPage />} />

            <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />
            </Route>

            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

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

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;