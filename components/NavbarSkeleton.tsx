export default function NavbarSkeleton() {
  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-800 animate-pulse">
      <div className="flex items-center justify-between px-4 sm:px-10 py-4">
        <div className="h-6 w-32 bg-zinc-800 rounded" />

        <div className="hidden md:flex gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-16 bg-zinc-800 rounded" />
          ))}
        </div>

        <div className="flex gap-4">
          <div className="h-6 w-6 bg-zinc-800 rounded-full" />
          <div className="h-6 w-6 bg-zinc-800 rounded-full" />
          <div className="h-8 w-20 bg-zinc-800 rounded-full hidden sm:block" />
        </div>
      </div>
    </nav>
  );
}
