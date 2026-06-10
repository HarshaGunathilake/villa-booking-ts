import { prisma } from "@/lib/prisma";
import PolicyPage from "@/components/layout/PolicyPage";

async function getContent() {
  try {
    const s = await prisma.villaSettings.findFirst({
      select: { privacyPolicy: true, villaName: true },
    });
    return { content: s?.privacyPolicy || "", villaName: s?.villaName || "Villa Serenity" };
  } catch {
    return { content: "", villaName: "Villa Serenity" };
  }
}

export default async function PrivacyPolicyPage() {
  const { content, villaName } = await getContent();
  return (
    <PolicyPage
      title="Privacy Policy"
      villaName={villaName}
      content={content}
      emptyMessage="Our Privacy Policy is being updated. Please check back shortly."
    />
  );
}
