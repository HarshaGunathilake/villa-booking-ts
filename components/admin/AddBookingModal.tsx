"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";

const schema = z
  .object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Required"),
    checkIn: z.string().min(1, "Required"),
    checkOut: z.string().min(1, "Required"),
    adults: z.string().min(1),
    children: z.string(),
    status: z.enum(["CONFIRMED", "PENDING"]),
    specialRequests: z.string().optional(),
    adminNotes: z.string().optional(),
  })
  .refine(
    (d) => !d.checkIn || !d.checkOut || new Date(d.checkOut) > new Date(d.checkIn),
    { message: "Check-out must be after check-in", path: ["checkOut"] }
  );

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddBookingModal({ open, onClose }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      adults: "2",
      children: "0",
      status: "CONFIRMED",
    },
  });

  const checkIn = watch("checkIn");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to create booking");
      }

      toast.success("Booking created successfully");
      reset();
      onClose();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Add Manual Booking</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
          {/* Guest Details */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Guest Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>First Name *</Label>
                <Input {...register("firstName")} placeholder="John" />
                {errors.firstName && (
                  <p className="text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Last Name *</Label>
                <Input {...register("lastName")} placeholder="Smith" />
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input {...register("email")} type="email" placeholder="john@example.com" />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Phone *</Label>
                <Input {...register("phone")} placeholder="+1 234 567 8900" />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Stay Dates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Check-in *</Label>
                <Input {...register("checkIn")} type="date" />
                {errors.checkIn && (
                  <p className="text-xs text-red-500">{errors.checkIn.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Check-out *</Label>
                <Input
                  {...register("checkOut")}
                  type="date"
                  min={checkIn || undefined}
                />
                {errors.checkOut && (
                  <p className="text-xs text-red-500">{errors.checkOut.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Guests & Status */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Guests & Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Adults</Label>
                <Input {...register("adults")} type="number" min="1" max="20" />
              </div>
              <div className="space-y-1.5">
                <Label>Children</Label>
                <Input {...register("children")} type="number" min="0" max="20" />
              </div>
              <div className="space-y-1.5 sm:col-span-1 col-span-2">
                <Label>Status</Label>
                <Select
                  defaultValue="CONFIRMED"
                  onValueChange={(v) => setValue("status", v as "CONFIRMED" | "PENDING")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Notes
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Guest Special Requests</Label>
                <Textarea
                  {...register("specialRequests")}
                  placeholder="Any special requests from the guest..."
                  rows={2}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Admin Notes</Label>
                <Textarea
                  {...register("adminNotes")}
                  placeholder="Internal notes (not visible to guest)..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="uppercase tracking-widest text-xs">
              {isSubmitting ? "Creating..." : "Create Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

