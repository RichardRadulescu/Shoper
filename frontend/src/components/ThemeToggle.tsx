import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { toggleTheme } from "../slices/themeSlice";
import { useEffect } from "react";


import styles from "../styles/ThemeToggle.module.css";

export default function ThemeToggle(){
    const dispatch= useDispatch<AppDispatch>();
    const mode =useSelector((state: RootState) => state.theme.mode)

    useEffect(()=>{
        document.documentElement.classList.toggle("dark", mode ==="dark")
    },[mode])

    return(
        <button className={styles.toggle} onClick={ ()=> dispatch(toggleTheme())}>
            Switch to {mode === "light" ? "dark" : "light"} mode
        </button>
    )

}
