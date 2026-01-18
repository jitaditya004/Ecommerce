"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";


const NAV_ITEMS = ["Home", "Collection", "About", "Contact"];

type NavbarProps = {
  onToggleSearch: () => void;
};

export default function Navbar({ onToggleSearch }: NavbarProps) {
  const [active, setActive] = useState("Home");
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="flex items-center justify-between px-10 py-4">

        {/* Logo */}
        <div className="text-xl font-bold tracking-wide">
          E<span className="text-gray-400">commerce</span>
        </div>

        {/* Nav */}
        <div className="flex gap-8 text-sm">
          {NAV_ITEMS.map((item) => {
            const path =
              item === "Home"
                ? "/"
                : `/${item.toLowerCase()}`;

            const isActive = pathname === path;

            return (
              <Link
                key={item}
                href={path}
                className="relative cursor-pointer"
              >
                {item}

                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all
                    ${isActive ? "w-full" : "w-0"}
                  `}
                />
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5 text-sm">
          <button onClick={onToggleSearch} className="hover:scale-110 transition">
            🔍
          </button>

          <Link href="/cart" className="hover:scale-110 transition">
            🛒
          </Link>

          {!user ? (
            <>
              <a href="/login" className="text-gray-600 hover:text-black">
                Login
              </a>
              <a
                href="/signup"
                className="bg-black text-white px-4 py-2 rounded-full hover:scale-105 transition"
              >
                Sign up
              </a>
            </>
          ) : (
            <>
              <span className="text-gray-600">{user.email}</span>
              <button onClick={logout} className="text-red-600">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
