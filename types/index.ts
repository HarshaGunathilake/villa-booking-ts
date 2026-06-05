export type BookingStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
export type InquiryStatus = "UNREAD" | "READ" | "REPLIED";

export interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: Date | string;
  checkOut: Date | string;
  guests: number;
  adults: number;
  children: number;
  specialRequests?: string | null;
  status: BookingStatus;
  totalNights: number;
  adminNotes?: string | null;
  confirmedAt?: Date | string | null;
  rejectedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BlockedDate {
  id: string;
  date: Date | string;
  reason?: string | null;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  createdAt: Date | string;
}

export interface VillaSettings {
  id: string;
  villaName: string;
  tagline: string;
  description: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  minNights: number;
  checkInTime: string;
  checkOutTime: string;
  pricePerNight: number;
  currency: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  instagramUrl: string;
  facebookUrl: string;
  googleMapsEmbedUrl: string;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  specialRequests?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
