import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl text-villa-dark mb-8">Inquiries</h1>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Subject</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {inquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <p className="font-medium">{inq.name}</p>
                  <p className="text-xs text-muted-foreground">{inq.email}</p>
                </td>
                <td className="px-4 py-4">
                  <p>{inq.subject}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{inq.message}</p>
                </td>
                <td className="px-4 py-4">
                  <Badge variant={inq.status === "UNREAD" ? "pending" : "confirmed"}>
                    {inq.status}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-muted-foreground">{formatDate(inq.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {inquiries.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No inquiries yet</div>
        )}
      </div>
    </div>
  );
}
