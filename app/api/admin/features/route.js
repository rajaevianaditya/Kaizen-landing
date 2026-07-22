import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isAdminSession } from "../../../../lib/admin-session";

export async function GET() {
  const features = await prisma.featureHighlight.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ features });
}

export async function POST(request) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.title || !body.description) {
    return NextResponse.json({ error: "Judul dan deskripsi wajib diisi" }, { status: 400 });
  }

  const maxSort = await prisma.featureHighlight.aggregate({ _max: { sortOrder: true } });
  const nextSort = (maxSort._max.sortOrder ?? -1) + 1;

  const feature = await prisma.featureHighlight.create({
    data: {
      title: body.title,
      description: body.description,
      icon: body.icon || "sparkles",
      sortOrder: nextSort,
    },
  });

  return NextResponse.json({ feature });
}
