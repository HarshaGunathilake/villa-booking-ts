import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  sendBookingConfirmationToGuest,
  sendBookingNotificationToAdmin,
} from "@/lib/email";
import { startOfDay } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const where = status ? { status: status as any } : {};
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return NextResponse.json({ bookings, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, checkIn, checkOut, adults, children, guests, totalNights, specialRequests } = body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkInDate < startOfDay(new Date())) {
      return NextResponse.json({ error: "Check-in date cannot be in the past" }, { status: 400 });
    }

    // Check for overlapping confirmed bookings
    const overlap = await prisma.booking.findFirst({
      where: {
        status: "CONFIRMED",
        OR: [
          { checkIn: { lt: checkOutDate }, checkOut: { gt: checkInDate } },
        ],
      },
    });

    if (overlap) {
      return NextResponse.json({ error: "Selected dates are not available" }, { status: 409 });
    }

    const booking = await prisma.booking.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: adults || 2,
        children: children || 0,
        guests: guests || adults || 2,
        totalNights,
        specialRequests,
        status: "PENDING",
      },
    });

    // Send emails (non-blocking — never fail the booking if email fails)
    (async () => {
      try {
        const villaSettings = await prisma.villaSettings.findFirst({
          select: { contactEmail: true },
        });
        const adminEmail = villaSettings?.contactEmail || "";
        console.log(`[Email] Sending admin notification to: "${adminEmail}"`);
        await Promise.all([
          sendBookingConfirmationToGuest(booking as any),
          sendBookingNotificationToAdmin(booking as any, adminEmail),
        ]);
        console.log("[Email] Notifications sent successfully");
      } catch (emailErr) {
        console.error("[Email] Error sending notification:", emailErr);
      }
    })();

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}