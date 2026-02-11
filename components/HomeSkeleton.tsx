export default function HomeSkeleton() {
  return (
    <main className="relative min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-white overflow-hidden animate-pulse">
      {/* background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-zinc-800/30 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-32 w-96 h-96 bg-zinc-800/30 rounded-full blur-3xl" />

      <section className="relative px-4 sm:px-10 pt-28 pb-20 text-center">
        {/* title */}
        <div className="mx-auto h-12 sm:h-14 md:h-16 w-3/4 max-w-3xl rounded-lg bg-zinc-800" />

        {/* subtitle */}
        <div className="mx-auto mt-6 h-4 sm:h-5 w-2/3 max-w-2xl rounded bg-zinc-800" />

        {/* buttons */}
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <div className="h-11 w-36 rounded-full bg-zinc-800" />
          <div className="h-11 w-40 rounded-full bg-zinc-800" />
        </div>

        {/* product grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-zinc-900/80 rounded-2xl overflow-hidden border border-zinc-800"
            >
              <div className="h-56 w-full bg-zinc-800" />

              <div className="p-5 space-y-3">
                <div className="h-5 w-2/3 rounded bg-zinc-800" />
                <div className="h-4 w-1/3 rounded bg-zinc-800" />
                <div className="h-4 w-24 rounded bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>

        {/* features */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3"
            >
              <div className="h-5 w-1/2 rounded bg-zinc-800" />
              <div className="h-4 w-full rounded bg-zinc-800" />
              <div className="h-4 w-3/4 rounded bg-zinc-800" />
            </div>
          ))}
        </div>

        {/* stats */}
        <div className="mt-20 flex justify-center gap-10 sm:gap-12 flex-wrap">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="mx-auto h-8 w-16 rounded bg-zinc-800" />
              <div className="mx-auto h-4 w-24 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
