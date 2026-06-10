"use client";

import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import NextLink from "next/link";
import {
  Bold, Italic, UnderlineIcon, Heading1, Heading2, Heading3,
  List, ListOrdered, Link2, Link2Off, Minus, ExternalLink,
  Shield, FileText, RotateCcw, RotateCw,
} from "lucide-react";

interface Props {
  privacyPolicy: string;
  termsAndConditions: string;
}

type Tab = "privacy" | "terms";

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `p-1.5 rounded transition-colors ${active
      ? "bg-villa-dark text-white"
      : "text-gray-600 hover:bg-gray-100"}`;

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border bg-gray-50 rounded-t-lg">
      {/* History */}
      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={`${btn(false)} disabled:opacity-30`} title="Undo">
        <RotateCcw size={14} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={`${btn(false)} disabled:opacity-30`} title="Redo">
        <RotateCw size={14} />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Headings */}
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive("heading", { level: 1 }))} title="Heading 1">
        <Heading1 size={15} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))} title="Heading 2">
        <Heading2 size={15} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))} title="Heading 3">
        <Heading3 size={15} />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Inline */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))} title="Bold">
        <Bold size={14} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))} title="Italic">
        <Italic size={14} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive("underline"))} title="Underline">
        <UnderlineIcon size={14} />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Lists */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))} title="Bullet list">
        <List size={15} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))} title="Numbered list">
        <ListOrdered size={15} />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Divider & link */}
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)} title="Horizontal rule">
        <Minus size={14} />
      </button>
      <button type="button" onClick={setLink} className={btn(editor.isActive("link"))} title="Add link">
        <Link2 size={14} />
      </button>
      {editor.isActive("link") && (
        <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} className={btn(false)} title="Remove link">
          <Link2Off size={14} />
        </button>
      )}
    </div>
  );
}

function RichEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-gold underline" } }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[420px] px-6 py-5 focus:outline-none text-sm leading-relaxed",
      },
    },
  });

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-white">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

export default function PagesEditor({ privacyPolicy, termsAndConditions }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("privacy");
  const [privacy, setPrivacy] = useState(privacyPolicy);
  const [terms, setTerms] = useState(termsAndConditions);
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: "privacy" as Tab, label: "Privacy Policy", icon: Shield, href: "/privacy" },
    { id: "terms" as Tab, label: "Terms & Conditions", icon: FileText, href: "/terms" },
  ];

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

  const currentValue = activeTab === "privacy" ? privacy : terms;
  const isEmpty = !currentValue || currentValue === "<p></p>" || currentValue.trim() === "";

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
              Use the toolbar to format headings, lists, and bold text.
            </p>
          </div>
          <NextLink
            href={tabs.find((t) => t.id === activeTab)?.href || "#"}
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors"
          >
            <ExternalLink size={13} />
            Preview page
          </NextLink>
        </div>

        {activeTab === "privacy" ? (
          <RichEditor key="privacy" content={privacy} onChange={setPrivacy} />
        ) : (
          <RichEditor key="terms" content={terms} onChange={setTerms} />
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          {isEmpty ? (
            <p className="text-xs text-amber-600">
              No content yet — visitors will see a placeholder message.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {currentValue.replace(/<[^>]*>/g, "").length.toLocaleString()} characters
            </p>
          )}
          <Button
            onClick={save}
            disabled={saving || isEmpty}
            className="uppercase tracking-widest text-xs py-2.5 h-auto px-8"
          >
            {saving ? "Saving..." : "Save Page"}
          </Button>
        </div>
      </div>
    </div>
  );
}
