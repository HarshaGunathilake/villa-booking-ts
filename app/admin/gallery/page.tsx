export default function AdminGalleryPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-villa-dark mb-4">Gallery Management</h1>
      <p className="text-muted-foreground mb-8">Manage gallery images below. Images are currently sourced from Unsplash. Replace URLs in <code className="bg-gray-100 px-1 rounded text-sm">components/home/GalleryPreview.tsx</code> and <code className="bg-gray-100 px-1 rounded text-sm">app/(public)/gallery/page.tsx</code> with your own hosted images.</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
        <strong>Future enhancement:</strong> Connect a cloud storage provider (e.g., Cloudinary, AWS S3) to enable image uploads directly from this panel. Update the prisma schema to include a GalleryImage model with url, alt, category, and order fields.
      </div>
    </div>
  );
}
