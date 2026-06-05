import { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Villa Serenity | Luxury Private Villa",
  description: "Your private paradise awaits. Experience unparalleled luxury at Villa Serenity.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <GalleryPreview />
      <CTASection />
    </>
  );
}
