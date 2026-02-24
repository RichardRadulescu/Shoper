import { useSearchParams } from "react-router-dom";
import styles from "../styles/SearchProducts.module.css";

export default function SearchProducts() {
  const [params, setParams] = useSearchParams();
  const categories = params.get("category")?.split(",") ?? [];

  const query = params.get("query") ?? "";
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

    return (
        <form className={styles.searchForm} onSubmit={(e)=>e.preventDefault()}>
      <label>
        Search:
        <input
          value={query}
          onChange={(e) => update("query", e.target.value)}
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
