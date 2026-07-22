"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  LogOut,
  Server,
  Link2,
  Save,
  Plus,
  Trash2,
  Loader2,
  Check,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Sparkles,
  MessagesSquare,
  Upload,
} from "lucide-react";
import { AVAILABLE_ICONS } from "./FeaturesSection";

const LINK_TYPES = [
  { value: "vote", label: "Vote" },
  { value: "store", label: "Store" },
  { value: "banlist", label: "Ban List" },
  { value: "discord", label: "Discord" },
  { value: "custom", label: "Custom" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("server-info");

  return (
    <section className="section">
      <div className="container">
        <div className="admin-head">
          <h2>
            <ShieldCheck size={22} />
            Admin Landing Page
          </h2>
          <LogoutButton />
        </div>

        <div className="admin-tabs">
          <button className={tab === "server-info" ? "active" : ""} onClick={() => setTab("server-info")}>
            <Server size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
            Info Server
          </button>
          <button className={tab === "links" ? "active" : ""} onClick={() => setTab("links")}>
            <Link2 size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
            Links
          </button>
          <button className={tab === "features" ? "active" : ""} onClick={() => setTab("features")}>
            <Sparkles size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
            Fitur
          </button>
          <button className={tab === "gallery" ? "active" : ""} onClick={() => setTab("gallery")}>
            <ImageIcon size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
            Galeri
          </button>
          <button className={tab === "forum" ? "active" : ""} onClick={() => setTab("forum")}>
            <MessagesSquare size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
            Kategori Forum
          </button>
        </div>

        {tab === "features" && <FeaturesManager />}
        {tab === "gallery" && <GalleryManager />}
        {tab === "forum" && <ForumCategoriesManager />}

        {tab === "server-info" && <ServerInfoForm />}
        {tab === "links" && <LinksManager />}
      </div>
    </section>
  );
}

function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <button className="btn btn-secondary" onClick={handleLogout}>
      <LogOut size={15} />
      Keluar
    </button>
  );
}

