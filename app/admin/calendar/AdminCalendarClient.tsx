"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useRouter } from "next/navigation";
import { eachDayOfInterval, addDays } from "date-fns";
import { Booking, BlockedDate } from "@/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

interface Props {
  bookings: Booking[];
  blockedDates: BlockedDate[];
}

export default function AdminCalendarClient({ bookings, blockedDates }: Props) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [blockReason, setBlockReason] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);

  const bookedDays: Date[] = [];
  bookings.forEach((b) => {
    const days = eachDayOfInterval({ start: new Date(b.checkIn), end: addDays(new Date(b.checkOut), -1) });
    bookedDays.push(...days);
  });

  const manualBlockedDays = blockedDates.map((d) => new Date(d.date));

  const blockDate = async () => {
    if (!selectedDate) return;
    setIsBlocking(true);
    try {
      const res = await fetch("/api/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate.toISOString(), reason: blockReason }),
      });
      if (!res.ok) throw new Error();
      toast.success("Date blocked");
      setSelectedDate(undefined);
      setBlockReason("");
      router.refresh();
    } catch {
      toast.error("Failed to block date");
    } finally {
      setIsBlocking(false);
    }
  };

  const unblockDate = async (id: string) => {
    try {
      const res = await fetch("/api/blocked-dates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast.success("Date unblocked");
      router.refresh();
    } catch {
      toast.error("Failed to unblock date");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
        <div className="flex gap-4 flex-wrap mb-6 text-xs">
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-green-200 border border-green-400 inline-block" /> Confirmed Booking</span>
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-red-200 border border-red-400 inline-block" /> Manually Blocked</span>
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gold inline-block" /> Selected</span>
        </div>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          numberOfMonths={2}
          modifiers={{ booked: bookedDays, manualBlocked: manualBlockedDays }}
          modifiersClassNames={{
            booked: "!bg-green-100 !text-green-800 rounded",
            manualBlocked: "!bg-red-100 !text-red-800 rounded",
          }}
          fromDate={new Date()}
        />
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-serif text-xl mb-4">Block a Date</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {selectedDate ? `Selected: ${formatDate(selectedDate)}` : "Click a date on the calendar to select it"}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <Input value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="e.g., Maintenance, Owner stay" />
            </div>
            <Button onClick={blockDate} disabled={!selectedDate || isBlocking} className="w-full uppercase tracking-widest text-xs py-3 h-auto">
              {isBlocking ? "Blocking..." : "Block Date"}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-serif text-xl mb-4">Manually Blocked ({blockedDates.length})</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {blockedDates.map((d) => (
              <div key={d.id} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{formatDate(d.date)}</p>
                  {d.reason && <p className="text-xs text-muted-foreground">{d.reason}</p>}
                </div>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => unblockDate(d.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            {blockedDates.length === 0 && <p className="text-sm text-muted-foreground">No manually blocked dates</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
