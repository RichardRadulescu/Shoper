import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App(){
    return (
        <>
        <Navbar>
            <h1>Hello</h1>
        </Navbar>
        <Outlet></Outlet>
        </>
    )
}