import type { Product } from "../types/Product";
import styles from "../styles/ProductCard.module.css";
import useFavorites from "../hooks/useFavorites";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { type AppDispatch } from "../store/store";


export default function ProductCard({product}: {product: Product}){
    const { toggle, isFavorite } = useFavorites();
    const { role, id } = useAuth();
    const dispatch= useDispatch<AppDispatch>()
    const fav = isFavorite(product);
    const productId = product.id ?? (product as any)._id ?? product.title;

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>{product.title}</h2>
            <p>{product.description}</p>
            <p>PRICE: {product.price}</p>
            <div> <span>Categories:</span>
             {product.categories?.map((c, i)=> <p key={i} >{c}</p>)}

            </div>
            {product.image && <img src={product.image} />}
            <div className={styles.actions}>
              <button onClick={() => toggle(product)}>{fav ? "♥" : "♡"} Favorite</button>
              {(role === "user") && (
                <button onClick={() =>  dispatch(addToCart({ userId: id, productId: productId, quantity: 1 }))}>Add to cart</button>
              )}
            </div>
        </div>
    )
}