import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
    numserie: string;
    quantity: number;
};

export type CartContextValue = {
    items: CartItem[];
    totalItems: number;
    addItem: (numserie: string, quantity?: number) => void;
    removeItem: (numserie: string) => void;
    setQuantity: (numserie: string, quantity: number) => void;
    clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "mr_cart_v1";

function normalizeNumserie(value: string) {
    return value.trim();
}

function loadInitialCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return [];

        return parsed
            .filter((x: any) => x && typeof x.numserie === "string" && typeof x.quantity === "number")
            .map((x: any) => ({ numserie: normalizeNumserie(x.numserie), quantity: Math.max(1, Math.floor(x.quantity)) }))
            .filter((x: CartItem) => x.numserie.length > 0);
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

    const addItem = (numserie: string, quantity: number = 1) => {
        const key = normalizeNumserie(numserie);
        if (!key) return;
        const qty = Math.max(1, Math.floor(quantity));

        setItems((prev) => {
            const existing = prev.find((p) => p.numserie === key);
            if (!existing) return [...prev, { numserie: key, quantity: qty }];
            return prev.map((p) => (p.numserie === key ? { ...p, quantity: p.quantity + qty } : p));
        });
    };

    const removeItem = (numserie: string) => {
        const key = normalizeNumserie(numserie);
        setItems((prev) => prev.filter((p) => p.numserie !== key));
    };

    const setQuantity = (numserie: string, quantity: number) => {
        const key = normalizeNumserie(numserie);
        const qty = Math.max(1, Math.floor(quantity));
        setItems((prev) => prev.map((p) => (p.numserie === key ? { ...p, quantity: qty } : p)));
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

