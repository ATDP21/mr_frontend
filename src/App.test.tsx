import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/auth/AuthContext";

test("renderiza pantalla de login cuando no hay sesion", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({}),
    } as Response);

    render(
        <MemoryRouter initialEntries={["/login"]}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: /iniciar sesion/i })).toBeInTheDocument();

    jest.restoreAllMocks();
});
