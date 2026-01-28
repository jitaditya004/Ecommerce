"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/admin" },
  { name: "Products", href: "/admin/products" },
  { name: "Create Products", href: "/admin/products/new" },
  { name: "Orders", href: "/admin/orders" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 hidden md:flex flex-col border-r border-zinc-800 bg-zinc-900">

      <div className="p-5 border-b border-zinc-800">
        <h2 className="text-lg font-bold tracking-wide">
          Admin Panel
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">

        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                block px-4 py-2 rounded-lg transition
                ${active
                  ? "bg-white text-black font-medium"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}
              `}
            >
              {link.name}
            </Link>
          );
        })}

      </nav>

    </aside>
  );
}
