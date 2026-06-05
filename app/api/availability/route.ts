import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, addDays, eachDayOfInterval } from "date-fns";

export async function GET() {
  try {
    const today = startOfDay(new Date());
    const endDate = addDays(today, 365);

    // Get confirmed bookings
    const confirmedBookings = await prisma.booking.findMany({
      where: {
        status: "CONFIRMED",
        checkOut: { gte: today },
        checkIn: { lte: endDate },
      },
      select: { checkIn: true, checkOut: true },
    });

    // Get manually blocked dates
    const manualBlocked = await prisma.blockedDate.findMany({
      where: { date: { gte: today, lte: endDate } },
      select: { date: true },
    });

    const blockedDates: string[] = [];

    // Add booked ranges
    for (const booking of confirmedBookings) {
      const days = eachDayOfInterval({
        start: booking.checkIn,
        end: addDays(booking.checkOut, -1),
      });
      days.forEach((d) => blockedDates.push(d.toISOString().split("T")[0]));
    }

    // Add manual blocks
    manualBlocked.forEach((b) => blockedDates.push(b.date.toISOString().split("T")[0]));

    return NextResponse.json({ blockedDates: Array.from(new Set(blockedDates)) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
