import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  let settings = await prisma.villaSettings.findFirst();
  if (!settings) {
    settings = await prisma.villaSettings.create({
      data: { id: "singleton" },
    });
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-villa-dark mb-8">Villa Settings</h1>
      <SettingsForm settings={settings as any} />
    </div>
  );
}
