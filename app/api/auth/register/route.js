import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { hashPassword, createSession, isValidUsername, isValidEmail } from "../../../../lib/auth";

export async function POST(request) {
  const body = await request.json();
  const { username, email, password } = body;

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  if (!isValidUsername(username)) {
    return NextResponse.json(
      { error: "Username 3-20 karakter, cuma huruf/angka/underscore" },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password minimal 8 karakter" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (existing) {
    return NextResponse.json(
      { error: existing.username === username ? "Username sudah dipakai" : "Email sudah terdaftar" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { username, email, passwordHash },
  });

  await createSession(user.id);

  return NextResponse.json({ user: { id: user.id, username: user.username } });
}
