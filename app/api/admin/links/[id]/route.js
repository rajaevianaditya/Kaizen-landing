import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { isAdminSession } from "../../../../../lib/admin-session";

export async function PATCH(request, { params }) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const data = {};

  if (body.label !== undefined) data.label = String(body.label);
  if (body.url !== undefined) data.url = String(body.url);
  if (body.type !== undefined) data.type = String(body.type);
  if (body.sortOrder !== undefined) data.sortOrder = parseInt(body.sortOrder, 10);
  if (body.visible !== undefined) data.visible = Boolean(body.visible);

  const link = await prisma.linkItem.update({ where: { id: params.id }, data });
  return NextResponse.json({ link });
}

export async function DELETE(request, { params }) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.linkItem.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
