import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getCurrentUser } from "../../../../lib/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");

  const threads = await prisma.forumThread.findMany({
    where: categorySlug ? { category: { slug: categorySlug } } : undefined,
    include: {
      author: { select: { username: true } },
      category: { select: { name: true, slug: true } },
      _count: { select: { replies: true, likes: true } },
    },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    take: 50,
  });

  return NextResponse.json({ threads });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Kamu harus login dulu untuk membuat thread" }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, categoryId } = body;

  if (!title || !content || !categoryId) {
    return NextResponse.json({ error: "Judul, isi, dan kategori wajib diisi" }, { status: 400 });
  }

  if (title.length > 150) {
    return NextResponse.json({ error: "Judul maksimal 150 karakter" }, { status: 400 });
  }

  const category = await prisma.forumCategory.findUnique({ where: { id: categoryId } });
  if (!category) {
    return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
  }

  const thread = await prisma.forumThread.create({
    data: { title, content, categoryId, authorId: user.id },
  });

  return NextResponse.json({ thread });
}
