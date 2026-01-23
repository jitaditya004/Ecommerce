"use client";

import { useEffect, useState } from "react";

type Review = {
  id: number;
  rating: number;
  content: string;
  user: string;
  created_at: string;
};

export default function ReviewsSection({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchReviews() {
    const res = await fetch(`/api/reviews/${productId}`);
    const data = await res.json();
    setReviews(data);
  }

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  async function submitReview() {
    if (!content) return;

    setLoading(true);

    await fetch("/api/reviews/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        productId,
        rating,
        content,
      }),
    });

    setContent("");
    await fetchReviews();
    setLoading(false);
  }

  return (
    <div className="mt-12">

      <h2 className="text-xl font-semibold mb-4">
        Reviews
      </h2>

      {/* Add Review */}

      <div className="border p-4 rounded mb-6">
        <select
          title="Rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>{n} ⭐</option>
          ))}
        </select>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review..."
          className="w-full border mt-2 p-2"
        />

        <button
            type="button"
          onClick={submitReview}
          disabled={loading}
          className="mt-2 bg-black text-white px-4 py-2"
        >
          Submit Review
        </button>
      </div>

      {/* Reviews List */}

      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="border p-3 rounded">
            <p className="font-semibold">
              {r.user} ⭐ {r.rating}
            </p>

            <p className="text-gray-700">
              {r.content}
            </p>

            <p className="text-sm text-gray-400">
              {new Date(r.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
