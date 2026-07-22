import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isAdminSession } from "../../../../lib/admin-session";

export async function GET() {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let serverInfo = await prisma.serverInfo.findUnique({ where: { id: 1 } });
  if (!serverInfo) {
    serverInfo = await prisma.serverInfo.create({ data: { id: 1 } });
  }

  return NextResponse.json({ serverInfo });
}

export async function PUT(request) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const serverInfo = await prisma.serverInfo.upsert({
    where: { id: 1 },
    update: {
      serverName: body.serverName,
      description: body.description,
      displayIp: body.displayIp,
      displayPort: parseInt(body.displayPort, 10) || 25565,
      pingHost: body.pingHost,
      pingPort: parseInt(body.pingPort, 10) || 25565,
      discordInviteUrl: body.discordInviteUrl || null,
    },
    create: {
      id: 1,
      serverName: body.serverName,
      description: body.description,
      displayIp: body.displayIp,
      displayPort: parseInt(body.displayPort, 10) || 25565,
      pingHost: body.pingHost,
      pingPort: parseInt(body.pingPort, 10) || 25565,
      discordInviteUrl: body.discordInviteUrl || null,
    },
  });

  return NextResponse.json({ serverInfo });
}
