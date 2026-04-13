import { config } from "../../../config/enviroment";
import {
    AuthResponse,
    LoggedUser,
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
    UsuarioSecureDTO,
    UserRole,
} from "../types/auth";
import { getXsrfTokenFromCookie } from "../../../utils/api";

export async function login(request: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${config.url.API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify(request),
    });

    const data = (await response.json().catch(() => ({}))) as AuthResponse;

    if (!response.ok) {
        throw new Error(data.message || "Login incorrecto");
    }

    return data;
}

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${config.url.API_BASE_URL}/auth/registro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify(request),
    });

    // El backend devuelve Usuario (según tu controlador). Lo tratamos como unknown.
    const data = (await response.json().catch(() => ({}))) as any;

    if (!response.ok) {
        // Intenta extraer un mensaje, si existe.
        const message =
            data && typeof data === "object" && typeof data.message === "string"
                ? data.message
                : "No se pudo registrar";
        throw new Error(message);
    }

    // Si el backend devuelve el usuario, podrías mapearlo; por ahora solo devolvemos status.
    return { message: "Registrado correctamente" };
}

function parseEsAdmin(value: unknown): boolean {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "string") {
        return value.toLowerCase() === "true";
    }

    if (typeof value === "number") {
        return value === 1;
    }

    return false;
}

function normalizeRoleFromEsAdmin(esAdmin: unknown): UserRole {
    return parseEsAdmin(esAdmin) ? "ADMIN" : "CLIENTE";
}

function mapUsuarioSecureDTO(data: unknown): LoggedUser {
    if (!data || typeof data !== "object") {
        throw new Error("Respuesta de sesión inválida");
    }

    const dto = data as Partial<UsuarioSecureDTO>;

    if (typeof dto.nomusuario !== "string" || typeof dto.email !== "string") {
        throw new Error("Respuesta de sesión incompleta");
    }

    return {
        nomusuario: dto.nomusuario,
        email: dto.email,
        nombreCompleto:
            typeof dto.nombreCompleto === "string" && dto.nombreCompleto.trim().length > 0
                ? dto.nombreCompleto
                : dto.nomusuario,
        rol: normalizeRoleFromEsAdmin(dto.esAdmin),
    };
}

export async function getLoggedUser(): Promise<LoggedUser | null> {
    const response = await fetch(`${config.url.API_BASE_URL}/usuario/loggeado`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        redirect: "manual",
    });

    // En fetch, una redirección cross-origin puede verse como "opaqueredirect".
    if ((response as any).type === "opaqueredirect" || response.status === 0) {
        return null;
    }

    if (response.status === 401 || response.status === 403) {
        return null;
    }

    if (!response.ok) {
        throw new Error("No se pudo recuperar la sesión");
    }

    const data = (await response.json().catch(() => null)) as unknown;
    return mapUsuarioSecureDTO(data);
}

export async function logout(): Promise<void> {
    const xsrf = getXsrfTokenFromCookie();
    const headers: Record<string, string> = {
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    };
    if (xsrf) headers["X-XSRF-TOKEN"] = xsrf;

    const response = await fetch(`${config.url.API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers,
    });

    if (!response.ok) {
        throw new Error("No se pudo cerrar sesión");
    }
}
