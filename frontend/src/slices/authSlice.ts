import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export type Role = "visitor" | "user" | "admin";

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async () => {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) return { role: "visitor" } as { role: Role };
    return (await res.json()) as { id?: string; role: Role };
});

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (payload: { email: string; username: string; password: string }, { dispatch }) => {
        const body = new URLSearchParams({
            email: payload.email,
            name: payload.username,
            password: payload.password,
        } as any);

        const res = await fetch("/api/auth/register", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Registration failed");
        }

        await dispatch(fetchCurrentUser() as any);
        return true;
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: { role: "visitor" as Role, id: null as string | null },
    reducers: {
        setRole(state, action) {
            state.role = action.payload;
        },
        clearRole(state) {
            state.role = "visitor";
            state.id = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.role = action.payload.role || "visitor";
            state.id = (action.payload as any).id ?? null;
        });
    },
});

export const { setRole, clearRole } = authSlice.actions;
export default authSlice.reducer;
