import { prisma } from "@/lib/prisma";
import ContactClient from "./ContactClient";

async function getSettings() {
  try {
    return await prisma.villaSettings.findFirst();
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const s = await getSettings();

  return (
    <ContactClient
      email={s?.contactEmail || ""}
      phone={s?.contactPhone || ""}
      whatsapp={s?.whatsapp || ""}
      address={s?.address || ""}
      instagram={s?.instagramUrl || ""}
      facebook={s?.facebookUrl || ""}
    />
  );
}
