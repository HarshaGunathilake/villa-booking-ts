export const dynamic = "force-dynamic";

import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-auto min-w-0">
        {/* pt-16 on mobile creates space below the fixed hamburger button */}
        <div className="pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
