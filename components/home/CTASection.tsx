"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2070"
          alt="Villa pool at sunset"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-villa-dark/70" />
      </div>
      <div className="relative z-10 text-center text-white px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4 font-sans">Begin Your Journey</p>
          <h2 className="font-serif text-4xl sm:text-5xl mb-6 font-light">
            Reserve Your <em className="italic text-gold">Escape</em>
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mb-6" />
          <p className="text-white/80 mb-10 leading-relaxed">
            Limited availability ensures your stay is truly exclusive. Check your preferred dates and begin your luxury escape.
          </p>
          <Link href="/booking" className="btn-gold text-xs px-12 py-4">
            Check Availability
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
