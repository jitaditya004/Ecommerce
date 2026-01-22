"use client";

import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
// import { CartProvider } from "@/context/CartContext";
import { useState } from "react";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <AuthProvider>

        <Navbar onToggleSearch={() => setShowSearch(p => !p)} />
        <SearchBar visible={showSearch} />
        {children}

    </AuthProvider>
  );
}
