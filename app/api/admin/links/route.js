import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isAdminSession } from "../../../../lib/admin-session";

export async function GET() {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await prisma.linkItem.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ links });
}

export async function POST(request) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.label || !body.url) {
    return NextResponse.json({ error: "Label dan URL wajib diisi" }, { status: 400 });
  }

  // Auto taruh di urutan paling akhir kalau nggak dispesifikkan
  const maxSort = await prisma.linkItem.aggregate({ _max: { sortOrder: true } });
  const nextSort = (maxSort._max.sortOrder ?? -1) + 1;

  const link = await prisma.linkItem.create({
    data: {
      label: body.label,
      url: body.url,
      type: body.type || "custom",
      sortOrder: body.sortOrder ?? nextSort,
    },
  });

  return NextResponse.json({ link });
}
