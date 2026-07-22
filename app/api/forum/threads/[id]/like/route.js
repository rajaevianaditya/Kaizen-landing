import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { getCurrentUser } from "../../../../../../lib/auth";

export async function POST(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Kamu harus login untuk like" }, { status: 401 });
  }

  const existing = await prisma.threadLike.findUnique({
    where: { threadId_userId: { threadId: params.id, userId: user.id } },
  });

  if (existing) {
    await prisma.threadLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.threadLike.create({ data: { threadId: params.id, userId: user.id } });
  }

  const count = await prisma.threadLike.count({ where: { threadId: params.id } });

  return NextResponse.json({ liked: !existing, count });
}
