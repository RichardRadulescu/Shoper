import { useState, useMemo } from "react";
import ProductGrid from "../components/ProductGrid";
import SearchProducts from "../components/SearchProducts";
import styles from "../styles/Home.module.css";
import type { Product } from "../types/Product";

const productsData: Array<Product> = [
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
  },
  {
    title: "Ergonomic Office Chair",
    description: "Adjustable lumbar support and breathable mesh back.",
    price: 199,
    category: "Furniture"
  },
  {
    title: "Organic Coffee Beans",
    description: "Medium‑roast Arabica beans sourced from Colombia.",
    price: 14.99,
    category: "Grocery"
  }
];

export default function Home(){
    const [showFilters, setShowFilters] = useState(false);
    const products = useMemo(() => productsData, []);
    return (<div className={styles.container}>
    <aside className={`${styles.sidebar} ${showFilters ? styles.show : ""}`}>
      <div className={styles.asideHeader}>
        <h3>Filters</h3>
        <button className={styles.closeButton} onClick={() => setShowFilters(false)}>Close</button>
      </div>
      <SearchProducts/>
    </aside>
    <main className={styles.main}>
        <button
          className={styles.toggleButton}
          onClick={() => setShowFilters((v) => !v)}
        >
          {showFilters ? "Hide filters" : "Show filters"}
        </button>
        <ProductGrid products={products} />
    </main>
        
    </div>)
}