import type { Product } from "../types/Product";
import styles from "../styles/ProductListModal.module.css";


export default function ProductListModal({products}: {products: Array<Product>}){

    return (
        <ul className={styles.list}>
            {products.map( p=> <li key={p.title}>
                <p> {p.title}</p>
                <p> {p.price}</p>
            </li>)}
        </ul>
        
    )
}