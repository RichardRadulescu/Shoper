import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Product } from "../types/Product";
import type { CartItem } from "../types/CartItem";

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (
        { userId, productId, quantity = 1 }: { userId: string; productId: string; quantity?: number },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const res = await fetch(`/api/cart/${userId}/add`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_id: productId, quantity }),
            });

            if (!res.ok) return rejectWithValue("Failed to add to cart");

            // refresh cart after successful add
            await dispatch(fetchCart(userId));

            return true;
        } catch (err) {
            return rejectWithValue("Failed to add to cart");
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (
        { userId, productId }: { userId: string; productId: string },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const res = await fetch(`/api/cart/${userId}/remove/${productId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) return rejectWithValue("Failed to remove from cart");

            // refresh cart after successful removal
            await dispatch(fetchCart(userId));

            return true;
        } catch (err) {
            return rejectWithValue("Failed to remove from cart");
        }
    }
);


export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (userId: string, { rejectWithValue }) => {
        try {
            if (!userId) return { items: [], products: [] };

            // 1. Fetch cart
            const cartRes = await fetch(`/cart/${userId}`, { credentials: "include" });
            if (!cartRes.ok) return { items: [], products: [] };

            const cart = await cartRes.json();
            const items = cart.items ?? [];

            // 2. Extract product IDs
            const productIds = items.map((it: any) => it.product_id);

            // 3. Batch fetch each product individually
            const productRequests = productIds.map((id: string) =>
                fetch(`/products/${id}`, { credentials: "include" }).then((r) =>
                    r.ok ? r.json() : null
                )
            );

            const productsRaw = await Promise.all(productRequests);

            // 4. Normalize products (filter nulls)
            const products = productsRaw
                .filter(Boolean)
                .map((p: any) => ({
                    ...p,
                    id: p.id ?? p._id ?? p._id?.$oid,
                }));

            return { items, products };
        } catch (err) {
            return rejectWithValue("Failed to fetch cart");
        }
    }
);


interface CartState {
    items: CartItem[];
    products: Product[];
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    items: [],
    products: [],
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.products = action.payload.products;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.items = [];
                state.products = [];
                state.error = action.payload as string;
            });
    },
});

export default cartSlice.reducer;
