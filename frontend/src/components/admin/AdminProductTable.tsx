import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Product } from "../../types/Product";
import { usePagination } from "../../hooks/usePagination";
import AdminCreateProductForm from "./AdminCreateProductForm";
import FetchExternalProductsButton from "./AdminFetchExternalStore";
import styles from "./../../styles/AdminProductTable.module.css"

export default function AdminProductsTable() {
    const [params, setParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const { page, limit, setLimit, next, prev, reset } = usePagination(1, 10);

    const query = params.get("query") ?? "";
    const rawCategoriesParam = params.get("category") ?? "";
    const categories = useMemo(
        () =>
            rawCategoriesParam
                ? rawCategoriesParam.split(",").map((s) => s.trim()).filter(Boolean)
                : [],
        [rawCategoriesParam]
    );
    const categoriesParam = useMemo(() => categories.join(","), [categories]);
    const sort = params.get("sort") ?? "1";
    const min = params.get("min");
    const max = params.get("max");

    function updateParam(key: string, value: string | null) {
        const nextParams = new URLSearchParams(params);
        if (!value) nextParams.delete(key);
        else nextParams.set(key, value);
        setParams(nextParams);
        reset();
    }

    const loadProducts = useCallback(async () => {
        setLoading(true);

        const url = new URL("http://localhost:8000/api/products/search");

        if (query) url.searchParams.set("query", query);
        if (categoriesParam) url.searchParams.set("categories", categoriesParam);
        if (sort) url.searchParams.set("orderBy", sort);
        if (min) url.searchParams.set("minPrice", min);
        if (max) url.searchParams.set("maxPrice", max);

        const res = await fetch(url.toString());
        const data = await res.json();

        // backend returns either {items:[]} or []
        const list: Product[] = data.items ?? data;

        setProducts(list);
        setLoading(false);
    }, [query, categoriesParam, sort, min, max]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

  
    const total = products.length;

    const paginatedProducts = useMemo(() => {
        const start = (page - 1) * limit;
        return products.slice(start, start + limit);
    }, [products, page, limit]);

    async function deleteProduct(id: string) {
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        loadProducts();
    }

    return (
    <div className={styles.container}>

        <div className={styles.section}>
            <FetchExternalProductsButton onFetched={loadProducts} />
        </div>

        <div className={styles.section}>
            <AdminCreateProductForm onCreated={loadProducts} />
        </div>

        <h2>Products Table</h2>

        {/* Filters */}
        <div className={styles.filters}>
            <input
                className={styles.input}
                placeholder="Search..."
                value={query}
                onChange={(e) => updateParam("query", e.target.value)}
            />

            <select
                className={styles.select}
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
            >
                <option value="1">A → Z</option>
                <option value="2">Z → A</option>
                <option value="3">Price ↑</option>
                <option value="4">Price ↓</option>
            </select>

            <input
                className={styles.input}
                type="number"
                placeholder="Min"
                value={min ?? ""}
                onChange={(e) => updateParam("min", e.target.value || null)}
            />

            <input
                className={styles.input}
                type="number"
                placeholder="Max"
                value={max ?? ""}
                onChange={(e) => updateParam("max", e.target.value || null)}
            />
        </div>

        {/* Table */}
        {loading ? (
            <p>Loading...</p>
        ) : (
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Categories</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {paginatedProducts.map((p) => (
                        <tr key={p._id}>
                            <td>{p.title}</td>
                            <td>${p.price}</td>
                            <td>{p.categories?.join(", ")}</td>
                            <td>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => deleteProduct(p._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}

        {/* Pagination */}
        <div className={styles.pagination}>
            <button
                className={styles.pageButton}
                disabled={page === 1}
                onClick={prev}
            >
                Prev
            </button>

            <span>
                Page {page} / {Math.ceil(total / limit)}
            </span>

            <button
                className={styles.pageButton}
                disabled={page >= Math.ceil(total / limit)}
                onClick={next}
            >
                Next
            </button>

            <select
                className={styles.limitSelect}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
            </select>
        </div>
    </div>

    );
}
