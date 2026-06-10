import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { differenceInCalendarDays } from "date-fns";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      checkIn,
      checkOut,
      adults,
      children,
      specialRequests,
      adminNotes,
      status = "CONFIRMED",
    } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return NextResponse.json({ error: "Check-out must be after check-in" }, { status: 400 });
    }

    const totalNights = differenceInCalendarDays(checkOutDate, checkInDate);
    const adultCount = parseInt(adults) || 1;
    const childCount = parseInt(children) || 0;
    const totalGuests = adultCount + childCount;

    // Check for overlapping CONFIRMED bookings
    const overlap = await prisma.booking.findFirst({
      where: {
        status: "CONFIRMED",
        checkIn: { lt: checkOutDate },
        checkOut: { gt: checkInDate },
      },
    });

    if (overlap) {
      return NextResponse.json(
        { error: "These dates overlap with an existing confirmed booking" },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: adultCount,
        children: childCount,
        guests: totalGuests,
        totalNights,
        specialRequests: specialRequests || null,
        adminNotes: adminNotes || null,
        status,
        confirmedAt: status === "CONFIRMED" ? new Date() : null,
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Admin booking creation error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
