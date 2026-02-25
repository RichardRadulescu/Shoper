import { useCallback, useEffect, useRef, useState } from "react";
import useAuth from "./useAuth";
import type { Product } from "../types/Product";

type CartItem = { product_id: string; quantity: number };

export default function useCart() {
    const { id: userId, role, refresh } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const inFlight = useRef(false);
    const canUseCart = role === "user" || role === "admin";

    const fetchCart = useCallback(async () => {
        if (!canUseCart || !userId) {
            setItems([]);
            setProducts([]);
            return;
        }

        // prevent concurrent fetches which can create multiple empty carts
        if (inFlight.current) return;
        inFlight.current = true;

        try {
            const res = await fetch(`/cart/${userId}`, { credentials: "include" });
            if (!res.ok) {
                setItems([]);
                setProducts([]);
                inFlight.current = false;
                return;
            }
            const cart = await res.json();
            const cartItems: CartItem[] = cart.items ?? [];
            setItems(cartItems);

            // fetch all products and resolve
            const all = await fetch(`/products/`).then((r) => r.json());
            const resolved: Product[] = cartItems
                .map((it) => {
                    const match = all.find((p: any) => {
                        const pid = it.product_id;
                        return p.id === pid || p._id === pid || (p._id && p._id.$oid === pid) || p.title === pid;
                    });
                    if (match) {
                        return { ...(match as any), id: (match as any).id ?? (match as any)._id ?? (match as any)._id?.$oid } as Product;
                    }
                    return undefined;
                })
                .filter(Boolean) as Product[];
            setProducts(resolved);
        } catch (e) {
            setItems([]);
            setProducts([]);
        } finally {
            inFlight.current = false;
        }
    }, [userId, role, canUseCart]);

    useEffect(() => {
        // only fetch when userId/role change and not already fetching
        if (!inFlight.current) fetchCart();
    }, [fetchCart, userId, role]);

    const addToCart = useCallback(
        async (productId: string, quantity = 1) => {
            if (!canUseCart || !userId) return;
            try {
                const res = await fetch(`/api/cart/${userId}/add`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ product_id: productId, quantity }),
                });
                if (res.ok) await fetchCart();
            } catch (e) {
                console.log("error adding to cart")
            }
        },
        [userId, canUseCart, fetchCart]
    );

    const removeFromCart = useCallback(
        async (productId: string) => {
            if (!canUseCart || !userId) return;
            try {
                const res = await fetch(`/api/cart/${userId}/remove/${productId}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                if (res.ok) await fetchCart();
            } catch { }
        },
        [userId, canUseCart, fetchCart]
    );

    return { items, products, fetchCart, addToCart, removeFromCart, canUseCart } as const;
}
