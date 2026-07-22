import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isAdminSession } from "../../../../lib/admin-session";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const categories = await prisma.forumCategory.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ categories });
}

export async function POST(request) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.name) {
    return NextResponse.json({ error: "Nama kategori wajib diisi" }, { status: 400 });
  }

  const slug = slugify(body.name);
  const existing = await prisma.forumCategory.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Kategori dengan nama serupa sudah ada" }, { status: 409 });
  }

  const maxSort = await prisma.forumCategory.aggregate({ _max: { sortOrder: true } });
  const nextSort = (maxSort._max.sortOrder ?? -1) + 1;

  const category = await prisma.forumCategory.create({
    data: {
      name: body.name,
      slug,
      description: body.description || null,
      sortOrder: nextSort,
    },
  });

  return NextResponse.json({ category });
}
