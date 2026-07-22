import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { isAdminSession } from "../../../../../lib/admin-session";

export async function PATCH(request, { params }) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const data = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.description !== undefined) data.description = body.description;
  if (body.sortOrder !== undefined) data.sortOrder = parseInt(body.sortOrder, 10);

  const category = await prisma.forumCategory.update({ where: { id: params.id }, data });
  return NextResponse.json({ category });
}

export async function DELETE(request, { params }) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const threadCount = await prisma.forumThread.count({ where: { categoryId: params.id } });
  if (threadCount > 0) {
    return NextResponse.json(
      { error: `Kategori masih punya ${threadCount} thread, pindahkan/hapus dulu sebelum menghapus kategori` },
      { status: 409 }
    );
  }

  await prisma.forumCategory.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
