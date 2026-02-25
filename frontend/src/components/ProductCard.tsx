import type { Product } from "../types/Product";
import styles from "../styles/ProductCard.module.css";


export default function ProductCard({product}: {product: Product}){
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>{product.title}</h2>
            <p>{product.description}</p>
            <p>PRICE: {product.price}</p>
            <div> <span>Categories:</span>
             {product.categories.map((c, i)=> <p key={i} >{c}</p>)}

            </div>
            <img src={product.image} />
        </div>
    )
}