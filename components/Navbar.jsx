"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gem, Images, MessagesSquare, LogOut, LogIn, Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [config, setConfig] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoaded(true);
      });

    fetch("/api/public-config")
      .then((res) => res.json())
      .then((data) => setConfig(data));
  }, [pathname]);

  const logoUrl = config?.serverInfo?.logoUrl;
  const serverName = config?.serverInfo?.serverName;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "DELETE" });
    window.location.href = "/";
  }

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/gallery", label: "Galeri", icon: Images },
    { href: "/forum", label: "Forum", icon: MessagesSquare },
  ];

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link href="/" className="brand">
          <span className="brand-mark">
            {logoUrl ? (
              <img src={logoUrl} alt={serverName} className="brand-mark__img" />
            ) : (
              <Gem size={16} strokeWidth={2.5} />
            )}
          </span>
          <span className="brand__text">{serverName || "GoKaizen"}</span>
        </Link>

        <nav className="navbar__links navbar__links--desktop">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar__link ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar__actions navbar__actions--desktop">
          {loaded && user ? (
            <>
              <span className="navbar__username">{user.username}</span>
              <button className="clay-icon-btn" onClick={handleLogout} aria-label="Keluar">
                <LogOut size={16} />
              </button>
            </>
          ) : loaded ? (
            <Link href="/login" className="btn btn-sm">
              <LogIn size={14} />
              Masuk
            </Link>
          ) : null}
        </div>

        <button className="clay-icon-btn navbar__burger" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="navbar__mobile-menu">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          {loaded && user ? (
            <button onClick={handleLogout}>Keluar ({user.username})</button>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              Masuk
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
