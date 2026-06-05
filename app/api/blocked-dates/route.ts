import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dates = await prisma.blockedDate.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json({ dates });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, reason } = await req.json();

  const blocked = await prisma.blockedDate.upsert({
    where: { date: new Date(date) },
    update: { reason },
    create: { date: new Date(date), reason },
  });

  return NextResponse.json({ blocked }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await prisma.blockedDate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
