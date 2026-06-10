"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { ExternalLink, FileText, Shield } from "lucide-react";
import Link from "next/link";

interface Props {
  privacyPolicy: string;
  termsAndConditions: string;
}

type Tab = "privacy" | "terms";

export default function PagesEditor({ privacyPolicy, termsAndConditions }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("privacy");
  const [privacy, setPrivacy] = useState(privacyPolicy);
  const [terms, setTerms] = useState(termsAndConditions);
  const [saving, setSaving] = useState(false);

  const isDirty =
    activeTab === "privacy"
      ? privacy !== privacyPolicy
      : terms !== termsAndConditions;

  const save = async () => {
    setSaving(true);
    try {
      const payload =
        activeTab === "privacy"
          ? { privacyPolicy: privacy }
          : { termsAndConditions: terms };

      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success("Page saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: any; href: string }[] = [
    { id: "privacy", label: "Privacy Policy", icon: Shield, href: "/privacy" },
    { id: "terms", label: "Terms & Conditions", icon: FileText, href: "/terms" },
  ];

  const currentValue = activeTab === "privacy" ? privacy : terms;
  const currentSetter = activeTab === "privacy" ? setPrivacy : setTerms;

  return (
    <div className="max-w-4xl">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border transition-colors ${
              activeTab === tab.id
                ? "bg-villa-dark text-white border-villa-dark"
                : "bg-white text-villa-dark border-border hover:border-villa-dark"
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editor card */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl text-villa-dark">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Use plain text. Press Enter for a new line, double Enter for a new paragraph.
              Wrap text in <code className="bg-gray-100 px-1 rounded">**bold**</code> for bold headings.
            </p>
          </div>
          <Link
            href={tabs.find((t) => t.id === activeTab)?.href || "#"}
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors"
          >
            <ExternalLink size={13} />
            Preview page
          </Link>
        </div>

        <Textarea
          value={currentValue}
          onChange={(e) => currentSetter(e.target.value)}
          placeholder={
            activeTab === "privacy"
              ? "Enter your Privacy Policy content here...\n\nExample:\n1. Information We Collect\nWe collect information you provide directly to us...\n\n2. How We Use Your Information\n..."
              : "Enter your Terms & Conditions content here...\n\nExample:\n1. Acceptance of Terms\nBy accessing our villa, you agree to these terms...\n\n2. Booking Policy\n..."
          }
          rows={24}
          className="font-mono text-sm resize-y leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {currentValue.length > 0
              ? `${currentValue.length.toLocaleString()} characters`
              : "No content yet"}
          </p>
          <Button
            onClick={save}
            disabled={saving || !currentValue.trim()}
            className="uppercase tracking-widest text-xs py-2.5 h-auto px-8"
          >
            {saving ? "Saving..." : "Save Page"}
          </Button>
        </div>
      </div>

      {/* Status hint */}
      {!currentValue.trim() && (
        <p className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-4 py-2">
          This page has no content yet. Visitors will see a "coming soon" message until you add content.
        </p>
      )}
    </div>
  );
}
