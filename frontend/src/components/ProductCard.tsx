import type { Product } from "../types/Product";
import styles from "../styles/ProductCard.module.css";
import useFavorites from "../hooks/useFavorites";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";


export default function ProductCard({product}: {product: Product}){
    const { toggle, isFavorite } = useFavorites();
    const { addToCart, canUseCart } = useCart();
    const { role } = useAuth();

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
                <button onClick={() => addToCart(productId)}>Add to cart</button>
              )}
            </div>
        </div>
    )
}