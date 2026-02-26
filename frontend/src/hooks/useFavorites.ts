import { useCallback, useEffect, useState } from "react";
import type { Product } from "../types/Product";

const KEY = "shoper:favorites";

export default function useFavorites() {
    const [items, setItems] = useState<Array<Product>>(() => {
        try {
            const raw = localStorage.getItem(KEY);
            return raw ? (JSON.parse(raw) as Array<Product>) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(KEY, JSON.stringify(items));
        } catch {
            console.log("could not write to storage")
        }
    }, [items]);

    const isFavorite = useCallback(
        (p: Product) => {
            const id = p.id ?? (p as any)._id ?? p.title;
            return items.some((it) => (it.id ?? (it as any)._id ?? it.title) === id);
        },
        [items]
    );

    const toggle = useCallback((p: Product) => {
        const id = p.id ?? (p as any)._id ?? p.title;
        setItems((prev) => {
            const exists = prev.some((it) => (it.id ?? (it as any)._id ?? it.title) === id);
            if (exists) return prev.filter((it) => (it.id ?? (it as any)._id ?? it.title) !== id);
            return [...prev, p];
        });
    }, []);

    const remove = useCallback((p: Product) => {
        const id = p.id ?? (p as any)._id ?? p.title;
        setItems((prev) => prev.filter((it) => (it.id ?? (it as any)._id ?? it.title) !== id));
    }, []);

    return { items, toggle, isFavorite, remove } as const;
}
