import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getCurrentUser } from "../../../../../lib/auth";
import { isAdminSession } from "../../../../../lib/admin-session";

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Kamu harus login" }, { status: 401 });
  }

  const reply = await prisma.forumReply.findUnique({ where: { id: params.id } });
  if (!reply) {
    return NextResponse.json({ error: "Balasan tidak ditemukan" }, { status: 404 });
  }

  if (reply.authorId !== user.id) {
    return NextResponse.json({ error: "Kamu cuma bisa edit balasan milik sendiri" }, { status: 403 });
  }

  const body = await request.json();
  const updated = await prisma.forumReply.update({
    where: { id: params.id },
    data: { content: body.content ?? reply.content },
  });

  return NextResponse.json({ reply: updated });
}

export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  const isAdmin = isAdminSession();

  if (!user && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reply = await prisma.forumReply.findUnique({ where: { id: params.id } });
  if (!reply) {
    return NextResponse.json({ error: "Balasan tidak ditemukan" }, { status: 404 });
  }

  if (!isAdmin && reply.authorId !== user.id) {
    return NextResponse.json({ error: "Kamu cuma bisa hapus balasan milik sendiri" }, { status: 403 });
  }

  await prisma.forumReply.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
