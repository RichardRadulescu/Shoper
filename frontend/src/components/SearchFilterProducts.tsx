import { useSearchParams } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import styles from "../styles/SearchProducts.module.css";
import { SearchInput } from "./SearchInputProducts";

export default function SearchFilterProducts() {
  const [params, setParams] = useSearchParams();
  const [text, setText] = useState(() => params.get("query") ?? "");

  // keep the input in sync if the query param is updated from outside
  useEffect(() => {
    setText(params.get("query") ?? "");
  }, [params]);

  // parse categories into a trimmed array (supports multi-select)
  const categories = (params.get("category") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const sort = params.get("sort") ?? "1";
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

    const submitSearch = useCallback(() => {
      setParams((prev) => {
        const p = new URLSearchParams(prev);
        if (text) p.set("query", text);
        else p.delete("query");
        return p;
      });
    }, [text, setParams]);

    
    return (
      <form className={styles.searchForm}  onSubmit={(e) => { e.preventDefault(); submitSearch(); }}>
      <label>
        Search:
        <SearchInput initialValue={text} onSearch={setText}></SearchInput>
      </label>
      <button type="submit">Search</button>

      <label>
        Sort:
        <select
          value={sort}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="1">A → Z</option>
          <option value="2">Z → A</option>
          <option value="3">Price ↑</option>
          <option value="4">Price ↓</option>
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
              checked={categories?.includes(cat)}
              onChange={() => toggleCategory(cat)}
            />
            <span className={styles.categoryLabelText}>{cat}</span>
          </label>
        ))}
      </div>
    </form>
    )
}
