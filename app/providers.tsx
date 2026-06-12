"use client";

import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { useState, Suspense } from "react";
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
        <Navbar onToggleSearch={() => setShowSearch((p) => !p)} />

        <Suspense fallback={null}>
          <SearchBar visible={showSearch} />
        </Suspense>

        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}