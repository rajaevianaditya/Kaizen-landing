import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { getCurrentUser } from "../../../../../../lib/auth";

export async function POST(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Kamu harus login untuk like" }, { status: 401 });
  }

  const existing = await prisma.replyLike.findUnique({
    where: { replyId_userId: { replyId: params.id, userId: user.id } },
  });

  if (existing) {
    await prisma.replyLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.replyLike.create({ data: { replyId: params.id, userId: user.id } });
  }

  const count = await prisma.replyLike.count({ where: { replyId: params.id } });

  return NextResponse.json({ liked: !existing, count });
}
