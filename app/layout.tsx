import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Villa Serenity | Luxury Private Villa",
    template: "%s | Villa Serenity",
  },
  description:
    "Experience unparalleled luxury at Villa Serenity — an exclusive private villa offering breathtaking surroundings, world-class amenities, and personalised service.",
  keywords: ["luxury villa", "private villa rental", "exclusive retreat", "villa holiday"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Villa Serenity",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Villa Serenity | Luxury Private Villa",
    description: "Experience unparalleled luxury at Villa Serenity.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: "var(--font-inter)", fontSize: "14px" },
            success: { iconTheme: { primary: "#C9A96E", secondary: "white" } },
          }}
        />
      </body>
    </html>
  );
}
