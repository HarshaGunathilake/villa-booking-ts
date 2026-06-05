"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Booking } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { ArrowLeft, Mail, Phone, Calendar, Users } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, any> = {
  PENDING: "pending", CONFIRMED: "confirmed", REJECTED: "rejected", CANCELLED: "cancelled",
};

export default function BookingDetail({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes || "");
  const [loading, setLoading] = useState<string | null>(null);

  const update = async (status?: string) => {
    setLoading(status || "notes");
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      toast.success(status ? `Booking ${status.toLowerCase()}` : "Notes saved");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-3xl">
      <Link href="/admin/bookings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={16} /> Back to Bookings
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl">Guest Information</h2>
              <Badge variant={statusColors[booking.status]}>{booking.status}</Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium w-24">Name</span>
                <span>{booking.firstName} {booking.lastName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gold" />
                <a href={`mailto:${booking.email}`} className="text-gold hover:underline">{booking.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gold" />
                <span>{booking.phone}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-serif text-xl mb-4">Stay Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Check-in</p>
                <p className="font-medium">{formatDate(booking.checkIn)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Check-out</p>
                <p className="font-medium">{formatDate(booking.checkOut)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Duration</p>
                <p className="font-medium">{booking.totalNights} nights</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Guests</p>
                <p className="font-medium">{booking.adults} adults{booking.children > 0 ? `, ${booking.children} children` : ""}</p>
              </div>
            </div>
            {booking.specialRequests && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Special Requests</p>
                <p className="text-sm">{booking.specialRequests}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-serif text-xl mb-4">Admin Notes</h2>
            <div className="space-y-3">
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes about this booking..."
                rows={4}
              />
              <Button onClick={() => update()} disabled={loading === "notes"} variant="outline" size="sm" className="uppercase tracking-widest text-xs">
                Save Notes
              </Button>
            </div>
          </div>
        </div>

        {/* Actions sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-4 text-sm uppercase tracking-widest text-muted-foreground">Actions</h3>
            <div className="space-y-3">
              {booking.status === "PENDING" && (
                <>
                  <Button
                    onClick={() => update("CONFIRMED")}
                    disabled={!!loading}
                    className="w-full uppercase tracking-widest text-xs py-3 h-auto bg-green-600 hover:bg-green-700"
                  >
                    {loading === "CONFIRMED" ? "Confirming..." : "Confirm Booking"}
                  </Button>
                  <Button
                    onClick={() => update("REJECTED")}
                    disabled={!!loading}
                    variant="destructive"
                    className="w-full uppercase tracking-widest text-xs py-3 h-auto"
                  >
                    {loading === "REJECTED" ? "Rejecting..." : "Reject Booking"}
                  </Button>
                </>
              )}
              {booking.status === "CONFIRMED" && (
                <Button
                  onClick={() => update("CANCELLED")}
                  disabled={!!loading}
                  variant="outline"
                  className="w-full uppercase tracking-widest text-xs py-3 h-auto"
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm text-xs space-y-2 text-muted-foreground">
            <p><span className="font-medium">Booking ID:</span> {booking.id.slice(0, 8)}...</p>
            <p><span className="font-medium">Submitted:</span> {formatDate(booking.createdAt)}</p>
            {booking.confirmedAt && <p><span className="font-medium">Confirmed:</span> {formatDate(booking.confirmedAt)}</p>}
            {booking.rejectedAt && <p><span className="font-medium">Rejected:</span> {formatDate(booking.rejectedAt)}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
