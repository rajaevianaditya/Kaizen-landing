"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Images, ArrowRight } from "lucide-react";

export default function GalleryPreview() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then((res) => res.json())
      .then((data) => setImages((data.images || []).slice(0, 4)));
  }, []);

  if (images.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="section__head">
          <h2>
            <Images size={20} style={{ verticalAlign: "-4px", marginRight: 8 }} />
            Galeri Server
          </h2>
          <Link href="/gallery" className="section__head-link">
            Lihat semua
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="gallery-grid gallery-grid--preview">
          {images.map((image) => (
            <div className="gallery-item" key={image.id}>
              <img src={image.imagePath} alt={image.caption || "Screenshot server"} loading="lazy" />
              {image.caption && <span className="gallery-item__caption">{image.caption}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
