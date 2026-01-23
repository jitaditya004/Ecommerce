import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4">
        <h2 className="font-bold mb-4">Admin Panel</h2>

        <nav className="space-y-2">
          <Link href="/admin" className="block">Dashboard</Link>
          <Link href="/admin/products" className="block">Products</Link>
          <Link href="/admin/orders" className="block">Orders</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
