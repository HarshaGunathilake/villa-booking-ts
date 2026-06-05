"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DayPicker, DateRange, DayProps } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { differenceInCalendarDays, isBefore, startOfDay, addDays, isSameDay } from "date-fns";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

const schema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Phone number required"),
  adults: z.string(),
  children: z.string(),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof schema>;

export default function BookingClient() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [step, setStep] = useState<"calendar" | "form" | "success">("calendar");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data) => {
        const dates = (data.blockedDates || []).map((d: string) => new Date(d));
        setBlockedDates(dates);
      })
      .catch(() => {});
  }, []);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(schema),
    defaultValues: { adults: "2", children: "0" },
  });

  const nights =
    dateRange?.from && dateRange?.to
      ? differenceInCalendarDays(dateRange.to, dateRange.from)
      : 0;

  const today = startOfDay(new Date());

  const isDateBlocked = (date: Date) => {
    if (isBefore(date, today)) return true;
    return blockedDates.some((d) => isSameDay(d, date));
  };

  const isDateBooked = (date: Date) =>
    blockedDates.some((d) => isSameDay(d, date));

  const isPast = (date: Date) => isBefore(date, today);

  // Custom day renderer with tooltip for booked/past dates
  function CustomDay(props: DayProps) {
    const { date, displayMonth } = props;
    const booked = isDateBooked(date);
    const past = isPast(date);
    const disabled = booked || past;

    const dayNumber = date.getDate();

    const dayEl = (
      <div
        className={`
          relative w-9 h-9 flex items-center justify-center text-sm rounded-full
          transition-colors duration-150 select-none
          ${disabled
            ? "text-gray-300 cursor-not-allowed"
            : "cursor-pointer hover:bg-gold/20"}
          ${booked ? "line-through decoration-red-400" : ""}
        `}
      >
        {dayNumber}
        {booked && (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400" />
        )}
      </div>
    );

    if (booked) {
      return (
        <Tooltip.Root delayDuration={100}>
          <Tooltip.Trigger asChild>
            <td className="rdp-cell">
              {dayEl}
            </td>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="z-50 bg-villa-dark text-white text-xs px-3 py-1.5 rounded shadow-lg"
              sideOffset={6}
            >
              Not available
              <Tooltip.Arrow className="fill-villa-dark" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      );
    }

    return <td className="rdp-cell">{dayEl}</td>;
  }

  const proceedToForm = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    if (nights < 1) {
      toast.error("Please select at least 1 night");
      return;
    }
    setStep("form");
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          checkIn: dateRange!.from!.toISOString(),
          checkOut: dateRange!.to!.toISOString(),
          adults: parseInt(data.adults),
          children: parseInt(data.children),
          guests: parseInt(data.adults) + parseInt(data.children),
          totalNights: nights,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit");
      }
      setStep("success");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "success") {
    return (
      <section className="py-32 bg-villa-cream">
        <motion.div
          className="max-w-lg mx-auto text-center px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle className="w-16 h-16 text-gold mx-auto mb-6" />
          <h2 className="font-serif text-4xl text-villa-dark mb-4">Request Received</h2>
          <div className="w-12 h-px bg-gold mx-auto mb-6" />
          <p className="text-muted-foreground leading-relaxed mb-4">
            Thank you for your booking enquiry. We will confirm availability and reach out within 24 hours.
          </p>
          {dateRange?.from && dateRange?.to && (
            <div className="bg-white p-6 mt-6 text-sm text-left space-y-2">
              <p><span className="font-medium">Check-in:</span> {formatDate(dateRange.from)}</p>
              <p><span className="font-medium">Check-out:</span> {formatDate(dateRange.to)}</p>
              <p><span className="font-medium">Duration:</span> {nights} nights</p>
            </div>
          )}
          <Button
            onClick={() => { setStep("calendar"); setDateRange(undefined); }}
            variant="outline"
            className="mt-8 uppercase tracking-widest text-xs"
          >
            Make Another Enquiry
          </Button>
        </motion.div>
      </section>
    );
  }

  return (
    <Tooltip.Provider>
      <section className="py-20 bg-villa-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3 font-sans">
              Step {step === "calendar" ? "1" : "2"} of 2
            </p>
            <h2 className="font-serif text-4xl text-villa-dark">
              {step === "calendar" ? "Select Your Dates" : "Your Details"}
            </h2>
            <div className="gold-divider" />
          </motion.div>

          {step === "calendar" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              <div className="lg:col-span-2 bg-white p-8 flex justify-center">
                <DayPicker
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  disabled={isDateBlocked}
                  numberOfMonths={2}
                  fromDate={today}
                  toDate={addDays(today, 365)}
                  showOutsideDays={false}
                  modifiers={{ booked: blockedDates }}
                  modifiersClassNames={{ booked: "day-booked" }}
                />
              </div>

              {/* Legend + summary */}
              <div className="space-y-6">
                {/* Legend */}
                <div className="bg-white p-4 flex gap-5 text-xs flex-wrap">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gold inline-block" />
                    Available
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                    Not available
                  </span>
                </div>

                <div className="bg-white p-6">
                  <h3 className="font-serif text-xl text-villa-dark mb-4">Your Selection</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Check-in</span>
                      <span className="font-medium">{dateRange?.from ? formatDate(dateRange.from) : "—"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Check-out</span>
                      <span className="font-medium">{dateRange?.to ? formatDate(dateRange.to) : "—"}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{nights > 0 ? `${nights} nights` : "—"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 text-sm space-y-2">
                  <p className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-3">Booking Info</p>
                  <p>✓ Minimum 1 night stay</p>
                  <p>✓ Up to 10 guests</p>
                  <p>✓ No payment required now</p>
                  <p>✓ We confirm within 24 hours</p>
                </div>

                <Button
                  onClick={proceedToForm}
                  disabled={!dateRange?.from || !dateRange?.to || nights < 1}
                  className="w-full uppercase tracking-widest text-xs py-3 h-auto"
                >
                  Continue to Details
                </Button>
              </div>
            </motion.div>
          )}

          {step === "form" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              <div className="lg:col-span-2 bg-white p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input {...register("firstName")} placeholder="John" />
                      {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input {...register("lastName")} placeholder="Smith" />
                      {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" {...register("email")} placeholder="your@email.com" />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Phone / WhatsApp</Label>
                      <Input {...register("phone")} placeholder="+1 234 567 890" />
                      {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Adults</Label>
                      <Select onValueChange={(v) => setValue("adults", v)} defaultValue="2">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8].map((n) => (
                            <SelectItem key={n} value={String(n)}>{n} Adult{n > 1 ? "s" : ""}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Children</Label>
                      <Select onValueChange={(v) => setValue("children", v)} defaultValue="0">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {[0,1,2,3,4,5].map((n) => (
                            <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "Child" : "Children"}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Special Requests (optional)</Label>
                    <Textarea
                      {...register("specialRequests")}
                      placeholder="Any dietary requirements, special occasions, accessibility needs..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("calendar")}
                      className="flex-1 uppercase tracking-widest text-xs py-3 h-auto"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 uppercase tracking-widest text-xs py-3 h-auto"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="bg-white p-6 h-fit">
                <h3 className="font-serif text-xl text-villa-dark mb-4">Booking Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Check-in</span>
                    <span className="font-medium">{dateRange?.from ? formatDate(dateRange.from) : "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Check-out</span>
                    <span className="font-medium">{dateRange?.to ? formatDate(dateRange.to) : "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{nights} nights</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                  No payment is taken at this stage. We will confirm availability and send a formal quote within 24 hours.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Tooltip.Provider>
  );
}
