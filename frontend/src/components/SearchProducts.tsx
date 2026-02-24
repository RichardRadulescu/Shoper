import { useSearchParams } from "react-router-dom";
import { useRef, useCallback, useState, useEffect } from "react";
import styles from "../styles/SearchProducts.module.css";

export default function SearchProducts() {
  const [params, setParams] = useSearchParams();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [query, setQuery] = useState("");
  const categories = params.get("category")?.split(",") ?? [];

  // Initialize query from URL only once on mount
  useEffect(() => {
    setQuery(params.get("query") ?? "");
  }, []);  // Empty dependency array—only run once

    const sort = params.get("sort") ?? "alphaAsc";
    const min = params.get("min");
    const max = params.get("max");

    function update(key: string, value: string | null) {
         const next = new URLSearchParams(params);
         if (value === null || value === "") next.delete(key);
         else next.set(key, value);
         setParams(next);
    }

    function toggleCategory(value: string) {
        const next = categories.includes(value)
          ? categories.filter((c) => c !== value)
          : [...categories, value];
        update("category", next.length ? next.join(",") : null);
    }

    function removeCategory(value: string) {
        toggleCategory(value);
    }

    const updateQueryDebounced = useCallback((value: string) => {
      setQuery(value); // Update local state immediately for input responsiveness
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setParams(prev => {
          const next = new URLSearchParams(prev);
          if (!value) next.delete("query");
          else next.set("query", value);
          return next;
        });
      }, 300);
    }, [setParams]);

    return (
        <form className={styles.searchForm} onSubmit={(e)=>e.preventDefault()}>
      <label>
        Search:
        <input
          value={query}
          onChange={(e) => {updateQueryDebounced(e.target.value)}}
        />
      </label>

      <label>
        Sort:
        <select
          value={sort}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="alphaAsc">A → Z</option>
          <option value="alphaDesc">Z → A</option>
          <option value="priceAsc">Price ↑</option>
          <option value="priceDesc">Price ↓</option>
        </select>
      </label>

      <label>
        Min Price:
        <input
          type="number"
          value={min ?? ""}
          onChange={(e) =>
            update("min", e.target.value ? e.target.value : null)
          }
        />
      </label>

      <label>
        Max Price:
        <input
          type="number"
          value={max ?? ""}
          onChange={(e) =>
            update("max", e.target.value ? e.target.value : null)
          }
        />
      </label>

      <div className={styles.categoriesRow}>
        <label className={styles.categoriesLabel}>Categories:</label>
        <div className={styles.chips}>
          {categories.map((c) => (
            <span key={c} className={styles.chip}>
              <span className={styles.chipText}>{c}</span>
              <button
                type="button"
                aria-label={`Remove ${c}`}
                className={styles.chipRemove}
                onClick={() => removeCategory(c)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* checkbox list for easy selection (vertical) */}
      <div className={styles.categoryOptions}>
        {[
          "electronics",
          "books",
          "clothing",
          "health",
          "furniture",
        ].map((cat) => (
          <label key={cat} className={styles.categoryOption}>
            <input
              type="checkbox"
              className={styles.categoryCheckbox}
              checked={categories.includes(cat)}
              onChange={() => toggleCategory(cat)}
            />
            <span className={styles.categoryLabelText}>{cat}</span>
          </label>
        ))}
      </div>
    </form>
    )
}
