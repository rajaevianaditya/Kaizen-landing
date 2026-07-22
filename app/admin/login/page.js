"use client";

import { useState } from "react";
import { ShieldCheck, TriangleAlert, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal login");
        return;
      }

      window.location.href = "/admin";
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
            <ShieldCheck size={20} strokeWidth={2} />
          </div>
          <h2>Admin Login</h2>
          <p>Masukkan password admin untuk mengatur landing page.</p>

          <form onSubmit={handleSubmit}>
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
              {loading ? <Loader2 size={16} className="spin" /> : <ShieldCheck size={16} />}
              {loading ? "Memeriksa..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
