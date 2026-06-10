interface Props {
  title: string;
  villaName: string;
  content: string;
  emptyMessage: string;
}

/**
 * Renders policy content stored as plain text.
 * - Double blank lines  → new section/paragraph gap
 * - Lines starting with a number + dot (1. 2.) → bold heading treatment
 * - Single line breaks within a block → preserved
 */
function renderContent(text: string) {
  // Split into blocks by double newline
  const blocks = text.split(/\n\s*\n/).filter((b) => b.trim());

  return blocks.map((block, i) => {
    const lines = block.trim().split("\n");
    const firstLine = lines[0].trim();

    // Detect heading: starts with number+dot, ALL CAPS line, or **text**
    const isNumberedHeading = /^\d+[\.\)]\s/.test(firstLine);
    const isAllCaps = firstLine === firstLine.toUpperCase() && firstLine.length > 3 && /[A-Z]/.test(firstLine);
    const isBoldHeading = firstLine.startsWith("**") && firstLine.endsWith("**");

    if (isNumberedHeading || isAllCaps || isBoldHeading) {
      const headingText = isBoldHeading ? firstLine.slice(2, -2) : firstLine;
      const bodyLines = lines.slice(1);
      return (
        <div key={i} className="mb-6">
          <h2 className="font-serif text-xl text-villa-dark font-semibold mb-2">
            {headingText}
          </h2>
          {bodyLines.length > 0 && (
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
              {bodyLines.join("\n")}
            </p>
          )}
        </div>
      );
    }

    return (
      <p key={i} className="text-sm leading-relaxed text-gray-700 mb-4 whitespace-pre-wrap">
        {block.trim()}
      </p>
    );
  });
}

export default function PolicyPage({ title, villaName, content, emptyMessage }: Props) {
  const hasContent = content.trim().length > 0;

  return (
    <>
      {/* Hero */}
      <section className="bg-villa-dark py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.4em] mt-10 text-gold font-sans mb-3">{villaName}</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white">{title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-villa-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {hasContent ? (
            <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12">
              <div className="prose-like">{renderContent(content)}</div>
              <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground">
                Last updated by {villaName} administration.
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
