import { NextResponse } from "next/server";
import { setAdminSession, verifyAdminPassword } from "../../../../lib/admin-session";

export async function POST(request) {
  const body = await request.json();
  const password = body.password || "";

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }

  setAdminSession();
  return NextResponse.json({ success: true });
}
