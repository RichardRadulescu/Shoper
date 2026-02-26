import type { Product } from "../types/Product";
import styles from "../styles/ProductCard.module.css";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { type AppDispatch } from "../store/store";
import { useFavoritesContext } from "../hooks/useFavoritesContext";


export default function ProductCard({product}: {product: Product}){
    const { toggle, isFavorite } = useFavoritesContext();
    const { role, id } = useAuth();
    const dispatch= useDispatch<AppDispatch>()
    const fav = isFavorite(product);
    const productId = product.id ?? (product as any)._id ?? product.title;

    return (
      <div className={styles.card}>
        <div>
        <h2 className={styles.title}>{product.title}</h2>

        <p className={styles.description}>{product.description}</p>

        <p className={styles.price}>PRICE: {product.price}</p>

        <div className={styles.categories}>
          <span className={styles.catLabel}>Categories:</span>
          <div className={styles.catList}>
            {product.categories?.map((c, i) => (
            <p key={i} className={styles.categoryItem}>{c}</p>
            ))}
          </div>
        </div>

        {product.image && <img className={styles.image} src={product.image} />}
            </div>
        <div className={styles.actions}>
          <button onClick={()=> toggle(product)}>{fav ? "♥" : "♡"} Favorite</button>
          {(role === "user") && (
          <button onClick={()=> dispatch(addToCart({ userId: id, productId: productId, quantity: 1 }))}>Add to cart</button>
          )}
        </div>
      </div>
    )
}