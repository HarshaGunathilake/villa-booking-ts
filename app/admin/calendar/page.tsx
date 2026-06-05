import { prisma } from "@/lib/prisma";
import AdminCalendarClient from "./AdminCalendarClient";

export default async function AdminCalendarPage() {
  const [bookings, blockedDates] = await Promise.all([
    prisma.booking.findMany({
      where: { status: "CONFIRMED", checkOut: { gte: new Date() } },
      orderBy: { checkIn: "asc" },
    }),
    prisma.blockedDate.findMany({ orderBy: { date: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl text-villa-dark mb-8">Availability Calendar</h1>
      <AdminCalendarClient bookings={bookings as any} blockedDates={blockedDates as any} />
    </div>
  );
}
