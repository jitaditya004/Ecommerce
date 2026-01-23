"use client";

export default function HomeClient() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white overflow-hidden">

      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />

      <section className="relative px-10 pt-28 pb-20 text-center">

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Discover Products You’ll Love
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-zinc-400">
          Premium quality. Curated collections. Seamless shopping experience.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">

          <button className="px-8 py-3 rounded-full bg-white text-black font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl">
            Shop Now
          </button>

          <button className="px-8 py-3 rounded-full border border-zinc-700 text-white transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-500">
            Browse Collection
          </button>

        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">

          <div className="p-6 rounded-2xl bg-zinc-900/70 backdrop-blur border border-zinc-800 hover:scale-105 transition">
            <h3 className="text-lg font-semibold">Fast Delivery</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Get products delivered within 48 hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/70 backdrop-blur border border-zinc-800 hover:scale-105 transition">
            <h3 className="text-lg font-semibold">Secure Payments</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Encrypted checkout with trusted gateways.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/70 backdrop-blur border border-zinc-800 hover:scale-105 transition">
            <h3 className="text-lg font-semibold">Premium Quality</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Carefully curated high quality products.
            </p>
          </div>

        </div>

        <div className="mt-20 flex justify-center gap-12 flex-wrap">

          <div className="text-center">
            <p className="text-3xl font-bold">10k+</p>
            <p className="text-sm text-zinc-400">Happy Customers</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold">2k+</p>
            <p className="text-sm text-zinc-400">Products</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold">4.9★</p>
            <p className="text-sm text-zinc-400">Average Rating</p>
          </div>

        </div>

      </section>
    </main>
  );
}
