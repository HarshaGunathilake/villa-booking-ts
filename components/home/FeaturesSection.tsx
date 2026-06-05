"use client";

import { motion } from "framer-motion";
import { Waves, Users, Star, MapPin } from "lucide-react";

const features = [
  { icon: Star, title: "5-Star Luxury", description: "Every amenity curated for the most discerning guests." },
  { icon: Users, title: "Exclusively Yours", description: "Complete privacy — the entire villa reserved just for you." },
  { icon: Waves, title: "Infinity Pool", description: "Swim in our stunning infinity pool with panoramic views." },
  { icon: MapPin, title: "Prime Location", description: "Set in a breathtaking location surrounded by natural beauty." },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-villa-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3 font-sans">Why Choose Us</p>
          <h2 className="font-serif text-4xl text-villa-dark">The Serenity Experience</h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="text-center p-8 bg-white group hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <feature.icon className="w-8 h-8 text-gold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-serif text-xl mb-3 text-villa-dark">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
