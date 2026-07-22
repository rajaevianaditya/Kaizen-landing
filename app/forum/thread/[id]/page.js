"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Pencil,
  Trash2,
  Send,
  Loader2,
  TriangleAlert,
  MessageCircle,
} from "lucide-react";

function formatDate(dateString) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(
    new Date(dateString)
  );
}

export default function ThreadDetailPage() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);
  const [editingThread, setEditingThread] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  useEffect(() => {
    loadThread();
  }, [id]);

  function loadThread() {
    fetch(`/api/forum/threads/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setThread(data.thread);
        setCurrentUserId(data.currentUserId);
        setEditForm({ title: data.thread?.title || "", content: data.thread?.content || "" });
      });
  }

  async function handleLikeThread() {
    if (!currentUserId) {
      window.location.href = "/login";
      return;
    }
    const res = await fetch(`/api/forum/threads/${id}/like`, { method: "POST" });
    const data = await res.json();
    setThread((prev) => ({
      ...prev,
      likes: data.liked ? [{ userId: currentUserId }] : [],
      _count: { ...prev._count, likes: data.count },
    }));
  }

  async function handleLikeReply(replyId) {
    if (!currentUserId) {
      window.location.href = "/login";
      return;
    }
    const res = await fetch(`/api/forum/replies/${replyId}/like`, { method: "POST" });
    const data = await res.json();
    setThread((prev) => ({
      ...prev,
      replies: prev.replies.map((r) =>
        r.id === replyId
          ? { ...r, likes: data.liked ? [{ userId: currentUserId }] : [], _count: { ...r._count, likes: data.count } }
          : r
      ),
    }));
  }

  async function handlePostReply(event) {
    event.preventDefault();
    if (!currentUserId) {
      window.location.href = "/login";
      return;
    }
    if (!replyContent.trim()) return;

    setPosting(true);
    setError(null);

    try {
      const res = await fetch(`/api/forum/threads/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mengirim balasan");
        return;
      }

      setReplyContent("");
      loadThread();
    } catch (err) {
      setError("Gagal menghubungi server");
    } finally {
      setPosting(false);
    }
  }

  async function handleSaveEditThread() {
    await fetch(`/api/forum/threads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingThread(false);
    loadThread();
  }

  async function handleDeleteThread() {
    if (!confirm("Hapus thread ini? Semua balasan juga akan terhapus.")) return;
    await fetch(`/api/forum/threads/${id}`, { method: "DELETE" });
    window.location.href = "/forum";
  }

  async function handleDeleteReply(replyId) {
    if (!confirm("Hapus balasan ini?")) return;
    await fetch(`/api/forum/replies/${replyId}`, { method: "DELETE" });
    loadThread();
  }

  if (!thread) return null;

  const threadLiked = thread.likes?.length > 0;

  return (
    <section className="section">
      <div className="container">
        <Link href={`/forum/${thread.category.slug}`} className="admin-back-link">
          <ArrowLeft size={15} />
          {thread.category.name}
        </Link>

        <div className="thread-detail">
          <div className="thread-detail__head">
            {editingThread ? (
              <input
                className="thread-detail__title-input"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            ) : (
              <h1>{thread.title}</h1>
            )}

            <div className="thread-detail__meta">
              oleh <strong>{thread.author.username}</strong> &middot; {formatDate(thread.createdAt)}
            </div>
          </div>

          {editingThread ? (
            <textarea
              rows={6}
              className="thread-detail__content-input"
              value={editForm.content}
              onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
            />
          ) : (
            <p className="thread-detail__content">{thread.content}</p>
          )}

          <div className="thread-detail__actions">
            <button className={`like-btn ${threadLiked ? "liked" : ""}`} onClick={handleLikeThread}>
              <Heart size={15} fill={threadLiked ? "currentColor" : "none"} />
              {thread._count.likes}
            </button>

            {thread.authorId === currentUserId && (
              <>
                {editingThread ? (
                  <>
                    <button className="btn-sm-plain" onClick={handleSaveEditThread}>
                      Simpan
                    </button>
                    <button className="btn-sm-plain" onClick={() => setEditingThread(false)}>
                      Batal
                    </button>
                  </>
                ) : (
                  <button className="btn-sm-plain" onClick={() => setEditingThread(true)}>
                    <Pencil size={14} />
                    Edit
                  </button>
                )}
                <button className="btn-sm-plain danger" onClick={handleDeleteThread}>
                  <Trash2 size={14} />
                  Hapus
                </button>
              </>
            )}
          </div>
        </div>

        <div className="section__head" style={{ marginTop: 32 }}>
          <h2>
            <MessageCircle size={18} style={{ verticalAlign: "-3px", marginRight: 6 }} />
            {thread.replies.length} Balasan
          </h2>
        </div>

        <div className="reply-list">
          {thread.replies.map((reply) => {
            const replyLiked = reply.likes?.length > 0;
            return (
              <div className="reply-card" key={reply.id}>
                <div className="reply-card__meta">
                  <strong>{reply.author.username}</strong>
                  <span>{formatDate(reply.createdAt)}</span>
                </div>
                <p>{reply.content}</p>
                <div className="thread-detail__actions">
                  <button
                    className={`like-btn like-btn--sm ${replyLiked ? "liked" : ""}`}
                    onClick={() => handleLikeReply(reply.id)}
                  >
                    <Heart size={13} fill={replyLiked ? "currentColor" : "none"} />
                    {reply._count.likes}
                  </button>
                  {reply.authorId === currentUserId && (
                    <button className="btn-sm-plain danger" onClick={() => handleDeleteReply(reply.id)}>
                      <Trash2 size={13} />
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="reply-form">
          {currentUserId ? (
            <form onSubmit={handlePostReply}>
              <textarea
                rows={3}
                placeholder="Tulis balasan..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              {error && (
                <p className="error-text">
                  <TriangleAlert size={14} />
                  {error}
                </p>
              )}
              <button type="submit" className="btn btn-sm" disabled={posting}>
                {posting ? <Loader2 size={14} className="spin" /> : <Send size={14} />}
                {posting ? "Mengirim..." : "Kirim Balasan"}
              </button>
            </form>
          ) : (
            <p style={{ color: "var(--clay-muted)", fontWeight: 600 }}>
              <Link href="/login" style={{ color: "var(--clay-accent-dark)" }}>
                Masuk
              </Link>{" "}
              dulu buat ikut membalas.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
