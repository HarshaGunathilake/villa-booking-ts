"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "What is the minimum stay?", a: "The minimum stay at Villa Serenity is 3 nights. During peak season (July, August, and December holidays), a minimum of 7 nights may apply." },
  { q: "How many guests can the villa accommodate?", a: "Villa Serenity comfortably accommodates up to 10 guests across 5 bedrooms. Additional guests may be accommodated with prior arrangement." },
  { q: "Is there a pool at the villa?", a: "Yes, the villa features a stunning infinity pool and a separate jacuzzi, both with panoramic views. The pool is exclusively available to villa guests." },
  { q: "Can we bring children?", a: "Absolutely — families are very welcome. The villa features safe pool areas and we can arrange child-friendly activities. Please note the pool is not fenced, so parental supervision is required." },
  { q: "Are pets allowed?", a: "We welcome well-behaved pets with prior approval. A small pet supplement may apply. Please inform us at the time of enquiry." },
  { q: "What is included in the rental?", a: "The rental includes use of all villa facilities, daily housekeeping, welcome hamper, high-speed WiFi, and parking. Private chef, activities, and transfers are optional extras." },
  { q: "Is there a private chef?", a: "A private chef service is available as an optional extra. Our chef can prepare any cuisine style and accommodate dietary requirements. Grocery costs are additional." },
  { q: "What are the check-in and check-out times?", a: "Standard check-in is at 3:00 PM and check-out at 11:00 AM. Early check-in and late check-out may be arranged subject to availability, and may incur additional charges." },
  { q: "How do I confirm a booking?", a: "After submitting your booking request, we will confirm availability within 24 hours. A deposit of 30% is typically required to secure the dates, with the balance due 60 days before arrival." },
  { q: "What is the cancellation policy?", a: "Cancellations made more than 60 days before arrival receive a full refund of the deposit. Cancellations within 30–60 days forfeit 50% of the deposit. Cancellations within 30 days are non-refundable. We strongly recommend travel insurance." },
];

export default function FAQPage() {
  return (
    <>
      <section className="relative h-72 flex items-end pb-16">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=2070" alt="FAQ" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-villa-dark/65" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <p className="text-xs uppercase tracking-[0.4em] text-gold font-sans mb-2">Need Help?</p>
          <h1 className="font-serif text-5xl text-white">Frequently Asked Questions</h1>
        </div>
      </section>

      <section className="py-24 bg-villa-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-serif text-3xl text-villa-dark mb-4">Everything You Need to Know</h2>
            <div className="gold-divider" />
          </motion.div>

          <Accordion.Root type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <Accordion.Item value={`item-${i}`} className="bg-white border border-border">
                  <Accordion.Header>
                    <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-5 text-left font-serif text-lg text-villa-dark hover:text-gold transition-colors group">
                      {faq.q}
                      <ChevronDown className="h-4 w-4 text-gold shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <p className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                  </Accordion.Content>
                </Accordion.Item>
              </motion.div>
            ))}
          </Accordion.Root>

          <motion.div className="text-center mt-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-muted-foreground mb-6">Couldn't find your answer? We're happy to help.</p>
            <Link href="/contact" className="btn-gold text-xs px-10 py-4">Contact Us</Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
