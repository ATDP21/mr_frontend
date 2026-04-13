import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
    getLoggedUser,
    login as loginService,
    logout as logoutService,
    register as registerService,
} from "../../modules/auth/services/auth.service";
import { LoggedUser, LoginRequest, RegisterRequest } from "../../modules/auth/types/auth";

type AuthContextType = {
    user: LoggedUser | null;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<LoggedUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        try {
            const loggedUser = await getLoggedUser();
            setUser(loggedUser);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshSession();
    }, [refreshSession]);

    const login = useCallback(
        async (data: LoginRequest) => {
            await loginService(data);
            setIsLoading(true);
            await refreshSession();
        },
        [refreshSession]
    );

    const register = useCallback(
        async (data: RegisterRequest) => {
            await registerService(data);

            // Auto-login tras registro.
            await loginService({ email: data.email, password: data.password });
            setIsLoading(true);
            await refreshSession();
        },
        [refreshSession]
    );

    const logout = useCallback(async () => {
        try {
            await logoutService();
        } finally {
            setUser(null);
        }
    }, []);

    const value = useMemo(
        () => ({
            user,
            login,
            register,
            logout,
            refreshSession,
            isAuthenticated: Boolean(user),
            isLoading,
        }),
        [user, login, register, logout, refreshSession, isLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
}