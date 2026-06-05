"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "5", label: "Bedrooms", suffix: "" },
  { value: "10", label: "Max Guests", suffix: "+" },
  { value: "500", label: "Square Metres", suffix: "m²" },
  { value: "4.9", label: "Average Rating", suffix: "★" },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-villa-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p className="font-serif text-4xl text-gold mb-2">
                {stat.value}<span className="text-2xl">{stat.suffix}</span>
              </p>
              <p className="text-xs uppercase tracking-widest text-white/60 font-sans">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
