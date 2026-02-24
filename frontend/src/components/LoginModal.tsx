

import styles from "../styles/LoginModal.module.css";

export default function LoginModal(){

    return (
        <form className={styles.loginForm}>
            <label >
                <input name="email" type="email"></input>
            </label>
            <label>
                <input name="password" type="password"></input>
            </label>

        </form>
    )
}