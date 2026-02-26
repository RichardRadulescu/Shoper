import { useState } from "react";

interface FetchExternalProductsButtonProps {
  onFetched?: () => void; // optional callback to refresh table
}

export default function FetchExternalProductsButton({
  onFetched,
}: FetchExternalProductsButtonProps) {
  const [count, setCount] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFetch() {
    setLoading(true);
    setMessage("");

    const res = await fetch(`/api/products/fetch/${count}`, {
      method: "POST",
    });

    if (!res.ok) {
      setMessage("Failed to fetch external products");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setMessage(`Inserted ${data.inserted} products`);
    setLoading(false);

    onFetched?.(); // refresh table if provided
  }

  return (
    <div>
      <input
        type="number"
        min={1}
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        style={{ width: "80px", padding: "0.3rem",  backgroundColor: "var(--btn-bg)", color: "var(--text)"}}
      />

      <button onClick={handleFetch} disabled={loading}
        style={{backgroundColor: "var(--btn-bg)"}}
      >
        {loading ? "Fetching..." : "Fetch External"}
      </button>

      {message && <span>{message}</span>}
    </div>
  );
}
