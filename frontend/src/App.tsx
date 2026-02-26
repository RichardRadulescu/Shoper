import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import styles from "./styles/App.module.css";

export default function App(){
    return (
        <div className={styles.app}>
        <Navbar>
            <h1>Welcome to Shoper</h1>
        </Navbar>
        <Outlet />
        </div>
    )
}