import { useSearchParams } from "react-router-dom";
import type { Product } from "../types/Product";

type SortCriterion = "alphaTitleASC" | "alphaTitleDESC" | "priceASC" | "priceDESC"

const sorters: Record<SortCriterion, (a: Product, b: Product) => number> = {
    alphaTitleASC: (a, b) => a.title.localeCompare(b.title),
    alphaTitleDESC: (a, b) => b.title.localeCompare(a.title),
    priceASC: (a, b) => a.price - b.price,
    priceDESC: (a, b) => b.price - a.price
}

function sortProducts(products: Array<Product>, criterion: SortCriterion): Array<Product> {
    return [...products].sort(sorters[criterion])
}

export default function SearchProducts() {
    const [params, setParams] = useSearchParams();
    const query = params.get("query") ?? "";
    const sort = params.get("sort") ?? "alphaAsc";
    const min = params.get("min");
    const max = params.get("max");
    const categories = params.get("category")?.split(",") ?? [];


    function update(key: string, value: string | null) {
         const next = new URLSearchParams(params); 
         if (value === null || value === "")
             next.delete(key); 
         else 
            next.set(key, value); 
        setParams(next); 
    }

    return (
        <form className="search-form">
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

      <label>
        Categories:
        <select
          multiple
          value={categories}
          onChange={(e) =>
            update(
              "category",
              Array.from(e.target.selectedOptions)
                .map((o) => o.value)
                .join(",")
            )
          }
        >
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
        </select>
      </label>
    </form>
    )
}