import { useState, type PropsWithChildren, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductListModal from "./ProductListModal";
import ThemeToggle from "./ThemeToggle";
import type { Product } from "../types/Product";
import styles from "../styles/Navbar.module.css";

const products: Array<Product> = [
  {
    title: "Wireless Headphones",
    description: "Noise‑cancelling over‑ear headphones with 30h battery life.",
    price: 129.99,
    category: "Electronics"
  },
  {
    title: "Smart Water Bottle",
    description: "Tracks hydration and glows to remind you to drink.",
    price: 49.5,
    category: "Health"
  }
];

export default function Navbar({ children }: PropsWithChildren) {
  const role = "admin";
  const isLoggedIn = true;
  const [showCart, setShowCart] = useState(false);
  const [showFavs, setShowFavs] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(() => params.get("query") ?? "");

  // reflect external changes to the query param (e.g. from filter pane)
  useEffect(() => {
    setSearch(params.get("query") ?? "");
  }, [params]);

  const handleSubmit = (e: React.FormEvent) => {
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
          <input
            className={styles.searchInput}
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Go</button>
        </form>

        <div className={styles.right}>
          <button onClick={() => setShowFavs((v) => !v)}>Favorites</button>
          <button onClick={() => setShowCart((v) => !v)}>Cart</button>
          {role === "admin" && <button>Admin</button>}
          {!isLoggedIn ? (
            <button onClick={() => setShowLogin((v) => !v)}>Login</button>
          ) : (
            <button onClick={() => console.log("logout")}>Logout</button>
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
            <button onClick={() => setShowFavs(true)}>Favorites</button>
            <button onClick={() => setShowCart(true)}>Cart</button>
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
          <ProductListModal products={products}></ProductListModal>
          <button onClick={() => setShowCart(false)}>Close</button>
        </div>
      )}

      {showFavs && (
        <div className={styles.modal}>
          <h2>Favorites</h2>
          <button onClick={() => setShowFavs(false)}>Close</button>
        </div>
      )}

      {showLogin && (
        <div className={styles.modal}>
          <h2>Login</h2>
          <button onClick={() => setShowLogin(false)}>Close</button>
        </div>
      )}
    </>
  );
}
