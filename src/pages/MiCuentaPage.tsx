import React from "react";
import { Link } from "react-router-dom";

const MiCuentaPage: React.FC = () => {
    return (
        <div>
            <h1>Mi cuenta</h1>
            <p>Accede a la información de tu cuenta y pedidos.</p>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <Link to="/mi-cuenta/mis-pedidos">
                    <button style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}>Mis Pedidos</button>
                </Link>
                <Link to="/mi-cuenta/mis-direcciones">
                    <button style={{ padding: '8px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: 4 }}>Mis Direcciones</button>
                </Link>
            </div>
        </div>
    );
};

export default MiCuentaPage;


