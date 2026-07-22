import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyPassword, createSession } from "../../../../lib/auth";

export async function POST(request) {
  const body = await request.json();
  const { identifier, password } = body; // identifier = username atau email

  if (!identifier || !password) {
    return NextResponse.json({ error: "Username/email dan password wajib diisi" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ username: identifier }, { email: identifier }] },
  });

  if (!user) {
    return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }

  await createSession(user.id);

  return NextResponse.json({ user: { id: user.id, username: user.username } });
}
