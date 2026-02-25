import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { fetchCurrentUser, clearRole } from "../slices/authSlice";

export function useAuth() {
    const dispatch = useDispatch();
    const role = useSelector((s: RootState) => s.auth.role);
    const id = useSelector((s: RootState) => s.auth.id);

    const refresh = useCallback(() => dispatch(fetchCurrentUser() as any), [dispatch]);

    const logout = useCallback(async () => {
        await fetch("/auth/logout", { method: "POST", credentials: "include" });
        dispatch(clearRole());
    }, [dispatch]);

    const login = useCallback(
        async (email: string, password: string) => {
            console.log("attempting login", { email });
            const res = await fetch("/auth/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ email, password }),
            });
            if (!res.ok) throw new Error("Invalid credentials");
            await dispatch(fetchCurrentUser() as any);
        },
        [dispatch]
    );

    return { role, id, refresh, logout, login } as const;
}

export default useAuth;
