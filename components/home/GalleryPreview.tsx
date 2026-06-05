"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const images = [
  { src: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1000", alt: "Villa exterior" },
  { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000", alt: "Living room" },
  { src: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1000", alt: "Pool" },
  { src: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1000", alt: "Master bedroom" },
  { src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1000", alt: "Bathroom" },
  { src: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=1000", alt: "Dining area" },
];

export default function GalleryPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3 font-sans">Visual Tour</p>
          <h2 className="font-serif text-4xl text-villa-dark">A Glimpse of Serenity</h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden group aspect-[4/3]"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/gallery" className="btn-outline-gold text-xs">
            View Full Gallery
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
