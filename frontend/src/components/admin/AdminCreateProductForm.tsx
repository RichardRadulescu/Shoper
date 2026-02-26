import { useState } from "react";
import styles from "./../../styles/AdminCreateProductForm.module.css"
import type { Product } from "../../types/Product";

interface CreateProductFormProps {
  onCreated: () => void;
}

export default function AdminCreateProductForm({ onCreated }: CreateProductFormProps) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload: Omit<Product, "_id"> = {
      title,
      price: typeof price === "string" ? 0 : price,
      description,
      categories: categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      image,
    };

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setMessage("Failed to create product");
      setLoading(false);
      return;
    }

    setMessage("Product created!");
    setLoading(false);

    setTitle("");
    setPrice("");
    setDescription("");
    setCategories("");
    setImage("");

    onCreated();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.title}>Create Product</h3>

      <label className={styles.label}>
        Title:
        <input
          className={styles.input}
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className={styles.label}>
        Price:
        <input
          className={styles.input}
          required
          type="number"
          step="0.01"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
      </label>

      <label className={styles.label}>
        Description:
        <textarea
          className={styles.textarea}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className={styles.label}>
        Categories (comma separated):
        <input
          className={styles.input}
          value={categories}
          required
          type="text"
          pattern="^[^,]+(,[^,]+)*$"
          onChange={(e) => setCategories(e.target.value)}
        />
      </label>

      <label className={styles.label}>
        Image URL:
        <input
          className={styles.input}
          value={image}
          required
          type="url"
          onChange={(e) => setImage(e.target.value)}
        />
      </label>

      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
}
