

import { useState } from "react";
import styles from "../styles/LoginModal.module.css";
import useAuth from "../hooks/useAuth";

type Props = { onClose: () => void };

export default function LoginModal({ onClose }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    async function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        console.log("LoginModal: submit handler fired", { email });
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            onClose();
        } catch (err: any) {
            console.error("LoginModal: login error", err);
            setError(err?.message ?? "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className={styles.loginForm} onSubmit={submit}>
            <label>
                <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </label>
            <label>
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>
            <div>
                <button type="submit" disabled={loading} onClick={() => console.log("Login button clicked")}>{loading ? "Logging in..." : "Login"}</button>
                <button type="button" onClick={onClose} disabled={loading}>
                    Cancel
                </button>
            </div>
            {error && <div style={{ color: "red" }}>{error}</div>}
        </form>
    );
}