"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Booking } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  bookings: Booking[];
  total: number;
  page: number;
}

const statusColors: Record<string, any> = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

export default function BookingsTable({ bookings, total, page }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      toast.success(`Booking ${status.toLowerCase()}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Error updating booking");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", "PENDING", "CONFIRMED", "REJECTED", "CANCELLED"].map((s) => (
          <Link
            key={s}
            href={s === "All" ? "/admin/bookings" : `/admin/bookings?status=${s}`}
            className="text-xs uppercase tracking-widest px-4 py-2 border border-border hover:bg-gold hover:text-white hover:border-gold transition-colors"
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Guest</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Dates</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Guests</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Status</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Received</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <p className="font-medium">{b.firstName} {b.lastName}</p>
                  <p className="text-xs text-muted-foreground">{b.email}</p>
                </td>
                <td className="px-4 py-4">
                  <p>{formatDate(b.checkIn)} → {formatDate(b.checkOut)}</p>
                  <p className="text-xs text-muted-foreground">{b.totalNights} nights</p>
                </td>
                <td className="px-4 py-4">{b.guests}</td>
                <td className="px-4 py-4">
                  <Badge variant={statusColors[b.status] || "default"}>{b.status}</Badge>
                </td>
                <td className="px-4 py-4 text-muted-foreground">{formatDate(b.createdAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {b.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 px-2"
                          onClick={() => updateStatus(b.id, "CONFIRMED")}
                          disabled={loading === b.id}
                        >
                          <CheckCircle size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                          onClick={() => updateStatus(b.id, "REJECTED")}
                          disabled={loading === b.id}
                        >
                          <XCircle size={16} />
                        </Button>
                      </>
                    )}
                    <Link href={`/admin/bookings/${b.id}`}>
                      <Button size="sm" variant="ghost" className="h-8 px-2">
                        <Eye size={16} />
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No bookings found</div>
        )}
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Showing {bookings.length} of {total} bookings
      </div>
    </div>
  );
}
