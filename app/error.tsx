"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">

      <h1 className="text-3xl font-bold mb-3">
        Something went wrong
      </h1>

      <p className="text-zinc-400 max-w-md text-center mb-6">
        {process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again later."}
      </p>

      <button
        onClick={reset}
        className="bg-white text-black px-5 py-2 rounded-lg"
      >
        Retry
      </button>

    </div>
  );
}
