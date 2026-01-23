export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4 py-12">

      <div className="text-center text-zinc-400 mb-10 animate-pulse">
        Loading products...
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">

        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-4 animate-pulse"
          >
            <div className="h-40 bg-zinc-800 rounded-xl" />

            <div className="h-4 bg-zinc-800 rounded w-3/4" />

            <div className="h-4 bg-zinc-800 rounded w-1/2" />

            <div className="h-9 bg-zinc-800 rounded-full" />
          </div>
        ))}

      </div>

    </div>
  );
}
