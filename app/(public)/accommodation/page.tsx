"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Users, Wifi, Utensils, Car, Waves, Wind } from "lucide-react";

const amenities = [
  { icon: Bed, label: "5 King Bedrooms" },
  { icon: Bath, label: "5 En-suite Bathrooms" },
  { icon: Users, label: "Up to 10 Guests" },
  { icon: Wifi, label: "High-Speed WiFi" },
  { icon: Utensils, label: "Gourmet Kitchen" },
  { icon: Car, label: "Private Parking" },
  { icon: Waves, label: "Infinity Pool & Jacuzzi" },
  { icon: Wind, label: "Air Conditioning" },
];

const rooms = [
  { name: "Master Suite", description: "The crown jewel of Villa Serenity, featuring a king-size bed, private terrace with panoramic views, and a luxurious en-suite with freestanding bath.", img: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800" },
  { name: "Garden Suite", description: "A tranquil retreat overlooking the lush garden, with direct pool access and a serene, nature-inspired décor palette.", img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800" },
  { name: "Ocean View Room", description: "Wake to breathtaking ocean vistas in this beautifully appointed bedroom with custom furnishings and a private balcony.", img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800" },
];

export default function AccommodationPage() {
  return (
    <>
      <section className="relative h-72 flex items-end pb-16">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1616137422495-1e9e46e2aa1e?q=80&w=2070" alt="The Villa" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-villa-dark/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <p className="text-xs uppercase tracking-[0.4em] text-gold font-sans mb-2">The Villa</p>
          <h1 className="font-serif text-5xl text-white">Accommodation</h1>
        </div>
      </section>

      {/* Overview */}
      <section className="py-24 bg-villa-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4 font-sans">Overview</p>
            <h2 className="font-serif text-4xl text-villa-dark mb-6">500m² of Curated Luxury</h2>
            <div className="gold-divider" />
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-6">
              Spread across two floors, Villa Serenity offers five beautifully appointed bedrooms, multiple indoor and outdoor living spaces, a gourmet kitchen, and expansive terraces overlooking the infinity pool and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {amenities.map((item, i) => (
              <motion.div key={item.label} className="flex flex-col items-center gap-3 p-6 text-center bg-villa-cream" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <item.icon className="w-6 h-6 text-gold" />
                <span className="text-xs uppercase tracking-widest font-sans text-villa-charcoal">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="py-24 bg-villa-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4 font-sans">Bedrooms</p>
            <h2 className="font-serif text-4xl text-villa-dark">The Rooms</h2>
            <div className="gold-divider" />
          </motion.div>
          <div className="space-y-16">
            {rooms.map((room, i) => (
              <motion.div key={room.name} className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={room.img} alt={room.name} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3 font-sans">Bedroom {i + 1}</p>
                  <h3 className="font-serif text-3xl text-villa-dark mb-4">{room.name}</h3>
                  <div className="w-10 h-px bg-gold mb-5" />
                  <p className="text-muted-foreground leading-relaxed">{room.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-villa-dark text-center">
        <Link href="/booking" className="btn-gold text-xs px-10 py-4">Check Availability</Link>
      </section>
    </>
  );
}
