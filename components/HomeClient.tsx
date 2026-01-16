"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

export default function HomeClient() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar onToggleSearch={() => setShowSearch(p => !p)} />
      <SearchBar visible={showSearch} />

      {/* Hero Section */}
      <section className="px-10 pt-20 pb-24 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
          Discover Products You’ll Love
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
          Premium quality. Curated collections. Seamless shopping experience.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="bg-black text-white px-8 py-3 rounded-full">
            Shop Now
          </button>

          <button className="border px-8 py-3 rounded-full">
            Browse Collection
          </button>
        </div>
      </section>
    </main>
  );
}
