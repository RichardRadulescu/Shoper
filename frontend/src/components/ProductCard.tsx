import type { Product } from "../types/Product";
import styles from "../styles/ProductCard.module.css";


export default function ProductCard({product}: {product: Product}){
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>{product.title}</h2>
            <p>{product.description}</p>
            <p>PRICE: {product.price}</p>
            <p>Categories: {product.categories.map(c=> <p>{c}</p>)}

            </p>
            <img src={product.image} />
        </div>
    )
}