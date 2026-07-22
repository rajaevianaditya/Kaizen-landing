"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, TriangleAlert, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal daftar");
        return;
      }

      window.location.href = "/forum";
    } catch (err) {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="login-card">
          <div className="login-card__icon">
            <UserPlus size={20} strokeWidth={2} />
          </div>
          <h2>Daftar Akun Forum</h2>
          <p>Bikin akun buat mulai bikin thread, balas diskusi, dan like postingan.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="3-20 karakter, huruf/angka/underscore"
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
              />
            </div>

            {error && (
              <p className="error-text">
                <TriangleAlert size={14} />
                {error}
              </p>
            )}

            <button type="submit" className="btn" disabled={loading}>
              {loading ? <Loader2 size={16} className="spin" /> : <UserPlus size={16} />}
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p style={{ marginTop: 18, fontSize: "0.85rem", color: "var(--clay-muted)" }}>
            Udah punya akun?{" "}
            <Link href="/login" style={{ color: "var(--clay-accent-dark)", fontWeight: 700 }}>
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
