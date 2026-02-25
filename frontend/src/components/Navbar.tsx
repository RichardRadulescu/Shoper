import { useState, type PropsWithChildren, useEffect, type SyntheticEvent } from "react";
import useAuth from "../hooks/useAuth";
import useFavorites from "../hooks/useFavorites";
import useCart from "../hooks/useCart";
import { useSearchParams } from "react-router-dom";
import ProductListModal from "./ProductListModal";
import ThemeToggle from "./ThemeToggle";
import LoginModal from "./LoginModal";
import styles from "../styles/Navbar.module.css";
import RegisterModal from "./RegisterModal";



export default function Navbar({ children }: PropsWithChildren) {
  // use `useAuth` for role and actions
  const { role, logout } = useAuth();
  const { items: favItems } = useFavorites();
  const { products: cartProducts, items: cartItems } = useCart();
  const isLoggedIn = role !== "visitor";
  const [showCart, setShowCart] = useState(false);
  const [showFavs, setShowFavs] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(() => params.get("query") ?? "");

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

  // initial fetch is handled globally by AuthInitializer

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
        </form>

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
