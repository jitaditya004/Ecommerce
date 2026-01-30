"use client";

import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
// import { CartProvider } from "@/context/CartContext";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {


  const [showSearch, setShowSearch] = useState(false);
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
    <AuthProvider>

        <Navbar onToggleSearch={() => setShowSearch(p => !p)} />
        <SearchBar visible={showSearch} />
        {children}

    </AuthProvider>
    </QueryClientProvider>
  );
}
