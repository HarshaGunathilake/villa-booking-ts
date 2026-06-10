export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import PagesEditor from "./PagesEditor";

export default async function AdminPagesPage() {
  let settings = await prisma.villaSettings.findFirst();
  if (!settings) {
    settings = await prisma.villaSettings.create({ data: { id: "singleton" } });
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-villa-dark mb-2">Pages</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Manage the content shown on your public Privacy Policy and Terms &amp; Conditions pages.
      </p>
      <PagesEditor
        privacyPolicy={settings.privacyPolicy ?? ""}
        termsAndConditions={settings.termsAndConditions ?? ""}
      />
    </div>
  );
}
