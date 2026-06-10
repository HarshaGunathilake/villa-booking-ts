"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Image,
  Settings,
  LogOut,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/bookings", icon: BookOpen, label: "Bookings", exact: false },
  { href: "/admin/calendar", icon: Calendar, label: "Calendar", exact: false },
  { href: "/admin/inquiries", icon: MessageSquare, label: "Inquiries", exact: false },
  { href: "/admin/gallery", icon: Image, label: "Gallery", exact: false },
  { href: "/admin/pages", icon: FileText, label: "Pages", exact: false },
  { href: "/admin/settings", icon: Settings, label: "Settings", exact: false },
];

function NavLink({
  item,
  collapsed,
  onClick,
}: {
  item: (typeof navItems)[0];
  collapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group relative",
        collapsed ? "justify-center" : "",
        isActive
          ? "bg-gold text-white shadow-sm"
          : "text-white/70 hover:text-white hover:bg-white/10"
      )}
    >
      <item.icon size={18} className="shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {/* Tooltip on collapsed */}
      {collapsed && (
        <span className="absolute left-full ml-3 px-2 py-1 bg-villa-dark text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-white/10">
          {item.label}
        </span>
      )}
    </Link>
  );
}

function SidebarInner({
  collapsed,
  onToggleCollapse,
  isMobile,
  onClose,
}: {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  isMobile: boolean;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-villa-dark text-white">
      {/* Header */}
      <div
        className={cn(
          "flex items-center border-b border-white/10 min-h-[64px]",
          collapsed && !isMobile ? "px-3 justify-center" : "px-5 justify-between"
        )}
      >
        {(!collapsed || isMobile) && (
          <div className="min-w-0">
            <p className="font-serif text-lg leading-tight truncate">Villa Serenity</p>
            <p className="text-xs text-gold uppercase tracking-widest">Admin Panel</p>
          </div>
        )}

        {/* Desktop collapse toggle */}
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              "text-white/50 hover:text-white transition-colors p-1.5 rounded hover:bg-white/10",
              collapsed ? "" : "ml-2"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors ml-2"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed && !isMobile}
            onClick={isMobile ? onClose : undefined}
          />
        ))}
      </nav>

      {/* Sign Out */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          title={collapsed && !isMobile ? "Sign Out" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white w-full transition-colors rounded-lg hover:bg-white/10 group relative",
            collapsed && !isMobile ? "justify-center" : ""
          )}
        >
          <LogOut size={18} className="shrink-0" />
          {(!collapsed || isMobile) && <span>Sign Out</span>}
          {collapsed && !isMobile && (
            <span className="absolute left-full ml-3 px-2 py-1 bg-villa-dark text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-white/10">
              Sign Out
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close mobile sidebar on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* ── Mobile hamburger button ── */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 bg-villa-dark text-white p-2 rounded-lg shadow-lg hover:bg-villa-dark/90 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "w-[68px]" : "w-64"
        )}
      >
        <SidebarInner
          collapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((c) => !c)}
          isMobile={false}
        />
      </aside>

      {/* ── Mobile: backdrop ── */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-black/60 z-40 transition-opacity duration-300",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile: slide-in sidebar ── */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 h-full w-72 z-50 flex flex-col transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Mobile navigation"
      >
        <SidebarInner
          collapsed={false}
          isMobile={true}
          onClose={() => setIsMobileOpen(false)}
        />
      </aside>
    </>
  );
}
