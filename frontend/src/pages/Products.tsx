import { useState, useMemo, useEffect } from "react";
import ProductGrid from "../components/ProductGrid";
import SearchFilterProducts from "../components/SearchFilterProducts";
import styles from "../styles/Home.module.css";
import { useSearchParams } from "react-router-dom";


export default function Products(){
    const [showFilters, setShowFilters] = useState(false);
    //const products = useMemo(() => productsData, []);
    const [products, setProducts] = useState([])

    const [params, ] = useSearchParams()
    const query = params.get("query") ?? "";
    const rawCategoriesParam = params.get("category") ?? "";
    const categories = useMemo(
      () => (rawCategoriesParam ? rawCategoriesParam.split(",").map((s) => s.trim()).filter(Boolean) : []),
      [rawCategoriesParam]
    );
    const categoriesParam = useMemo(() => categories.join(","), [categories]);
    const sort = params.get("sort") ?? "1";
    const min = params.get("min");
    const max = params.get("max");

    useEffect(()=>{
        const url = new URL("http://localhost:8000/api/products/search"); 
        if (query) url.searchParams.set("query", query); 
        if (categoriesParam) url.searchParams.set("categories", categoriesParam);
        if (sort) url.searchParams.set("orderBy", sort);
        if (min) url.searchParams.set("minPrice", min);
        if (max) url.searchParams.set("maxPrice", max);

        fetch(url).then(r=>r.json())
            .then(setProducts)

    }, [query, categoriesParam, sort, min, max])

    return (<div className={styles.container}>
    <aside className={`${styles.sidebar} ${showFilters ? styles.show : ""}`}>
      <div className={styles.asideHeader}>
        <h3>Filters</h3>
        <button className={styles.closeButton} onClick={() => setShowFilters(false)}>Close</button>
      </div>
      <SearchFilterProducts/>
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