"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type SearchBarProps = {
  visible: boolean;
};

export default function SearchBar({ visible }: SearchBarProps) {
  const searchParams = useSearchParams();

  return (
    <SearchInput
      visible={visible}
      initialQuery={searchParams.get("q") ?? ""}
    />
  );
}


function SearchInput({
  visible,
  initialQuery,
}: {
  visible: boolean;
  initialQuery: string;
}) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = query.trim();

    if (!trimmed) return;

    router.push(
      `/search?q=${encodeURIComponent(trimmed)}`
    );
  };

  return (
    <div
      className={`
        overflow-hidden transition-all duration-300
        ${visible ? "max-h-28 opacity-100" : "max-h-0 opacity-0"}
      `}
    >
      <div className="bg-zinc-950/90 backdrop-blur border-t border-zinc-800 px-4 sm:px-10 py-4">

        <form onSubmit={handleSubmit}>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="
              w-full rounded-full bg-zinc-900 border border-zinc-700 px-6 py-3
              text-white placeholder-zinc-400
              focus:outline-none focus:border-white transition
            "
          />

        </form>

      </div>
    </div>
  );
}