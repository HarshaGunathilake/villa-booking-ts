"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof schema>;

interface Props {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  instagram: string;
  facebook: string;
}

export default function ContactClient({ email, phone, whatsapp, address, instagram, facebook }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Message sent! We'll be in touch shortly.");
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const contactRows = [
    email && {
      icon: Mail,
      label: "Email",
      display: email,
      href: `mailto:${email}`,
    },
    (phone || whatsapp) && {
      icon: Phone,
      label: "Phone / WhatsApp",
      display: phone || whatsapp,
      href: `tel:${phone || whatsapp}`,
    },
    address && {
      icon: MapPin,
      label: "Location",
      display: address,
      href: null,
    },
  ].filter(Boolean) as { icon: any; label: string; display: string; href: string | null }[];

  return (
    <>
      <section className="relative h-72 flex items-end pb-16">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070"
            alt="Contact"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-villa-dark/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <p className="text-xs uppercase tracking-[0.4em] text-gold font-sans mb-2">Get in Touch</p>
          <h1 className="font-serif text-5xl text-white">Contact Us</h1>
        </div>
      </section>

      <section className="py-24 bg-villa-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16">
            {/* Contact Info */}
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4 font-sans">Reach Us</p>
              <h2 className="font-serif text-3xl text-villa-dark mb-6">We'd Love to Hear From You</h2>
              <div className="w-10 h-px bg-gold mb-8" />

              <div className="space-y-6">
                {contactRows.map((row) => (
                  <div key={row.label} className="flex gap-4">
                    <row.icon className="text-gold mt-1 shrink-0" size={18} />
                    <div>
                      <p className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-1">{row.label}</p>
                      {row.href ? (
                        <a href={row.href} className="text-villa-dark hover:text-gold transition-colors text-sm">
                          {row.display}
                        </a>
                      ) : (
                        <p className="text-sm text-villa-dark">{row.display}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Social links */}
                {(instagram || facebook || whatsapp) && (
                  <div className="flex gap-4 pt-2">
                    {instagram && (
                      <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-villa-dark/50 hover:text-gold transition-colors" aria-label="Instagram">
                        <Instagram size={20} />
                      </a>
                    )}
                    {facebook && (
                      <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-villa-dark/50 hover:text-gold transition-colors" aria-label="Facebook">
                        <Facebook size={20} />
                      </a>
                    )}
                    {whatsapp && (
                      <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-villa-dark/50 hover:text-gold transition-colors" aria-label="WhatsApp">
                        <MessageCircle size={20} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              className="md:col-span-3 bg-white p-10"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} placeholder="Your name" />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="your@email.com" />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" {...register("subject")} placeholder="How can we help?" />
                  {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" {...register("message")} placeholder="Your message..." rows={5} />
                  {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full uppercase tracking-widest text-xs py-3 h-auto">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
