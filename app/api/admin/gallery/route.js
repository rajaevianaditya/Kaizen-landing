import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "../../../../lib/prisma";
import { isAdminSession } from "../../../../lib/admin-session";
import { getCurrentUser } from "../../../../lib/auth";

export async function GET() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
    include: { uploadedBy: { select: { username: true } } },
  });
  return NextResponse.json({ images });
}

export async function POST(request) {
  const isAdmin = isAdminSession();
  const user = await getCurrentUser();

  if (!isAdmin && !user) {
    return NextResponse.json(
      { error: "Kamu harus login dulu untuk upload foto ke galeri" },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const caption = formData.get("caption") || "";

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "File gambar wajib diupload" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Format harus JPG, PNG, WEBP, atau GIF" }, { status: 400 });
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Ukuran file maksimal 8MB" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");
  await mkdir(uploadDir, { recursive: true });

  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const maxSort = await prisma.galleryImage.aggregate({ _max: { sortOrder: true } });
  const nextSort = (maxSort._max.sortOrder ?? -1) + 1;

  const image = await prisma.galleryImage.create({
    data: {
      imagePath: `/uploads/gallery/${fileName}`,
      caption: caption || null,
      sortOrder: nextSort,
      // Admin upload lewat dashboard -> uploadedById null (dianggap "official").
      // Member upload lewat /gallery -> tercatat siapa yang upload.
      uploadedById: isAdmin ? null : user.id,
    },
    include: { uploadedBy: { select: { username: true } } },
  });

  return NextResponse.json({ image });
}
