import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { isAdminSession } from "../../../../../lib/admin-session";

export async function PATCH(request, { params }) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const data = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.icon !== undefined) data.icon = body.icon;
  if (body.sortOrder !== undefined) data.sortOrder = parseInt(body.sortOrder, 10);

  const feature = await prisma.featureHighlight.update({ where: { id: params.id }, data });
  return NextResponse.json({ feature });
}

export async function DELETE(request, { params }) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.featureHighlight.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
