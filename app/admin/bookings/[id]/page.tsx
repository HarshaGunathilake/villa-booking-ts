import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingDetail from "@/components/admin/BookingDetail";

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl text-villa-dark mb-8">Booking Details</h1>
      <BookingDetail booking={booking as any} />
    </div>
  );
}
