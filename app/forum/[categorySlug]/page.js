"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MessageCircle, Heart, PenSquare, Pin, PackageOpen, ArrowLeft } from "lucide-react";

function formatDate(dateString) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(dateString)
  );
}

export default function ForumCategoryPage() {
  const { categorySlug } = useParams();
  const [threads, setThreads] = useState(null);
  const [categoryName, setCategoryName] = useState(categorySlug);

  useEffect(() => {
    fetch(`/api/forum/threads?category=${categorySlug}`)
      .then((res) => res.json())
      .then((data) => {
        setThreads(data.threads || []);
        if (data.threads?.[0]) setCategoryName(data.threads[0].category.name);
      });
  }, [categorySlug]);

  return (
    <section className="section">
      <div className="container">
        <Link href="/forum" className="admin-back-link">
          <ArrowLeft size={15} />
          Semua kategori
        </Link>

        <div className="section__head" style={{ marginTop: 12 }}>
          <h2>{categoryName}</h2>
          <Link href="/forum/new" className="btn btn-sm">
            <PenSquare size={14} />
            Buat Thread
          </Link>
        </div>

        {threads === null ? null : threads.length === 0 ? (
          <div className="empty-state">
            <PackageOpen size={28} style={{ marginBottom: 10 }} />
            <p>Belum ada thread di kategori ini.</p>
          </div>
        ) : (
          <div className="thread-list">
            {threads.map((thread) => (
              <Link href={`/forum/thread/${thread.id}`} className="thread-row" key={thread.id}>
                <div className="thread-row__main">
                  {thread.pinned && <Pin size={13} className="thread-row__pin" />}
                  <div>
                    <div className="thread-row__title">{thread.title}</div>
                    <div className="thread-row__meta">
                      oleh {thread.author.username} &middot; {formatDate(thread.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="thread-row__stats">
                  <span>
                    <MessageCircle size={14} />
                    {thread._count.replies}
                  </span>
                  <span>
                    <Heart size={14} />
                    {thread._count.likes}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
