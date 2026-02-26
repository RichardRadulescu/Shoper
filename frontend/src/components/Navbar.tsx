import { useState, type PropsWithChildren, useEffect, type SyntheticEvent } from "react";
import useAuth from "../hooks/useAuth";
import useFavorites from "../hooks/useFavorites";
import { useSearchParams } from "react-router-dom";
import ProductListModal from "./ProductListModal";
import ThemeToggle from "./ThemeToggle";
import LoginModal from "./LoginModal";
import styles from "../styles/Navbar.module.css";
import RegisterModal from "./RegisterModal";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { fetchCart } from "../slices/cartSlice";
import { type AppDispatch } from "../store/store";



export default function Navbar({ children }: PropsWithChildren) {
  // AUTH
  const { role, id , logout } = useAuth();
  const isLoggedIn = role !== "visitor";
  // UI STATE
  const [showCart, setShowCart] = useState(false);
  const [showFavs, setShowFavs] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  // URL 
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(() => params.get("query") ?? "");
  // PRODUCT LISTS
  const { items: favItems } = useFavorites();
  const cartProducts=  useSelector((s: RootState)=> s.cart.products) 
  const cartItems= useSelector((s: RootState)=> s.cart.items)
  const dispatch= useDispatch<AppDispatch>()

  useEffect(()=>{
    if (role === "user")
     dispatch(fetchCart({userId: id}))
  
  },[id, role, dispatch] )

  
  // reflect external changes to the query param (e.g. from filter pane)
  useEffect(() => {
    setSearch(params.get("query") ?? "");
  }, [params]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (search) next.set("query", search);
    else next.delete("query");
    setParams(next);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.left}>
          <a className={styles.logo} href="/">
            MyShop
          </a>
        </div>
        <form className={styles.searchWrap} onSubmit={handleSubmit}>
          <label>
          <input
            className={styles.searchInput}
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            name="query"
            type="text"
          />
          </label>
          <button type="submit">Go</button>
        </Form>

        <div className={styles.right}>
          <button onClick={() => setShowFavs((v) => !v)}>Favorites ({favItems.length})</button>
          <button onClick={() => setShowCart((v) => !v)}>Cart ({cartItems.length})</button>
          {role === "admin" && <button>Admin</button>}
          {!isLoggedIn ? (
            <>
            <button onClick={() => setShowLogin((v) => !v)}>Login</button>
            <button onClick={()=> setShowRegister((v)=> !v)}>Register</button>
            </>
          ) : (
            <button onClick={logout}>Logout</button>
          )}
          <ThemeToggle />
        </div>

        <button
          className={styles.menuButton}
          onClick={() => setShowMenu(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </nav>

      {children}

      {showMenu && (
        <div className={styles.menuModal} role="dialog">
          <button
            className={styles.menuClose}
            onClick={() => setShowMenu(false)}
          >
            Close
          </button>
            <div className={styles.menuActions}>
            <button onClick={() => setShowFavs(true)}>Favorites ({favItems.length})</button>
            <button onClick={() => setShowCart(true)}>Cart ({cartItems.length})</button>
            {role === "admin" && <button>Admin</button>}
            {!isLoggedIn ? (
              <button onClick={() => setShowLogin(true)}>Login</button>
            ) : (
              <button onClick={() => console.log("logout")}>Logout</button>
            )}
          </div>
        </div>
      )}

      {showCart && (
        <div className={styles.modal}>
          <h2>Cart</h2>
          <ProductListModal products={cartProducts}></ProductListModal>
          <button onClick={() => setShowCart(false)}>Close</button>
        </div>
      )}

      {showFavs && (
        <div className={styles.modal}>
          <h2>Favorites</h2>
          <ProductListModal products={favItems}></ProductListModal>
          <button onClick={() => setShowFavs(false)}>Close</button>
        </div>
      )}

      {showLogin && (
        <div className={styles.modal}>
          <h2>Login</h2>
          <LoginModal onClose={() => setShowLogin(false)} />
        </div>
      )}

      {showRegister && (
        <div className={styles.modal}>
          <h2>Register</h2>
          <RegisterModal onClose={()=> setShowRegister(false)}></RegisterModal>
        </div>
      )

      }
    </>
  );
}
