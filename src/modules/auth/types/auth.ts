export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token?: string;
    message?: string;
}

export type UserRole = "ADMIN" | "CLIENTE";

export interface UsuarioSecureDTO {
    nomusuario: string;
    email: string;
    nombreCompleto: string;
    esAdmin: boolean;
}

export interface LoggedUser {
    nomusuario: string;
    email: string;
    nombreCompleto: string;
    rol: UserRole;
}

export interface RegisterRequest {
    nombreUsuario: string;
    email: string;
    password: string;
    nombreCompleto?: string;
}

export interface RegisterResponse {
    message?: string;
}
