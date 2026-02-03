import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-zinc-950 text-white">

      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-linear-to-br from-zinc-950 via-zinc-900 to-black">
        {children}
      </main>

    </div>
  );
}
