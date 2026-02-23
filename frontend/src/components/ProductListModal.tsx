import type { Product } from "../types/Product";


export default function ProductListModal(products: Array<Product>){

    return (
        <ul>
            {products.map( p=> <li>
                <p> {p.title}</p>
                <p> {p.price}</p>
            </li>)}
        </ul>
        
    )
}