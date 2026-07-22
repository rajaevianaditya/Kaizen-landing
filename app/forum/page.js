"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessagesSquare, MessageCircle, Heart, PenSquare, Pin, PackageOpen } from "lucide-react";

function formatDate(dateString) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(dateString)
  );
}

export default function ForumHomePage() {
  const [categories, setCategories] = useState(null);
  const [threads, setThreads] = useState(null);

  useEffect(() => {
    fetch("/api/forum/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));

    fetch("/api/forum/threads")
      .then((res) => res.json())
      .then((data) => setThreads(data.threads || []));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section__head">
          <h2>
            <MessagesSquare size={20} style={{ verticalAlign: "-4px", marginRight: 8 }} />
            Forum Komunitas
          </h2>
          <Link href="/forum/new" className="btn btn-sm">
            <PenSquare size={14} />
            Buat Thread
          </Link>
        </div>

        {categories && categories.length > 0 && (
          <div className="category-grid">
            {categories.map((cat) => (
              <Link href={`/forum/${cat.slug}`} className="category-card" key={cat.id}>
                <h3>{cat.name}</h3>
                {cat.description && <p>{cat.description}</p>}
                <span className="category-card__count">{cat._count.threads} thread</span>
              </Link>
            ))}
          </div>
        )}

        <div className="section__head" style={{ marginTop: 32 }}>
          <h2>Thread Terbaru</h2>
        </div>

        {threads === null ? null : threads.length === 0 ? (
          <div className="empty-state">
            <PackageOpen size={28} style={{ marginBottom: 10 }} />
            <p>Belum ada thread. Jadi yang pertama bikin diskusi!</p>
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
                      {thread.category.name} &middot; oleh {thread.author.username} &middot;{" "}
                      {formatDate(thread.createdAt)}
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
