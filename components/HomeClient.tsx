"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomeClient() {
  return (
    <main className="relative min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-white overflow-hidden">

      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />

      <section className="relative px-4 sm:px-10 pt-28 pb-20 text-center">

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent animate-fade-up">
          Discover Products You’ll Love
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 animate-fade-up delay-100">
          Premium quality. Curated collections. Seamless shopping experience.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap animate-fade-up delay-200">

          <Link href="/collection" className="px-8 py-3 rounded-full bg-white text-black font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95">
            Shop Now
          </Link>

          <Link href="/collection" className="px-8 py-3 rounded-full border border-zinc-700 text-white transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-500 active:scale-95">
            Browse Collection
          </Link>

        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
{/* hardcoded products for now */}
        {[
          {
            title: "Apple Watch",
            price: "$129",
            img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
          },
          {
            title: "Smart Watch",
            price: "$199",
            img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
          },
          {
            title: "Sneakers",
            price: "$149",
            img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
          },
        ].map((product) => (
          <div
            key={product.title}
            className="group bg-zinc-900/80 rounded-2xl overflow-hidden border border-zinc-800 hover:scale-105 transition"
          >
            <div className="overflow-hidden">
              <Image
                src={product.img}
                alt={product.title}
                width={400}
                height={300}
                className="h-56 w-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-lg">{product.title}</h3>
              <p className="mt-1 text-zinc-400">{product.price}</p>

              <Link
                href="/collection"
                className="inline-block mt-4 text-sm font-medium text-purple-400 hover:text-purple-300"
              >
                View Product →
              </Link>
            </div>
          </div>
        ))}

      </div>


        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">

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

        <div className="mt-20 flex justify-center gap-10 sm:gap-12 flex-wrap">

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
