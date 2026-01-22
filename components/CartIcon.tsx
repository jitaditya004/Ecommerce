"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";

export default function CartIcon() {
  const { count } = useCart();

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart size={22} />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}
