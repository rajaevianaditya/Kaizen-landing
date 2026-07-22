import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { getCurrentUser } from "../../../../../../lib/auth";

export async function POST(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Kamu harus login dulu untuk membalas" }, { status: 401 });
  }

  const body = await request.json();
  const { content } = body;

  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Isi balasan tidak boleh kosong" }, { status: 400 });
  }

  const thread = await prisma.forumThread.findUnique({ where: { id: params.id } });
  if (!thread) {
    return NextResponse.json({ error: "Thread tidak ditemukan" }, { status: 404 });
  }

  const reply = await prisma.forumReply.create({
    data: { content, threadId: params.id, authorId: user.id },
    include: { author: { select: { username: true } } },
  });

  return NextResponse.json({ reply });
}
