"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070"
          alt="Villa Serenity"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-xs uppercase tracking-[0.5em] text-gold mb-4 font-sans">
            Exclusive Private Retreat
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light mb-6 leading-tight">
            Villa{" "}
            <em className="italic text-gold">Serenity</em>
          </h1>
          <div className="w-16 h-px bg-gold mx-auto mb-6" />
          <p className="text-lg sm:text-xl font-light text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            An unparalleled sanctuary of luxury and tranquility, where every detail is crafted for your absolute comfort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="btn-gold text-xs px-10 py-4">
              Check Availability
            </Link>
            <Link href="/accommodation" className="btn-outline-gold text-xs px-10 py-4">
              Explore the Villa
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold/60" />
      </motion.div>
    </section>
  );
}
