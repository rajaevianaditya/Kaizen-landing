import { NextResponse } from "next/server";
import { clearAdminSession } from "../../../../lib/admin-session";

export async function DELETE() {
  clearAdminSession();
  return NextResponse.json({ success: true });
}
