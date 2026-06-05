"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Calendar, BookOpen, Image, Settings, LogOut, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/bookings", icon: BookOpen, label: "Bookings" },
  { href: "/admin/calendar", icon: Calendar, label: "Calendar" },
  { href: "/admin/inquiries", icon: MessageSquare, label: "Inquiries" },
  { href: "/admin/gallery", icon: Image, label: "Gallery" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-villa-dark text-white flex flex-col shrink-0">
      <div className="p-6 border-b border-white/10">
        <p className="font-serif text-lg">Villa Serenity</p>
        <p className="text-xs text-gold uppercase tracking-widest">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors",
              pathname === item.href
                ? "bg-gold text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            <item.icon size={17} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white w-full transition-colors"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
