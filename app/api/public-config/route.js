import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  let serverInfo = await prisma.serverInfo.findUnique({ where: { id: 1 } });

  // Belum pernah diisi admin sama sekali -> buat default row biar nggak null
  if (!serverInfo) {
    serverInfo = await prisma.serverInfo.create({ data: { id: 1 } });
  }

  const links = await prisma.linkItem.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });

  const features = await prisma.featureHighlight.findMany({ orderBy: { sortOrder: "asc" } });

  return NextResponse.json({ serverInfo, links, features });
}
