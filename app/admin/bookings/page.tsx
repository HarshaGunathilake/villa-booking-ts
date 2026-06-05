import { prisma } from "@/lib/prisma";
import BookingsTable from "@/components/admin/BookingsTable";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const status = searchParams.status as any;
  const page = parseInt(searchParams.page || "1");
  const limit = 20;

  const where = status ? { status } : {};

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl text-villa-dark mb-8">Bookings</h1>
      <BookingsTable bookings={bookings} total={total} page={page} />
    </div>
  );
}
