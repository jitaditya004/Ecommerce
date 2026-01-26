export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4 sm:px-10 py-16 text-white">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-center">
          About Us
        </h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl leading-relaxed text-zinc-300">

          <p>
            We are a modern ecommerce platform focused on delivering
            high quality products with a smooth and reliable shopping
            experience.
          </p>

          <p className="mt-4">
            This project is built using{" "}
            <span className="text-white font-medium">Next.js</span>,{" "}
            <span className="text-white font-medium">PostgreSQL</span>, and
            modern authentication practices to ensure performance,
            security, and scalability.
          </p>

        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center hover:scale-105 transition">
            <p className="text-2xl mb-2">⚡</p>
            <p className="font-semibold">Fast Performance</p>
            <p className="text-sm text-zinc-400 mt-2">
              Optimized APIs and caching
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center hover:scale-105 transition">
            <p className="text-2xl mb-2">🔒</p>
            <p className="font-semibold">Secure Auth</p>
            <p className="text-sm text-zinc-400 mt-2">
              JWT & session based login
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center hover:scale-105 transition">
            <p className="text-2xl mb-2">🎯</p>
            <p className="font-semibold">Modern Stack</p>
            <p className="text-sm text-zinc-400 mt-2">
              Next.js + PostgreSQL
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
