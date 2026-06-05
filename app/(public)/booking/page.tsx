import { Metadata } from "next";
import Image from "next/image";
import BookingClient from "./BookingClient";

export const metadata: Metadata = {
  title: "Check Availability & Book",
};

export default function BookingPage() {
  return (
    <>
      <section className="relative h-72 flex items-end pb-16">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2070" alt="Booking" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-villa-dark/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <p className="text-xs uppercase tracking-[0.4em] text-gold font-sans mb-2">Plan Your Stay</p>
          <h1 className="font-serif text-5xl text-white">Check Availability</h1>
        </div>
      </section>
      <BookingClient />
    </>
  );
}
