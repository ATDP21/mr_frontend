// `src/contexts/cart/CartContext.tsx`
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
    productId: number;
    quantity: number;
};

export type CartContextValue = {
    items: CartItem[];
    totalItems: number;
    addItem: (productId: number, quantity?: number) => void;
    removeItem: (productId: number) => void;
    setQuantity: (productId: number, quantity: number) => void;
    clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "mr_cart_v1";

function normalizeProductId(value: number) {
    const id = Number(value);
    if (!Number.isFinite(id)) return null;
    const int = Math.floor(id);
    if (int <= 0) return null;
    return int;
}

function loadInitialCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return [];

        return parsed
            .filter((x: any) => x && typeof x.productId === "number" && typeof x.quantity === "number")
            .map((x: any) => ({
                productId: Math.max(1, Math.floor(x.productId)),
                quantity: Math.max(1, Math.floor(x.quantity)),
            }))
            .filter((x: CartItem) => Number.isFinite(x.productId) && x.productId > 0);
    } catch {
        return [];
    }
}

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => loadInitialCart());

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // ignore
        }
    }, [items]);

    const addItem = (productId: number, quantity: number = 1) => {
        const key = normalizeProductId(productId);
        if (key === null) return;
        const qty = Math.max(1, Math.floor(quantity));

        setItems((prev) => {
            const existing = prev.find((p) => p.productId === key);
            if (!existing) return [...prev, { productId: key, quantity: qty }];
            return prev.map((p) => (p.productId === key ? { ...p, quantity: p.quantity + qty } : p));
        });
    };

    const removeItem = (productId: number) => {
        const key = normalizeProductId(productId);
        if (key === null) return;
        setItems((prev) => prev.filter((p) => p.productId !== key));
    };

    const setQuantity = (productId: number, quantity: number) => {
        const key = normalizeProductId(productId);
        if (key === null) return;
        const qty = Math.max(1, Math.floor(quantity));
        setItems((prev) => prev.map((p) => (p.productId === key ? { ...p, quantity: qty } : p)));
    };

    const clear = () => setItems([]);

    const totalItems = useMemo(() => items.reduce((acc, it) => acc + it.quantity, 0), [items]);

    const value: CartContextValue = {
        items,
        totalItems,
        addItem,
        removeItem,
        setQuantity,
        clear,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
    return ctx;
}
