import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Inicio</h1>
            <p>Bienvenido a Manuel Romero Artesanía.</p>

            <div style={{ marginTop: 12 }}>
                <Link to="/guitarra/stock">Ver stock de guitarras</Link>
            </div>
        </div>
    );
};

export default HomePage;

