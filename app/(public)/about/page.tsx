"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-72 flex items-end pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070" alt="About Villa Serenity" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-villa-dark/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <p className="text-xs uppercase tracking-[0.4em] text-gold font-sans mb-2">Our Story</p>
          <h1 className="font-serif text-5xl text-white">About the Villa</h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-villa-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4 font-sans">Est. 2018</p>
              <h2 className="font-serif text-4xl text-villa-dark mb-6">A Vision of Refined Living</h2>
              <div className="w-12 h-px bg-gold mb-6" />
              <p className="text-muted-foreground leading-relaxed mb-4">
                Villa Serenity was born from a singular vision: to create a private sanctuary where luxury meets nature, and where every guest feels genuinely at home in the most extraordinary surroundings.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Designed by award-winning architects and interior designers, the villa seamlessly blends contemporary elegance with natural materials — stone, timber, and glass — to create an environment that is both visually stunning and deeply comfortable.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, Villa Serenity welcomes guests from around the world who seek something beyond a hotel — a home away from home, with all the privileges that entails.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=800" alt="Villa interior" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4 font-sans">Our Promise</p>
            <h2 className="font-serif text-4xl text-villa-dark mb-6">What Sets Us Apart</h2>
            <div className="gold-divider" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { title: "Personalised Service", desc: "From pre-arrival planning to in-villa assistance, our dedicated team anticipates your every need." },
              { title: "Absolute Privacy", desc: "Your exclusive rental means no shared spaces, no strangers — just you and your loved ones." },
              { title: "Sustainable Luxury", desc: "We are committed to responsible tourism, using solar energy, local produce, and eco-friendly practices." },
            ].map((item, i) => (
              <motion.div key={item.title} className="p-8 bg-villa-cream" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <h3 className="font-serif text-xl mb-3 text-villa-dark">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-villa-dark text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="font-serif text-3xl text-white mb-6">Ready to Experience It?</h2>
          <Link href="/booking" className="btn-gold text-xs px-10 py-4">Check Availability</Link>
        </motion.div>
      </section>
    </>
  );
}
