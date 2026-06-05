"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Utensils, Waves, Mountain, Wine, Camera, Anchor } from "lucide-react";

const experiences = [
  { icon: Utensils, title: "Private Chef", description: "Enjoy bespoke menus crafted from fresh local ingredients by our expert private chef. From intimate breakfasts to lavish multi-course dinners, every meal is an event.", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800" },
  { icon: Waves, title: "Water Sports", description: "Access a curated selection of water sports — snorkelling, kayaking, paddleboarding, and boat excursions — all arranged exclusively for your group.", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800" },
  { icon: Mountain, title: "Nature Treks", description: "Guided hikes through breathtaking landscapes, with expert local guides who reveal hidden viewpoints and stories of the land.", img: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800" },
  { icon: Wine, title: "Wine & Dine", description: "Curated wine pairings and tasting experiences, with access to local vineyards and cellar tours for the discerning palate.", img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800" },
  { icon: Camera, title: "Villa Photography", description: "Capture memories with a professional photographer session — perfect for families, couples, or special celebrations.", img: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=800" },
  { icon: Anchor, title: "Boat Charters", description: "Explore the coastline in style aboard a privately chartered boat. Snorkel, swim, or simply soak in the scenery.", img: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800" },
];

export default function ExperiencesPage() {
  return (
    <>
      <section className="relative h-72 flex items-end pb-16">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070" alt="Experiences" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-villa-dark/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <p className="text-xs uppercase tracking-[0.4em] text-gold font-sans mb-2">Curated for You</p>
          <h1 className="font-serif text-5xl text-white">Experiences</h1>
        </div>
      </section>

      <section className="py-24 bg-villa-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4 font-sans">Beyond the Villa</p>
            <h2 className="font-serif text-4xl text-villa-dark">Exceptional Experiences</h2>
            <div className="gold-divider" />
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed mt-6">All experiences are optional extras, arranged privately for your group. Our concierge team will curate each one to your exact preferences.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp, i) => (
              <motion.div key={exp.title} className="bg-white overflow-hidden group" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="relative h-56 overflow-hidden">
                  <Image src={exp.img} alt={exp.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-villa-dark/30" />
                  <exp.icon className="absolute bottom-4 left-4 w-7 h-7 text-gold" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-villa-dark mb-3">{exp.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="text-center mt-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-muted-foreground mb-6">Interested in arranging a bespoke experience?</p>
            <Link href="/contact" className="btn-gold text-xs px-10 py-4">Contact Our Concierge</Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
