import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-4 sm:px-10 py-16 text-white">

      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Contact Us
        </h1>

        <p className="text-zinc-400">
          Have questions? Reach out to us anytime.
        </p>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center hover:scale-105 transition">
          <div className="text-2xl mb-3">📧</div>
          <p className="font-medium">Email</p>
          <p className="text-zinc-400 text-sm mt-1">
            support@ecommerce.com
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center hover:scale-105 transition">
          <div className="text-2xl mb-3">📞</div>
          <p className="font-medium">Phone</p>
          <p className="text-zinc-400 text-sm mt-1">
            +91 1234567890
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center hover:scale-105 transition">
          <div className="text-2xl mb-3">📍</div>
          <p className="font-medium">Location</p>
          <p className="text-zinc-400 text-sm mt-1">
            India
          </p>
        </div>

      </div>
      <div className="max-w-3xl mx-auto text-center mt-10">
        <Link
          href="/report-issue"
          className="inline-block bg-white text-black px-6 py-3 rounded-full font-medium hover:scale-105 transition"
        >
          🚨 Report an Issue or Feedback
        </Link>
      </div>


    </div>
  );
}
