import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getCurrentUser } from "../../../../../lib/auth";
import { isAdminSession } from "../../../../../lib/admin-session";

export async function GET(request, { params }) {
  const user = await getCurrentUser();

  const thread = await prisma.forumThread.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { username: true } },
      category: { select: { name: true, slug: true } },
      likes: user ? { where: { userId: user.id } } : false,
      _count: { select: { likes: true } },
      replies: {
        include: {
          author: { select: { username: true } },
          _count: { select: { likes: true } },
          likes: user ? { where: { userId: user.id } } : false,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!thread) {
    return NextResponse.json({ error: "Thread tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ thread, currentUserId: user?.id || null });
}

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Kamu harus login" }, { status: 401 });
  }

  const thread = await prisma.forumThread.findUnique({ where: { id: params.id } });
  if (!thread) {
    return NextResponse.json({ error: "Thread tidak ditemukan" }, { status: 404 });
  }

  if (thread.authorId !== user.id) {
    return NextResponse.json({ error: "Kamu cuma bisa edit thread milik sendiri" }, { status: 403 });
  }

  const body = await request.json();
  const updated = await prisma.forumThread.update({
    where: { id: params.id },
    data: {
      title: body.title ?? thread.title,
      content: body.content ?? thread.content,
    },
  });

  return NextResponse.json({ thread: updated });
}

export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  const isAdmin = isAdminSession();

  if (!user && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const thread = await prisma.forumThread.findUnique({ where: { id: params.id } });
  if (!thread) {
    return NextResponse.json({ error: "Thread tidak ditemukan" }, { status: 404 });
  }

  // Boleh hapus kalau pemilik thread ATAU admin (moderasi)
  if (!isAdmin && thread.authorId !== user.id) {
    return NextResponse.json({ error: "Kamu cuma bisa hapus thread milik sendiri" }, { status: 403 });
  }

  await prisma.forumThread.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
