"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/collection" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  
];


type NavbarProps = {
  onToggleSearch: () => void;
};

export default function Navbar({ onToggleSearch }: NavbarProps) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  if (loading) return null;

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">

      <div className="flex items-center justify-between px-4 sm:px-10 py-4">

        <div className="text-xl font-bold tracking-wide text-white">
          E<span className="text-zinc-400">commerce</span>
        </div>

        <div className="hidden md:flex gap-8 text-sm text-zinc-300">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative group"
              >
                <span className="transition group-hover:text-white">
                  {item.label}
                </span>

                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-white transition-all duration-300
                  ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-sm text-zinc-300">

          <button
            onClick={onToggleSearch}
            className="hover:scale-110 transition-transform"
          >
            🔍
          </button>

          <Link
            href="/cart"
            className="relative hover:scale-110 transition-transform"
          >
            🛒

            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-black text-[10px] px-1.5 rounded-full animate-pulse">
                {count}
              </span>
            )}
          </Link>

          <div className="hidden sm:block">
            <Link href="/wishlist" className="hover:text-white transition">
              ❤️ Wishlist
            </Link>
          </div>

          {user && (
            <Link
              href="/orders"
              className="hidden sm:block hover:text-white transition"
            >
              📦 My Orders
            </Link>
          )}

          {!user ? (
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/login"
                className="text-zinc-400 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-white text-black px-4 py-2 rounded-full font-medium hover:scale-105 transition"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-zinc-400">{user.name}</span>

              <button
                onClick={logout}
                className="text-red-500 hover:text-red-400 transition"
              >
                Logout
              </button>
            </div>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-xl"
          >
            ☰
          </button>

        </div>
      </div>

      {open && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-6 py-4 space-y-4 text-zinc-300">

          {NAV_ITEMS.map((item) => {
            

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block hover:text-white transition"
              >
                {item.label}
              </Link>
            );
          })}

          {!user ? (
            <div className="flex flex-col gap-3 pt-2">
              <Link href="/login">Login</Link>
              <Link href="/signup" className="bg-white text-black px-4 py-2 rounded-full text-center">
                Sign up
              </Link>
            </div>
          ) : (
            <button
              onClick={logout}
              className="text-red-500"
            >
              Logout
            </button>
          )}

        </div>
      )}

    </nav>
  );
}
