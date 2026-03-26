import React, { createContext, useContext, useState } from "react";
import { login as loginService } from "../../modules/auth/services/auth.service";
import { LoginRequest } from "../../modules/auth/types/auth";

type AuthContextType = {
    token: string | null;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);

    const login = async (data: LoginRequest) => {
        const response = await loginService(data);
        setToken(response.token);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                login,
                logout,
                isAuthenticated: Boolean(token),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
}