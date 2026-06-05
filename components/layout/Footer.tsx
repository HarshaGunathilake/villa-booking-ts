import Link from "next/link";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-villa-dark text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <span className="font-serif text-2xl text-white tracking-widest uppercase block">Villa</span>
              <span className="font-serif text-sm text-gold tracking-[0.4em] uppercase">Serenity</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              An exclusive private retreat offering unparalleled luxury, breathtaking surroundings, and personalised service for discerning travellers.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-white/50 hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/50 hover:text-gold transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="mailto:info@villa.com" className="text-white/50 hover:text-gold transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
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
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-gold shrink-0" />
                <a href="mailto:info@villaserenity.com" className="hover:text-gold transition-colors">
                  info@villaserenity.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-gold shrink-0" />
                <a href="tel:+1234567890" className="hover:text-gold transition-colors">
                  +1 234 567 890
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/booking" className="btn-outline-gold text-xs py-2.5 px-6 inline-block">
                Check Availability
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Villa Serenity. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
