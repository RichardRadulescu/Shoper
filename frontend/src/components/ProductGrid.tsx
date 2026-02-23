import type { Product } from "../types/Product";
import ProductCard from "./ProductCard";


export default function ProductGrid(products: Array<Product>){

    return (
        <div className="productGrid">
            {products.map( p => ProductCard(p))}
        </div>
    )
}