import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "../styles/LoginModal.module.css";
import { registerUser } from "../slices/authSlice";

type Props = { onClose: () => void };

export default function RegisterModal({ onClose }: Props) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    async function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        const form = new FormData(e.target as HTMLFormElement);
        const email = String(form.get("email") ?? "").trim();
        const username = String(form.get("username") ?? "").trim();
        const password = String(form.get("password") ?? "");
        setError(null);
        setLoading(true);
        try {
            await (dispatch(registerUser({ email, username, password }) as any)).unwrap();
            onClose();
        } catch (err: any) {
            console.error("RegisterModal: error", err);
            setError(err?.message ?? "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className={styles.loginForm} onSubmit={submit}>
            <label>
                <span>Email:</span>
                <input name="email" type="email" required />
            </label>
            <label>
                <span>Username:</span>
                <input name="username" type="text" required />
            </label>
            <label>
                <span>Password:</span>
                <input name="password" type="password" required />
            </label>
            <div>
                <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
                <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
            </div>
            {error && <div style={{ color: "red" }}>{error}</div>}
        </form>
    );
}
