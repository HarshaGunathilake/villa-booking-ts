import { prisma } from "@/lib/prisma";
import PolicyPage from "@/components/layout/PolicyPage";

async function getContent() {
  try {
    const s = await prisma.villaSettings.findFirst({
      select: { termsAndConditions: true, villaName: true },
    });
    return { content: s?.termsAndConditions || "", villaName: s?.villaName || "Villa Serenity" };
  } catch {
    return { content: "", villaName: "Villa Serenity" };
  }
}

export default async function TermsPage() {
  const { content, villaName } = await getContent();
  return (
    <PolicyPage
      title="Terms & Conditions"
      villaName={villaName}
      content={content}
      emptyMessage="Our Terms & Conditions are being updated. Please check back shortly."
    />
  );
}
