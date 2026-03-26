import { Routes, Route, Navigate } from "react-router-dom";

import StockGuitarrasPage from "../modules/guitarras/pages/StockGuitarrasPage";
import CrearGuitarraPage from "../modules/guitarras/pages/CrearGuitarraPage";
import LoginPage from "../modules/auth/pages/LoginPage";

// Si tienes otras páginas, las irás añadiendo aquí
// import HomePage from "../pages/HomePage";
// import NotFoundPage from "../pages/NotFoundPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/guitarras/stock" replace />} />

            <Route path="/guitarras/stock" element={<StockGuitarrasPage />} />
            <Route path="/guitarras/crear" element={<CrearGuitarraPage />} />
            <Route path="/login" element={<LoginPage/>} />
            {/* Ejemplos futuros */}
            {/* <Route path="/home" element={<HomePage />} /> */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
    );
};

export default AppRoutes;