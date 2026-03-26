import { config } from "../../../config/enviroment";
import { AuthResponse, LoginRequest } from "../types/auth";

export async function login(request: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${config.url.API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error("Login incorrecto");
    }

    return response.json();
}
