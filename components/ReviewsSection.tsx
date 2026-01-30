"use client";

import { useState } from "react";
import { apifetch } from "@/lib/apiFetch";
import {useQuery,useMutation,useQueryClient}from"@tanstack/react-query";

interface Review {
  id: number;
  rating: number;
  content: string;
  user: string;
  created_at: string;
};

type ReviewsResponse = {
  reviews: Review[];
}

type AddReviewResponse = {
  success: true;
}

interface Props {
  productId:number;
}

const fetchReviews = async (productId:number):Promise<Review[]> => {
  const res = await apifetch<ReviewsResponse>(`/reviews/${productId}`);

  if (!res.ok) {
    throw new Error(res.message);
  }
  return res.data.reviews ?? [];
};

const addReview = async (productId:number, rating:number, content:string):Promise<void> => {
  const res = await apifetch<AddReviewResponse>("/reviews/add", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ productId, rating, content }),
  });
  if (!res.ok) {
    throw new Error(res.message);
  }
};


export default function ReviewsSection({ productId }: Props) {

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const { data: reviews, isLoading, isError } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => fetchReviews(productId),
  });

  const {mutate,isPending}=useMutation({
    mutationFn:()=>addReview(productId,rating,content),
    onSuccess:()=>{
      setContent("");
       queryClient.invalidateQueries({queryKey:["reviews",productId]});
    }
  });


  if (isLoading) {
    return <p className="text-zinc-400">Loading reviews...</p>;
  }

  if (isError || !reviews) {
    return <p className="text-red-400">Failed to load reviews</p>;
  }

  return (
    <div className="mt-12 text-white">

      <h2 className="text-2xl font-semibold mb-5">
        Customer Reviews
      </h2>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-8">

        <div className="flex flex-col sm:flex-row gap-3 mb-3">

          <select
            title="Rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white transition"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} ⭐
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => mutate()}
            disabled={isPending || content.trim() === "" || !content}
            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:scale-105 transition disabled:opacity-60"
          >
            {isPending ? "Posting..." : "Submit Review"}
          </button>

        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm placeholder-zinc-400 focus:outline-none focus:border-white transition resize-none"
          rows={3}
        />

      </div>

      <div className="space-y-4">

        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:scale-[1.01] transition"
          >
            <div className="flex justify-between items-center mb-1">

              <p className="font-medium">
                {r.user}
              </p>

              <span className="text-sm bg-zinc-800 px-2 py-1 rounded-full">
                ⭐ {r.rating}
              </span>

            </div>

            <p className="text-zinc-300 text-sm">
              {r.content}
            </p>

            <p className="text-xs text-zinc-500 mt-2">
              {new Date(r.created_at).toLocaleDateString()}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}
