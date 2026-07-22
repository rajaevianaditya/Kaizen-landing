"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, TriangleAlert, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal login");
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
            <LogIn size={20} strokeWidth={2} />
          </div>
          <h2>Masuk ke Forum</h2>
          <p>Login pakai username atau email buat ikutan diskusi di forum komunitas.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="identifier">Username atau Email</label>
              <input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="error-text">
                <TriangleAlert size={14} />
                {error}
              </p>
            )}

            <button type="submit" className="btn" disabled={loading}>
              {loading ? <Loader2 size={16} className="spin" /> : <LogIn size={16} />}
              {loading ? "Memeriksa..." : "Masuk"}
            </button>
          </form>

          <p style={{ marginTop: 18, fontSize: "0.85rem", color: "var(--clay-muted)" }}>
            Belum punya akun?{" "}
            <Link href="/register" style={{ color: "var(--clay-accent-dark)", fontWeight: 700 }}>
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
