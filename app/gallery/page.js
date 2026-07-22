"use client";

import { useEffect, useState } from "react";
import { Images, X, ChevronLeft, ChevronRight, PackageOpen, Upload, Loader2, Trash2 } from "lucide-react";

export default function GalleryPage() {
  const [images, setImages] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    loadImages();
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.user));
  }, []);

  function loadImages() {
    fetch("/api/admin/gallery")
      .then((res) => res.json())
      .then((data) => setImages(data.images || []));
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    try {
      const res = await fetch("/api/admin/gallery", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Gagal upload");
        return;
      }

      setCaption("");
      loadImages();
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleDelete(id, event) {
    event.stopPropagation();
    if (!confirm("Hapus foto ini dari galeri?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    loadImages();
  }

  function openLightbox(index) {
    setActiveIndex(index);
  }

  function closeLightbox() {
    setActiveIndex(null);
  }

  function showPrev(e) {
    e.stopPropagation();
    setActiveIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  }

  function showNext(e) {
    e.stopPropagation();
    setActiveIndex((i) => (i < images.length - 1 ? i + 1 : 0));
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section__head">
          <div>
            <div className="hero__badge" style={{ marginBottom: 16 }}>
              <Images size={13} />
              Galeri
            </div>
            <h1>Momen di Server</h1>
          </div>

          {currentUser ? (
            <div className="gallery-upload-inline">
              <input
                placeholder="Caption (opsional)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <label className="btn btn-sm" style={{ cursor: "pointer" }}>
                {uploading ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
                {uploading ? "Mengupload..." : "Upload Foto"}
                <input type="file" accept="image/*" hidden onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          ) : (
            <a href="/login" className="btn btn-sm btn-secondary">
              Masuk buat upload foto
            </a>
          )}
        </div>

        {uploadError && <p className="error-text">{uploadError}</p>}

        {images === null ? null : images.length === 0 ? (
          <div className="empty-state">
            <PackageOpen size={28} style={{ marginBottom: 10 }} />
            <p>Belum ada foto di galeri.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {images.map((image, index) => {
              const isOwner = currentUser && image.uploadedBy?.username === currentUser.username;
              return (
                <button className="gallery-item gallery-item--btn" key={image.id} onClick={() => openLightbox(index)}>
                  <img src={image.imagePath} alt={image.caption || "Screenshot server"} loading="lazy" />
                  {image.uploadedBy && (
                    <span className="gallery-item__uploader">oleh {image.uploadedBy.username}</span>
                  )}
                  {image.caption && <span className="gallery-item__caption">{image.caption}</span>}
                  {isOwner && (
                    <span className="gallery-item__delete" onClick={(e) => handleDelete(image.id, e)}>
                      <Trash2 size={13} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {activeIndex !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox__close" onClick={closeLightbox} aria-label="Tutup">
            <X size={22} />
          </button>
          <button className="lightbox__nav lightbox__nav--prev" onClick={showPrev} aria-label="Sebelumnya">
            <ChevronLeft size={26} />
          </button>
          <img
            src={images[activeIndex].imagePath}
            alt={images[activeIndex].caption || "Screenshot server"}
            onClick={(e) => e.stopPropagation()}
          />
          <button className="lightbox__nav lightbox__nav--next" onClick={showNext} aria-label="Berikutnya">
            <ChevronRight size={26} />
          </button>
          {images[activeIndex].caption && (
            <p className="lightbox__caption">{images[activeIndex].caption}</p>
          )}
        </div>
      )}
    </section>
  );
}
