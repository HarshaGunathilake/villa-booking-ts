import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

async function getDashboardData() {
  const [pending, confirmed, total, upcoming, recentInquiries] = await Promise.all([
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count(),
    prisma.booking.findMany({
      where: { status: "CONFIRMED", checkIn: { gte: new Date() } },
      orderBy: { checkIn: "asc" },
      take: 5,
    }),
    prisma.inquiry.findMany({
      where: { status: "UNREAD" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const recentBookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return { pending, confirmed, total, upcoming, recentBookings, unreadInquiries: recentInquiries.length };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const stats = [
    { icon: Clock, label: "Pending", value: data.pending, color: "text-yellow-600", bg: "bg-yellow-50", href: "/admin/bookings?status=PENDING" },
    { icon: CheckCircle, label: "Confirmed", value: data.confirmed, color: "text-green-600", bg: "bg-green-50", href: "/admin/bookings?status=CONFIRMED" },
    { icon: BookOpen, label: "Total Bookings", value: data.total, color: "text-blue-600", bg: "bg-blue-50", href: "/admin/bookings" },
    { icon: XCircle, label: "Unread Inquiries", value: data.unreadInquiries, color: "text-purple-600", bg: "bg-purple-50", href: "/admin/inquiries" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-villa-dark mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-villa-dark">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-villa-dark">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-xs text-gold hover:underline uppercase tracking-widest">View all</Link>
          </div>
          <div className="space-y-3">
            {data.recentBookings.map((b) => (
              <Link key={b.id} href={`/admin/bookings/${b.id}`} className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded">
                <div>
                  <p className="text-sm font-medium">{b.firstName} {b.lastName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(b.checkIn)} → {formatDate(b.checkOut)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  b.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                  b.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                  b.status === "REJECTED" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-700"
                }`}>{b.status}</span>
              </Link>
            ))}
            {data.recentBookings.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No bookings yet</p>
            )}
          </div>
        </div>

        {/* Upcoming stays */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-villa-dark">Upcoming Stays</h2>
            <Link href="/admin/calendar" className="text-xs text-gold hover:underline uppercase tracking-widest">Calendar</Link>
          </div>
          <div className="space-y-3">
            {data.upcoming.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{b.firstName} {b.lastName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(b.checkIn)} — {b.totalNights} nights · {b.guests} guests</p>
                </div>
              </div>
            ))}
            {data.upcoming.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming confirmed stays</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
