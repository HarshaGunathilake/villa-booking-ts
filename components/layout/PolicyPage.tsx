interface Props {
  title: string;
  villaName: string;
  content: string;
  emptyMessage: string;
}

export default function PolicyPage({ title, villaName, content, emptyMessage }: Props) {
  const hasContent = content.replace(/<[^>]*>/g, "").trim().length > 0;

  return (
    <>
      {/* Hero */}
      <section className="bg-villa-dark py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold font-sans mb-3">{villaName}</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white">{title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-villa-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {hasContent ? (
            <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12">
              <div
                className="
                  prose prose-sm max-w-none
                  prose-headings:font-serif prose-headings:text-villa-dark
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-li:text-gray-700
                  prose-a:text-gold prose-a:underline hover:prose-a:opacity-80
                  prose-hr:border-border prose-strong:text-villa-dark
                "
                dangerouslySetInnerHTML={{ __html: content }}
              />
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
