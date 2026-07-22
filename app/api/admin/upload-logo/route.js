import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "../../../../lib/prisma";
import { isAdminSession } from "../../../../lib/admin-session";

export async function POST(request) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "File logo wajib diupload" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Format harus JPG, PNG, WEBP, atau SVG" }, { status: 400 });
  }

  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "Ukuran file maksimal 4MB" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const ext = file.name.split(".").pop();
  // Nama file tetap ("server-logo") biar file lama otomatis "ketimpa" pas ganti logo,
  // nggak numpuk file logo lama yang nggak kepake di disk.
  const fileName = `server-logo.${ext}`;
  const filePath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const logoUrl = `/uploads/${fileName}?v=${Date.now()}`; // cache-bust biar browser nggak nampilin logo lama

  await prisma.serverInfo.upsert({
    where: { id: 1 },
    update: { logoUrl },
    create: { id: 1, logoUrl },
  });

  return NextResponse.json({ logoUrl });
}
