import Link from "next/link";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getSettings() {
  try {
    return await prisma.villaSettings.findFirst();
  } catch {
    return null;
  }
}

export default async function Footer() {
  const s = await getSettings();

  const villaName = s?.villaName || "Villa Serenity";
  const email = s?.contactEmail || "";
  const phone = s?.contactPhone || "";
  const instagram = s?.instagramUrl || "";
  const facebook = s?.facebookUrl || "";

  return (
    <footer className="bg-villa-dark text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <span className="font-serif text-2xl text-white tracking-widest uppercase block">
                {villaName.split(" ")[0] || "Villa"}
              </span>
              <span className="font-serif text-sm text-gold tracking-[0.4em] uppercase">
                {villaName.split(" ").slice(1).join(" ") || "Serenity"}
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              An exclusive private retreat offering unparalleled luxury, breathtaking surroundings, and personalised service for discerning travellers.
            </p>
            <div className="flex gap-4 mt-6">
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-gold transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              )}
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-gold transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="text-white/50 hover:text-gold transition-colors" aria-label="Email">
                  <Mail size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest mb-6 font-sans">Explore</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/about", label: "About" },
                { href: "/accommodation", label: "The Villa" },
                { href: "/gallery", label: "Gallery" },
                { href: "/experiences", label: "Experiences" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest mb-6 font-sans">Contact</h4>
            <ul className="space-y-3 text-sm">
              {email && (
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-gold shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-gold transition-colors break-all">
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-gold shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-gold transition-colors">
                    {phone}
                  </a>
                </li>
              )}
            </ul>
            <div className="mt-6">
              <Link href="/booking" className="btn-outline-gold text-xs py-2.5 px-6 inline-block">
                Check Availability
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {villaName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
