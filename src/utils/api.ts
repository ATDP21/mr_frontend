export function getXsrfTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;
    const name = "XSRF-TOKEN=";
    const cookies = document.cookie ? document.cookie.split(";") : [];
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.startsWith(name)) {
            return decodeURIComponent(c.substring(name.length));
        }
    }
    return null;
}

export function apiFetch(input: RequestInfo, init: RequestInit = {}) {
    const method = (init.method || "GET").toString().toUpperCase();
    const isMutating = ["POST", "PUT", "DELETE", "PATCH"].includes(method);

    const headers = new Headers(init.headers || {});

    if (isMutating) {
        const token = getXsrfTokenFromCookie();
        if (token) {
            headers.set("X-XSRF-TOKEN", token);
        }
    }

    const merged: RequestInit = {
        ...init,
        credentials: "include",
        headers,
    };

    return fetch(input, merged);
}

export async function apiFetchJson<T = unknown>(input: RequestInfo, init: RequestInit = {}) {
    const res = await apiFetch(input, init);
    const data = await res.json().catch(() => null);
    if (!res.ok) {
        const message = data && typeof data === "object" && (data as any).message ? (data as any).message : res.statusText;
        throw new Error(message || "Error en la petición");
    }
    return data as T;
}

