"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { VillaSettings } from "@/types";

const schema = z.object({
  villaName: z.string().min(1),
  tagline: z.string(),
  description: z.string(),
  maxGuests: z.coerce.number().min(1),
  bedrooms: z.coerce.number().min(1),
  bathrooms: z.coerce.number().min(1),
  minNights: z.coerce.number().min(1),
  checkInTime: z.string(),
  checkOutTime: z.string(),
  pricePerNight: z.coerce.number().min(0),
  currency: z.string(),
  address: z.string(),
  contactEmail: z.string(),
  contactPhone: z.string(),
  whatsapp: z.string(),
  instagramUrl: z.string(),
  facebookUrl: z.string(),
  googleMapsEmbedUrl: z.string(),
});

type SettingsFormData = z.infer<typeof schema>;

export default function SettingsForm({ settings }: { settings: VillaSettings }) {
  const { register, handleSubmit, formState: { isSubmitting, isDirty } } = useForm<SettingsFormData>({
    resolver: zodResolver(schema),
    defaultValues: settings,
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <h2 className="font-serif text-xl">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Villa Name</Label>
            <Input {...register("villaName")} />
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input {...register("tagline")} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea {...register("description")} rows={4} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <h2 className="font-serif text-xl">Capacity & Pricing</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Max Guests</Label>
            <Input type="number" {...register("maxGuests")} />
          </div>
          <div className="space-y-2">
            <Label>Bedrooms</Label>
            <Input type="number" {...register("bedrooms")} />
          </div>
          <div className="space-y-2">
            <Label>Bathrooms</Label>
            <Input type="number" {...register("bathrooms")} />
          </div>
          <div className="space-y-2">
            <Label>Min Nights</Label>
            <Input type="number" {...register("minNights")} />
          </div>
          <div className="space-y-2">
            <Label>Price/Night</Label>
            <Input type="number" {...register("pricePerNight")} />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input {...register("currency")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Check-in Time</Label>
            <Input type="time" {...register("checkInTime")} />
          </div>
          <div className="space-y-2">
            <Label>Check-out Time</Label>
            <Input type="time" {...register("checkOutTime")} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <h2 className="font-serif text-xl">Contact & Social</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input type="email" {...register("contactEmail")} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input {...register("contactPhone")} />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input {...register("whatsapp")} />
          </div>
          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input {...register("instagramUrl")} />
          </div>
          <div className="space-y-2">
            <Label>Facebook URL</Label>
            <Input {...register("facebookUrl")} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Input {...register("address")} />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting || !isDirty} className="uppercase tracking-widest text-xs py-3 h-auto px-8">
        {isSubmitting ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
