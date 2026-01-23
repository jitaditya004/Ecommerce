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
    <div className="flex flex-wrap gap-4 mb-6 items-center">

      <select title="sort" value={sort} onChange={e => update("sort", e.target.value)}>
        <option value="recent">Newest</option>
        <option value="price_asc">Price Low → High</option>
        <option value="price_desc">Price High → Low</option>
        <option value="name_asc">Name A-Z</option>
        <option value="reviews">Top Rated</option>
      </select>

      <select title="limit" value={String(limit)} onChange={e => update("limit", e.target.value)}>
        <option value="8">8</option>
        <option value="12">12</option>
        <option value="24">24</option>
      </select>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => update("page", String(page - 1))}
        >
          Prev
        </button>

        <span>{page} / {totalPages}</span>

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => update("page", String(page + 1))}
        >
          Next
        </button>
      </div>

    </div>
  );
}
