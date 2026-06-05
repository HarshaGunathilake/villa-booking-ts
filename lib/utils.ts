import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInCalendarDays, eachDayOfInterval, format, isSameDay } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "d MMM yyyy");
}

export function calculateNights(checkIn: Date, checkOut: Date): number {
  return differenceInCalendarDays(checkOut, checkIn);
}

export function getDatesInRange(start: Date, end: Date): Date[] {
  return eachDayOfInterval({ start, end });
}

export function isDateBlocked(date: Date, blockedDates: Date[]): boolean {
  return blockedDates.some((d) => isSameDay(d, date));
}
