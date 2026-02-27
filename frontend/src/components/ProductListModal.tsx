import type { Product } from "../types/Product";
import styles from "../styles/ProductListModal.module.css";


export default function ProductListModal({products, onRemove}: {products: Array<Product>,
     onRemove: (id: string | Product) =>void}) {


    return (
        <ul className={styles.list}>
            {products.map( (p,i)=> <li key={i }>
                <p> {p.title}</p>
                <p> {p.price}</p>  
                <button onClick={()=>{onRemove(p.id ? p.id : p)}} style={{backgroundColor: "red", color:"white"}}>
                    Remove
                </button>             
            </li>)}
        </ul>
        
    )
}