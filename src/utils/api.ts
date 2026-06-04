const XSRF_COOKIE_NAME = "XSRF-TOKEN";
const XSRF_STORAGE_KEY = "mr_xsrf_token_v1";

function canUseDocument(): boolean {
    return typeof document !== "undefined";
}

function canUseLocalStorage(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getPersistedXsrfToken(): string | null {
    if (!canUseLocalStorage()) return null;
    try {
        return window.localStorage.getItem(XSRF_STORAGE_KEY);
    } catch {
        return null;
    }
}

function setPersistedXsrfToken(token: string): void {
    if (!canUseLocalStorage()) return;
    try {
        window.localStorage.setItem(XSRF_STORAGE_KEY, token);
    } catch {
        // ignore storage errors
    }
}

function removePersistedXsrfToken(): void {
    if (!canUseLocalStorage()) return;
    try {
        window.localStorage.removeItem(XSRF_STORAGE_KEY);
    } catch {
        // ignore storage errors
    }
}

function setXsrfCookie(token: string): void {
    if (!canUseDocument()) return;
    document.cookie = `${XSRF_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; SameSite=Lax`;
}

function deleteXsrfCookie(): void {
    if (!canUseDocument()) return;
    document.cookie = `${XSRF_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
}

export function getXsrfTokenFromCookie(): string | null {
    if (!canUseDocument()) return null;
    const name = `${XSRF_COOKIE_NAME}=`;
    const cookies = document.cookie ? document.cookie.split(";") : [];
    for (let i = 0; i < cookies.length; i++) {
        const c = cookies[i].trim();
        if (c.startsWith(name)) {
            return decodeURIComponent(c.substring(name.length));
        }
    }
    return null;
}

export function rememberXsrfTokenFromCookie(): string | null {
    const token = getXsrfTokenFromCookie();
    if (token) {
        setPersistedXsrfToken(token);
        return token;
    }

    const persisted = getPersistedXsrfToken();
    if (persisted) {
        setXsrfCookie(persisted);
        return persisted;
    }

    return null;
}

export function clearXsrfToken(): void {
    removePersistedXsrfToken();
    deleteXsrfCookie();
}

export function apiFetch(input: RequestInfo, init: RequestInit = {}) {
    const method = (init.method || "GET").toString().toUpperCase();
    const isMutating = ["POST", "PUT", "DELETE", "PATCH"].includes(method);

    const headers = new Headers(init.headers || {});
    const xsrfToken = rememberXsrfTokenFromCookie();

    if (isMutating && xsrfToken) {
        headers.set("X-XSRF-TOKEN", xsrfToken);
    }

    const merged: RequestInit = {
        ...init,
        credentials: "include",
        headers,
    };

    return fetch(input, merged).then((response) => {
        // If the backend clears XSRF-TOKEN on a mutation response, restore it from the persisted copy.
        const currentCookieToken = getXsrfTokenFromCookie();
        if (currentCookieToken) {
            setPersistedXsrfToken(currentCookieToken);
        } else if (xsrfToken) {
            setPersistedXsrfToken(xsrfToken);
            setXsrfCookie(xsrfToken);
        }

        return response;
    });
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

