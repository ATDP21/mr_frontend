import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const AppLayout: React.FC = () => {
    return (
        <div>
            <Header />
            <main style={{ padding: "0 16px" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;

