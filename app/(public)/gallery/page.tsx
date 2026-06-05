"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200", alt: "Villa exterior at dusk", category: "exterior" },
  { src: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1200", alt: "Infinity pool", category: "pool" },
  { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200", alt: "Living room", category: "interior" },
  { src: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1200", alt: "Master bedroom", category: "bedroom" },
  { src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1200", alt: "Master bathroom", category: "interior" },
  { src: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=1200", alt: "Dining area", category: "interior" },
  { src: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200", alt: "Pool at night", category: "pool" },
  { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200", alt: "Garden suite", category: "bedroom" },
  { src: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200", alt: "Ocean view room", category: "bedroom" },
  { src: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200", alt: "Terrace view", category: "exterior" },
  { src: "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa1e?q=80&w=1200", alt: "Kitchen", category: "interior" },
  { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200", alt: "Villa gardens", category: "exterior" },
];

const categories = ["all", "exterior", "interior", "bedroom", "pool"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === "all" ? galleryImages : galleryImages.filter(img => img.category === activeCategory);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  };
  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filtered.length);
  };

  return (
    <>
      <section className="relative h-72 flex items-end pb-16">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070" alt="Gallery" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-villa-dark/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <p className="text-xs uppercase tracking-[0.4em] text-gold font-sans mb-2">Visual Tour</p>
          <h1 className="font-serif text-5xl text-white">Gallery</h1>
        </div>
      </section>

      <section className="py-16 bg-villa-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex gap-4 justify-center mb-12 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-widest font-sans px-6 py-2 transition-colors duration-200 ${activeCategory === cat ? "bg-gold text-white" : "border border-gold/50 text-gold hover:bg-gold hover:text-white"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence>
              {filtered.map((img, i) => (
                <motion.div
                  key={img.src}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative aspect-square overflow-hidden cursor-pointer group"
                  onClick={() => setLightboxIndex(i)}
                >
                  <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <p className="text-white text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="absolute left-4 text-white/70 hover:text-white z-10">
              <ChevronLeft size={40} />
            </button>
            <div className="relative w-full max-w-5xl max-h-[80vh] aspect-[4/3] mx-16" onClick={e => e.stopPropagation()}>
              <Image src={filtered[lightboxIndex].src} alt={filtered[lightboxIndex].alt} fill className="object-contain" sizes="90vw" />
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="absolute right-4 text-white/70 hover:text-white z-10">
              <ChevronRight size={40} />
            </button>
            <button onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 text-white/70 hover:text-white">
              <X size={28} />
            </button>
            <p className="absolute bottom-6 text-white/60 text-sm">{filtered[lightboxIndex].alt}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
