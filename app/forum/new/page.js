"use client";

import { useEffect, useState } from "react";
import { PenSquare, TriangleAlert, Loader2 } from "lucide-react";

export default function NewThreadPage() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          window.location.href = "/login";
          return;
        }
        setCheckingAuth(false);
      });

    fetch("/api/forum/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        if (data.categories?.[0]) setCategoryId(data.categories[0].id);
      });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim() || !categoryId) {
      setError("Semua field wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, categoryId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal membuat thread");
        return;
      }

      window.location.href = `/forum/thread/${data.thread.id}`;
    } catch (err) {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="admin-panel" style={{ maxWidth: 640, margin: "0 auto" }}>
          <div className="admin-panel__head">
            <h3>
              <PenSquare size={17} style={{ verticalAlign: "-3px", marginRight: 8 }} />
              Buat Thread Baru
            </h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Kategori</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Judul</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} />
            </div>

            <div className="field">
              <label>Isi</label>
              <textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)} />
            </div>

            {error && (
              <p className="error-text">
                <TriangleAlert size={14} />
                {error}
              </p>
            )}

            <button type="submit" className="btn" disabled={loading} style={{ maxWidth: 220 }}>
              {loading ? <Loader2 size={16} className="spin" /> : <PenSquare size={16} />}
              {loading ? "Memposting..." : "Posting Thread"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
