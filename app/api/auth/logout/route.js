import { NextResponse } from "next/server";
import { destroySession } from "../../../../lib/auth";

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ success: true });
}
