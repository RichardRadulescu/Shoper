import type { Product } from "../types/Product";
import ProductCard from "./ProductCard";
import styles from "../styles/ProductGrid.module.css";

type ProductGridProp = {
    products: Array<Product>
}
export default function ProductGrid({products}: ProductGridProp){

    return (
        <div className={styles.grid}>
            {products.map( p => <ProductCard key={p.title} product={p}/>)}
        </div>
    )
}