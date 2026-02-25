import type { Product } from "../types/Product";
import ProductCard from "./ProductCard";
import styles from "../styles/ProductGrid.module.css";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

type ProductGridProp = {
    products: Array<Product>
}


export default function ProductGrid({products}: ProductGridProp){
    
    return (
        <div className={styles.grid}>
            {products?.map( (p, i) => <ProductCard key={i + p.title} product={p}/>)}
        </div>
    )
}