import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendBookingStatusUpdate } from "@/lib/email";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ booking });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { status, adminNotes } = body;

    const updateData: any = { adminNotes };

    if (status === "CONFIRMED") {
      // Check for conflicts with other confirmed bookings
      const current = await prisma.booking.findUnique({ where: { id: params.id } });
      if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

      const conflict = await prisma.booking.findFirst({
        where: {
          id: { not: params.id },
          status: "CONFIRMED",
          OR: [{ checkIn: { lt: current.checkOut }, checkOut: { gt: current.checkIn } }],
        },
      });

      if (conflict) {
        return NextResponse.json({ error: "Dates conflict with another confirmed booking" }, { status: 409 });
      }

      updateData.status = "CONFIRMED";
      updateData.confirmedAt = new Date();
    } else if (status === "REJECTED") {
      updateData.status = "REJECTED";
      updateData.rejectedAt = new Date();
    } else if (status) {
      updateData.status = status;
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
    });

    // Send email if status changed to confirmed or rejected
    if (status === "CONFIRMED" || status === "REJECTED") {
      try {
        await sendBookingStatusUpdate(booking as any, status);
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }
    }

    return NextResponse.json({ booking });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.booking.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
