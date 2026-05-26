type LoadingSpinnerProps = {
  text?: string;
};

export default function LoadingSpinner({
  text = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-4">

      <div className="flex flex-col items-center gap-5">

        <div className="relative h-16 w-16">

          <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>

          <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"></div>

        </div>

        <p className="text-zinc-400 text-sm tracking-wide animate-pulse">
          {text}
        </p>

      </div>

    </div>
  );
}