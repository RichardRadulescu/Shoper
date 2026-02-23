import type { Product } from "../types/Product";


export default function ProductCard(product: Product){
    return (
        <div>
            <h1>{product.title}</h1>
            <p>{product.description}</p>
            <p>PRICE: {product.price}</p>
            <p>Categories: {product.category}</p>
            <img src={product.image} />
        </div>
    )
}