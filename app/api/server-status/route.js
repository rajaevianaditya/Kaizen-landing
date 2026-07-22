import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerStatus } from "../../../lib/minecraft-ping";

// Cache in-memory sederhana (per-instance server) biar nggak ping server Minecraft
// tiap kali ada pengunjung buka halaman — cukup sekali tiap beberapa detik.
let cachedResult = null;
let cachedAt = 0;
const CACHE_DURATION_MS = 15_000;

export async function GET() {
  const now = Date.now();

  if (cachedResult && now - cachedAt < CACHE_DURATION_MS) {
    return NextResponse.json(cachedResult);
  }

  const serverInfo = await prisma.serverInfo.findUnique({ where: { id: 1 } });
  const pingHost = serverInfo?.pingHost || "localhost";
  const pingPort = serverInfo?.pingPort || 25565;

  const result = await getServerStatus(pingHost, pingPort);

  cachedResult = result;
  cachedAt = now;

  return NextResponse.json(result);
}
