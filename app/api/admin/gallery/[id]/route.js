import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "../../../../../lib/prisma";
import { isAdminSession } from "../../../../../lib/admin-session";
import { getCurrentUser } from "../../../../../lib/auth";

export async function DELETE(request, { params }) {
  const isAdmin = isAdminSession();
  const user = await getCurrentUser();

  if (!isAdmin && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const image = await prisma.galleryImage.findUnique({ where: { id: params.id } });
  if (!image) {
    return NextResponse.json({ error: "Gambar tidak ditemukan" }, { status: 404 });
  }

  // Admin boleh hapus foto siapapun. Member cuma boleh hapus foto upload sendiri.
  if (!isAdmin && image.uploadedById !== user.id) {
    return NextResponse.json({ error: "Kamu cuma bisa hapus foto upload sendiri" }, { status: 403 });
  }

  await prisma.galleryImage.delete({ where: { id: params.id } });

  // Hapus file fisik juga, tapi kalau gagal (misal udah kehapus manual) jangan
  // sampe bikin request ini error — data DB udah kehapus, itu yang paling penting.
  try {
    const filePath = path.join(process.cwd(), "public", image.imagePath);
    await unlink(filePath);
  } catch (err) {
    // ignore
  }

  return NextResponse.json({ success: true });
}
