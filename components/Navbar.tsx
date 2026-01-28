"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useEffect } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);


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
              <Link href="/login" className="text-zinc-400 hover:text-white">
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-white text-black px-4 py-2 rounded-full font-medium"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="relative hidden sm:block">

              <button
                onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-2 hover:text-white"
              >
                {user.name}
                <span className="text-xs">▾</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-zinc-800"
                  >
                    Profile
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-zinc-800"
                  >
                    Settings
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-yellow-400 hover:bg-zinc-800"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-zinc-800"
                  >
                    Logout
                  </button>

                </div>
              )}

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
      <div className="md:hidden absolute left-0 right-0 top-full bg-zinc-900 border-b border-zinc-800 px-6 py-5 space-y-4 animate-slideDown">

        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="block text-lg hover:text-white"
          >
            {item.label}
          </Link>
        ))}

        <div className="border-t border-zinc-800 pt-4">

          {!user ? (
            <div className="flex flex-col gap-3">

              <Link href="/login" onClick={() => setOpen(false)}>
                Login
              </Link>

              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="bg-white text-black px-4 py-2 rounded-full text-center"
              >
                Sign up
              </Link>

            </div>
          ) : (
            <div className="space-y-3 flex flex-col gap-3">

              <Link href="/profile" onClick={() => setOpen(false)}>
                Profile
              </Link>

              <Link href="/settings" onClick={() => setOpen(false)}>
                Settings
              </Link>

              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="text-yellow-400"
                >
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="text-left text-red-500"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>
    )}



    </nav>
  );
}
