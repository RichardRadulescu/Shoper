import AdminProductsTable from "../components/admin/adminProductTable";
import styles from "../styles/AdminControls.module.css";

export default function AdminControls(){
    return(<div className={styles.container}>
        <h1>Admin Controls</h1>
        <AdminProductsTable />


    </div>)
}