function ServerInfoForm() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    fetch("/api/admin/server-info")
      .then((res) => res.json())
      .then((data) => {
        setForm(data.serverInfo);
        setLogoUrl(data.serverInfo?.logoUrl);
      });
  }, []);

  async function handleLogoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-logo", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setLogoUrl(data.logoUrl);
      }
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);

    await fetch("/api/admin/server-info", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!form) {
    return (
      <div className="admin-panel">
        <Loader2 size={18} className="spin" />
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h3>Informasi Server</h3>
      </div>

      <div className="logo-upload">
        <div className="logo-upload__preview">
          {logoUrl ? <img src={logoUrl} alt="Logo server" /> : <ImageIcon size={24} />}
        </div>
        <div>
          <label className="btn btn-sm btn-secondary" style={{ cursor: "pointer" }}>
            <Upload size={14} />
            {uploadingLogo ? "Mengupload..." : "Upload Logo"}
            <input type="file" accept="image/*" hidden onChange={handleLogoUpload} disabled={uploadingLogo} />
          </label>
          <p style={{ fontSize: "0.75rem", color: "var(--clay-muted)", marginTop: 6 }}>
            JPG/PNG/WEBP/SVG, maksimal 4MB
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="field field-full">
            <label>Nama Server</label>
            <input
              value={form.serverName}
              onChange={(e) => setForm({ ...form, serverName: e.target.value })}
            />
          </div>

          <div className="field field-full">
            <label>Deskripsi (muncul di bawah judul hero)</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="field">
            <label>IP yang Ditampilkan (tombol Copy IP)</label>
            <input
              value={form.displayIp}
              onChange={(e) => setForm({ ...form, displayIp: e.target.value })}
              placeholder="play.gokaizen.id"
            />
          </div>

          <div className="field">
            <label>Port yang Ditampilkan</label>
            <input
              type="number"
              value={form.displayPort}
              onChange={(e) => setForm({ ...form, displayPort: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Host untuk Query Status (player online)</label>
            <input
              value={form.pingHost}
              onChange={(e) => setForm({ ...form, pingHost: e.target.value })}
              placeholder="Biasanya sama dengan IP di atas"
            />
          </div>

          <div className="field">
            <label>Port untuk Query Status</label>
            <input
              type="number"
              value={form.pingPort}
              onChange={(e) => setForm({ ...form, pingPort: e.target.value })}
            />
          </div>

          <div className="field field-full">
            <label>Link Invite Discord (opsional, cadangan kalau nggak dipakai sebagai Link card)</label>
            <input
              value={form.discordInviteUrl || ""}
              onChange={(e) => setForm({ ...form, discordInviteUrl: e.target.value })}
              placeholder="https://discord.gg/..."
            />
          </div>
        </div>

        {saved && (
          <p className="success-text" style={{ marginTop: 16 }}>
            <Check size={14} />
            Perubahan tersimpan
          </p>
        )}

        <button type="submit" className="btn" disabled={saving} style={{ marginTop: 8, maxWidth: 220 }}>
          {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}

function LinksManager() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLink, setNewLink] = useState({ label: "", url: "", type: "custom" });

  useEffect(() => {
    loadLinks();
  }, []);

  function loadLinks() {
    fetch("/api/admin/links")
      .then((res) => res.json())
      .then((data) => {
        setLinks(data.links || []);
        setLoading(false);
      });
  }

  async function handleAdd(event) {
    event.preventDefault();
    if (!newLink.label || !newLink.url) return;

    await fetch("/api/admin/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLink),
    });

    setNewLink({ label: "", url: "", type: "custom" });
    loadLinks();
  }

  async function handleUpdate(id, updates) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    await fetch(`/api/admin/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  async function handleDelete(id) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/admin/links/${id}`, { method: "DELETE" });
  }

  if (loading) {
    return (
      <div className="admin-panel">
        <Loader2 size={18} className="spin" />
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h3>Kelola Links</h3>
      </div>

      <form className="admin-inline-form" onSubmit={handleAdd}>
        <select value={newLink.type} onChange={(e) => setNewLink({ ...newLink, type: e.target.value })}>
          {LINK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <input
          placeholder="Label (misal: Vote di TopMinecraftServers)"
          value={newLink.label}
          onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
        />
        <input
          placeholder="https://..."
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
        />
        <button type="submit" className="btn btn-sm">
          <Plus size={14} />
          Tambah
        </button>
      </form>

      <div className="admin-table">
        {links.map((link) => (
          <div className="link-row" key={link.id}>
            <select value={link.type} onChange={(e) => handleUpdate(link.id, { type: e.target.value })}>
              {LINK_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <input
              value={link.label}
              onChange={(e) => setLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, label: e.target.value } : l)))}
              onBlur={(e) => handleUpdate(link.id, { label: e.target.value })}
            />
            <input
              value={link.url}
              onChange={(e) => setLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, url: e.target.value } : l)))}
              onBlur={(e) => handleUpdate(link.id, { url: e.target.value })}
            />
            <div className="link-row__actions">
              <button
                className="clay-icon-btn"
                onClick={() => handleUpdate(link.id, { visible: !link.visible })}
                title={link.visible ? "Sembunyikan dari landing page" : "Tampilkan di landing page"}
              >
                {link.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button className="clay-icon-btn danger" onClick={() => handleDelete(link.id)} aria-label="Hapus">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesManager() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFeature, setNewFeature] = useState({ title: "", description: "", icon: "sparkles" });

  useEffect(() => {
    loadFeatures();
  }, []);

  function loadFeatures() {
    fetch("/api/admin/features")
      .then((res) => res.json())
      .then((data) => {
        setFeatures(data.features || []);
        setLoading(false);
      });
  }

  async function handleAdd(event) {
    event.preventDefault();
    if (!newFeature.title || !newFeature.description) return;

    await fetch("/api/admin/features", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFeature),
    });

    setNewFeature({ title: "", description: "", icon: "sparkles" });
    loadFeatures();
  }

  async function handleDelete(id) {
    setFeatures((prev) => prev.filter((f) => f.id !== id));
    await fetch(`/api/admin/features/${id}`, { method: "DELETE" });
  }

  if (loading) {
    return (
      <div className="admin-panel">
        <Loader2 size={18} className="spin" />
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h3>Fitur Highlight ("Kenapa Main di Sini")</h3>
      </div>

      <form className="admin-inline-form" onSubmit={handleAdd}>
        <select value={newFeature.icon} onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}>
          {AVAILABLE_ICONS.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
        <input
          placeholder="Judul (misal: Anti-Cheat Ketat)"
          value={newFeature.title}
          onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
        />
        <input
          placeholder="Deskripsi singkat"
          value={newFeature.description}
          onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
        />
        <button type="submit" className="btn btn-sm">
          <Plus size={14} />
          Tambah
        </button>
      </form>

      <div className="admin-table">
        {features.map((feature) => (
          <div className="link-row" key={feature.id}>
            <span style={{ fontSize: "0.78rem", color: "var(--clay-muted)" }}>{feature.icon}</span>
            <span>{feature.title}</span>
            <span style={{ fontWeight: 400, color: "var(--clay-muted)" }}>{feature.description}</span>
            <div />
            <div className="link-row__actions">
              <button className="clay-icon-btn danger" onClick={() => handleDelete(feature.id)} aria-label="Hapus">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    loadImages();
  }, []);

  function loadImages() {
    fetch("/api/admin/gallery")
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || []);
        setLoading(false);
      });
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    try {
      const res = await fetch("/api/admin/gallery", { method: "POST", body: formData });
      if (res.ok) {
        setCaption("");
        loadImages();
      }
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleDelete(id) {
    setImages((prev) => prev.filter((img) => img.id !== id));
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
  }

  if (loading) {
    return (
      <div className="admin-panel">
        <Loader2 size={18} className="spin" />
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h3>Galeri Screenshot</h3>
      </div>

      <div className="admin-inline-form" style={{ gridTemplateColumns: "1fr auto" }}>
        <input
          placeholder="Caption (opsional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <label className="btn btn-sm" style={{ cursor: "pointer" }}>
          <Upload size={14} />
          {uploading ? "Mengupload..." : "Upload Foto"}
          <input type="file" accept="image/*" hidden onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="admin-gallery-grid">
        {images.map((image) => (
          <div className="admin-gallery-item" key={image.id}>
            <img src={image.imagePath} alt={image.caption || ""} />
            <button className="clay-icon-btn danger admin-gallery-item__delete" onClick={() => handleDelete(image.id)}>
              <Trash2 size={13} />
            </button>
            {image.caption && <span>{image.caption}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ForumCategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  function loadCategories() {
    fetch("/api/admin/forum-categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      });
  }

  async function handleAdd(event) {
    event.preventDefault();
    setError(null);
    if (!newCategory.name) return;

    const res = await fetch("/api/admin/forum-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setNewCategory({ name: "", description: "" });
    loadCategories();
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/admin/forum-categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
      return;
    }
    loadCategories();
  }

  if (loading) {
    return (
      <div className="admin-panel">
        <Loader2 size={18} className="spin" />
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h3>Kategori Forum</h3>
      </div>

      <form className="admin-inline-form" style={{ gridTemplateColumns: "1fr 1fr auto" }} onSubmit={handleAdd}>
        <input
          placeholder="Nama kategori (misal: Diskusi Umum)"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />
        <input
          placeholder="Deskripsi singkat (opsional)"
          value={newCategory.description}
          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
        />
        <button type="submit" className="btn btn-sm">
          <Plus size={14} />
          Tambah
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <div className="admin-table">
        {categories.map((cat) => (
          <div className="link-row" style={{ gridTemplateColumns: "1fr 1fr auto" }} key={cat.id}>
            <span>{cat.name}</span>
            <span style={{ fontWeight: 400, color: "var(--clay-muted)" }}>{cat.description}</span>
            <div className="link-row__actions">
              <button className="clay-icon-btn danger" onClick={() => handleDelete(cat.id)} aria-label="Hapus">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
