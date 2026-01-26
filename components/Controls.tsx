"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Controls({ total }: { total: number }) {
  const router = useRouter();
  const params = useSearchParams();

  const page = Number(params.get("page") ?? 1);
  const limit = Number(params.get("limit") ?? 12);
  const sort = params.get("sort") ?? "recent";

  const totalPages = Math.ceil(total / limit);

  function update(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    p.set(key, value);
    router.push(`?${p.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">

      <div className="flex gap-3 flex-wrap">

        <select
          value={sort}
          onChange={(e) => update("sort", e.target.value)}
          className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white transition"
        >
          <option value="recent">Newest</option>
          <option value="price_asc">Price Low → High</option>
          <option value="price_desc">Price High → Low</option>
          <option value="name_asc">Name A-Z</option>
          <option value="reviews">Top Rated</option>
        </select>

        <select
          value={String(limit)}
          onChange={(e) => update("limit", e.target.value)}
          className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white transition"
        >
          <option value="8">8 / page</option>
          <option value="12">12 / page</option>
          <option value="24">24 / page</option>
        </select>

      </div>

      <div className="flex items-center gap-3 text-sm">

        <button
          disabled={page === 1}
          onClick={() => update("page", String(page - 1))}
          className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        <span className="text-zinc-400">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => update("page", String(page + 1))}
          className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>

      </div>

    </div>
  );
}
